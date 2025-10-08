import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.warn('Gemini API key not configured');
}

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIResponse {
  message: string;
  nextQuestion?: string;
  extractedInfo?: Record<string, any>;
  suggestedStrategies?: string[];
  conversationStage?: string;
}

export class GeminiService {
  private model: any;

  constructor() {
    if (genAI) {
      this.model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    }
  }

  async chat(messages: Message[], context?: Record<string, any>): Promise<AIResponse> {
    if (!this.model) {
      throw new Error('Gemini API not configured. Please set VITE_GEMINI_API_KEY in your .env file');
    }

    const systemPrompt = this.buildSystemPrompt(context);
    const conversationHistory = messages.map(m =>
      `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`
    ).join('\n\n');

    const fullPrompt = `${systemPrompt}\n\n${conversationHistory}\n\nAssistant:`;

    const result = await this.model.generateContent(fullPrompt);
    const response = result.response;
    const text = response.text();

    return this.parseResponse(text);
  }

  private buildSystemPrompt(context?: Record<string, any>): string {
    return `You are an AI Chartered Accountant specialized in Indian Income Tax Law. Your role is to:

1. **Gather Financial Information Naturally**: Ask questions in a conversational, friendly manner. Don't use tax jargon unless necessary. Think like a CA who's having a casual conversation with a client.

2. **Be Proactive and Intelligent**: Based on what the user tells you, identify opportunities and ask targeted follow-up questions. For example:
   - If user mentions a spouse who doesn't work, ask about transferring income-generating assets
   - If user has a business, ask about business expenses and depreciable assets
   - If user mentions family members, explore their income levels and exemption utilization
   - If user has high income, explore investment deductions and tax-saving instruments

3. **Extract Information Systematically**: You need to gather:
   - Income sources (salary, business, rental, capital gains, interest, etc.)
   - Family structure (spouse, children, parents, their income levels)
   - Current investments and expenses
   - Business details if applicable
   - Assets owned
   - Financial goals

4. **Think Like a CA**: Your goal is to find LEGAL tax-saving opportunities:
   - Income splitting through gifts to family members (Section 56 exemption)
   - Utilizing family members' basic exemption limits
   - Business expense optimization
   - Depreciation strategies for business assets
   - Section 80C, 80D, 80G deductions
   - HRA, LTA benefits
   - Capital gains exemptions
   - NPS, PPF, ELSS investments
   - Home loan interest deductions

5. **Ask One Category at a Time**: Don't overwhelm the user. Start with income, then family, then expenses, etc.

6. **Be Specific**: If user gives vague answers, ask for specific numbers and details.

7. **Format Your Response**: Structure your response as JSON with these fields:
   {
     "message": "Your conversational response to the user",
     "nextQuestion": "The next question to ask (optional)",
     "extractedInfo": {"key": "value"} of any financial information mentioned,
     "suggestedStrategies": ["strategy1", "strategy2"] if you identify opportunities,
     "conversationStage": "income_gathering|family_discovery|expense_collection|investment_planning|analysis"
   }

${context ? `\n\nCurrent Context:\n${JSON.stringify(context, null, 2)}` : ''}

Remember: You are helping the user legally minimize their tax liability by finding all applicable deductions, exemptions, and planning opportunities under the Income Tax Act. Be thorough, proactive, and intelligent.`;
  }

  private parseResponse(text: string): AIResponse {
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.warn('Failed to parse structured response, using fallback');
    }

    return {
      message: text,
      nextQuestion: undefined,
      extractedInfo: {},
      conversationStage: 'initial'
    };
  }

  async generateTaxStrategy(userProfile: any, incomes: any[], family: any[], expenses: any[]): Promise<any> {
    if (!this.model) {
      throw new Error('Gemini API not configured');
    }

    const prompt = `As a CA specializing in tax planning, analyze this client's financial situation and provide comprehensive tax-saving strategies:

**Client Profile:**
${JSON.stringify(userProfile, null, 2)}

**Income Sources:**
${JSON.stringify(incomes, null, 2)}

**Family Members:**
${JSON.stringify(family, null, 2)}

**Current Expenses & Investments:**
${JSON.stringify(expenses, null, 2)}

**Your Task:**
1. Calculate current tax liability
2. Identify ALL applicable tax-saving opportunities under Income Tax Act
3. Analyze family structure for income splitting opportunities (gifts, transfer of income-generating assets)
4. Suggest business expense optimization if applicable
5. Recommend specific investment amounts for Section 80C, 80D, etc.
6. Identify any missed deductions or exemptions
7. Provide step-by-step implementation plan
8. Estimate tax savings for each strategy

**Format your response as JSON:**
{
  "currentTaxLiability": number,
  "totalIncome": number,
  "taxableIncome": number,
  "strategies": [
    {
      "strategyName": "string",
      "description": "string",
      "legalBasis": "Section X of Income Tax Act",
      "estimatedSaving": number,
      "implementationSteps": ["step1", "step2"],
      "priority": "high|medium|low"
    }
  ],
  "optimizedTaxLiability": number,
  "totalPotentialSavings": number,
  "detailedAnalysis": "string"
}`;

    const result = await this.model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.error('Failed to parse tax strategy response', e);
    }

    return {
      currentTaxLiability: 0,
      totalIncome: 0,
      taxableIncome: 0,
      strategies: [],
      optimizedTaxLiability: 0,
      totalPotentialSavings: 0,
      detailedAnalysis: text
    };
  }
}

export const geminiService = new GeminiService();
