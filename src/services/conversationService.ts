import { supabase } from '../lib/supabase';
import { geminiService, type Message } from '../lib/gemini';

export interface ConversationSession {
  id: string;
  userId: string;
  messages: Message[];
  extractedInfo: Record<string, any>;
  stage: string;
  aiNotes: Record<string, any>;
}

export class ConversationService {
  async createSession(userId: string): Promise<string> {
    const { data, error } = await supabase
      .from('conversation_sessions')
      .insert({
        user_id: userId,
        conversation_stage: 'initial',
        is_active: true,
        extracted_info: {},
        ai_notes: {}
      } as any)
      .select()
      .maybeSingle();

    if (error) throw error;
    return (data as any).id;
  }

  async getActiveSession(userId: string): Promise<ConversationSession | null> {
    const { data: session, error: sessionError } = await supabase
      .from('conversation_sessions')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('session_started_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (sessionError) throw sessionError;
    if (!session) return null;

    const sessionAny = session as any;

    const { data: messages, error: messagesError } = await supabase
      .from('conversation_messages')
      .select('*')
      .eq('session_id', sessionAny.id)
      .order('timestamp', { ascending: true });

    if (messagesError) throw messagesError;

    return {
      id: sessionAny.id,
      userId: sessionAny.user_id!,
      messages: ((messages || []) as any[]).map(m => ({
        role: m.role as 'user' | 'assistant' | 'system',
        content: m.content
      })),
      extractedInfo: (sessionAny.extracted_info as Record<string, any>) || {},
      stage: sessionAny.conversation_stage || 'initial',
      aiNotes: (sessionAny.ai_notes as Record<string, any>) || {}
    };
  }

  async sendMessage(sessionId: string, userId: string, userMessage: string): Promise<Message> {
    await supabase
      .from('conversation_messages')
      .insert({
        session_id: sessionId,
        role: 'user',
        content: userMessage,
        information_extracted: {}
      } as any);

    const session = await this.getSessionById(sessionId);
    if (!session) throw new Error('Session not found');

    const allMessages = [...session.messages, { role: 'user' as const, content: userMessage }];

    const aiResponse = await geminiService.chat(allMessages, {
      extractedInfo: session.extractedInfo,
      stage: session.stage,
      userId
    });

    const assistantMessage: Message = {
      role: 'assistant',
      content: aiResponse.message
    };

    await supabase
      .from('conversation_messages')
      .insert({
        session_id: sessionId,
        role: 'assistant',
        content: aiResponse.message,
        intent_detected: aiResponse.conversationStage,
        information_extracted: aiResponse.extractedInfo || {}
      } as any);

    const updatedExtractedInfo = {
      ...session.extractedInfo,
      ...(aiResponse.extractedInfo || {})
    };

    const updateData: any = {
      extracted_info: updatedExtractedInfo,
      conversation_stage: aiResponse.conversationStage || session.stage,
      ai_notes: {
        ...session.aiNotes,
        suggestedStrategies: aiResponse.suggestedStrategies || []
      }
    };

    await (supabase as any)
      .from('conversation_sessions')
      .update(updateData)
      .eq('id', sessionId);

    if (aiResponse.extractedInfo) {
      await this.persistExtractedInfo(userId, aiResponse.extractedInfo);
    }

    return assistantMessage;
  }

  private async getSessionById(sessionId: string): Promise<ConversationSession | null> {
    const { data: session, error: sessionError } = await supabase
      .from('conversation_sessions')
      .select('*')
      .eq('id', sessionId)
      .maybeSingle();

    if (sessionError) throw sessionError;
    if (!session) return null;

    const sessionAny = session as any;

    const { data: messages, error: messagesError } = await supabase
      .from('conversation_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('timestamp', { ascending: true});

    if (messagesError) throw messagesError;

    return {
      id: sessionAny.id,
      userId: sessionAny.user_id!,
      messages: ((messages || []) as any[]).map(m => ({
        role: m.role as 'user' | 'assistant' | 'system',
        content: m.content
      })),
      extractedInfo: (sessionAny.extracted_info as Record<string, any>) || {},
      stage: sessionAny.conversation_stage || 'initial',
      aiNotes: (sessionAny.ai_notes as Record<string, any>) || {}
    };
  }

  private async persistExtractedInfo(userId: string, info: Record<string, any>) {
    if (info.incomeSource && typeof info.incomeSource === 'object') {
      await supabase.from('income_sources').insert({
        user_id: userId,
        source_type: info.incomeSource.type || 'other',
        source_name: info.incomeSource.name || 'Unnamed',
        annual_amount: parseFloat(info.incomeSource.amount) || 0,
        employer_name: info.incomeSource.employerName,
        business_type: info.incomeSource.businessType,
        tax_already_deducted: parseFloat(info.incomeSource.taxDeducted) || 0
      } as any);
    }

    if (info.familyMember && typeof info.familyMember === 'object') {
      await supabase.from('family_members').insert({
        user_id: userId,
        name: info.familyMember.name || 'Unknown',
        relationship: info.familyMember.relationship || 'other',
        occupation: info.familyMember.occupation,
        annual_income: parseFloat(info.familyMember.income) || 0,
        has_basic_exemption_available: info.familyMember.hasBasicExemption !== false
      } as any);
    }

    if (info.expense && typeof info.expense === 'object') {
      await supabase.from('expenses_and_investments').insert({
        user_id: userId,
        category: info.expense.category || 'other',
        subcategory: info.expense.subcategory,
        amount: parseFloat(info.expense.amount) || 0,
        description: info.expense.description
      } as any);
    }
  }

  async generateTaxAnalysis(userId: string, sessionId: string) {
    const { data: incomes } = await supabase
      .from('income_sources')
      .select('*')
      .eq('user_id', userId);

    const { data: family } = await supabase
      .from('family_members')
      .select('*')
      .eq('user_id', userId);

    const { data: expenses } = await supabase
      .from('expenses_and_investments')
      .select('*')
      .eq('user_id', userId);

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    const analysis = await geminiService.generateTaxStrategy(
      profile,
      incomes || [],
      family || [],
      expenses || []
    );

    const currentYear = new Date().getFullYear();
    const financialYear = `${currentYear}-${currentYear + 1}`;

    const { data: savedAnalysis } = await supabase
      .from('user_tax_analysis')
      .insert({
        user_id: userId,
        session_id: sessionId,
        financial_year: financialYear,
        total_income: analysis.totalIncome,
        taxable_income: analysis.taxableIncome,
        current_tax_liability: analysis.currentTaxLiability,
        optimized_tax_liability: analysis.optimizedTaxLiability,
        potential_savings: analysis.totalPotentialSavings,
        recommended_strategies: analysis.strategies,
        analysis_details: { detailedAnalysis: analysis.detailedAnalysis }
      } as any)
      .select()
      .maybeSingle();

    if (savedAnalysis && analysis.strategies) {
      for (const strategy of analysis.strategies) {
        await supabase.from('tax_recommendations').insert({
          analysis_id: (savedAnalysis as any).id,
          user_id: userId,
          recommendation_text: strategy.description,
          legal_references: [strategy.legalBasis],
          estimated_saving: strategy.estimatedSaving,
          priority: strategy.priority === 'high' ? 1 : strategy.priority === 'medium' ? 2 : 3
        } as any);
      }
    }

    return analysis;
  }
}

export const conversationService = new ConversationService();
