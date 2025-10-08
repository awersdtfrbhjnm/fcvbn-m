export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          user_id: string | null
          full_name: string
          email: string
          phone: string | null
          date_of_birth: string | null
          pan_number: string | null
          occupation_type: string | null
          annual_income_range: string | null
          tax_residency_status: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          full_name: string
          email: string
          phone?: string | null
          date_of_birth?: string | null
          pan_number?: string | null
          occupation_type?: string | null
          annual_income_range?: string | null
          tax_residency_status?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          full_name?: string
          email?: string
          phone?: string | null
          date_of_birth?: string | null
          pan_number?: string | null
          occupation_type?: string | null
          annual_income_range?: string | null
          tax_residency_status?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      family_members: {
        Row: {
          id: string
          user_id: string | null
          name: string
          relationship: string
          date_of_birth: string | null
          pan_number: string | null
          occupation: string | null
          annual_income: number | null
          has_basic_exemption_available: boolean | null
          dependent_status: boolean | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          name: string
          relationship: string
          date_of_birth?: string | null
          pan_number?: string | null
          occupation?: string | null
          annual_income?: number | null
          has_basic_exemption_available?: boolean | null
          dependent_status?: boolean | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          name?: string
          relationship?: string
          date_of_birth?: string | null
          pan_number?: string | null
          occupation?: string | null
          annual_income?: number | null
          has_basic_exemption_available?: boolean | null
          dependent_status?: boolean | null
          created_at?: string | null
        }
      }
      income_sources: {
        Row: {
          id: string
          user_id: string | null
          source_type: string
          source_name: string
          annual_amount: number
          employer_name: string | null
          business_type: string | null
          tax_already_deducted: number | null
          additional_details: Json | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          source_type: string
          source_name: string
          annual_amount: number
          employer_name?: string | null
          business_type?: string | null
          tax_already_deducted?: number | null
          additional_details?: Json | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          source_type?: string
          source_name?: string
          annual_amount?: number
          employer_name?: string | null
          business_type?: string | null
          tax_already_deducted?: number | null
          additional_details?: Json | null
          created_at?: string | null
        }
      }
      expenses_and_investments: {
        Row: {
          id: string
          user_id: string | null
          category: string
          subcategory: string | null
          amount: number
          description: string | null
          proof_document_url: string | null
          financial_year: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          category: string
          subcategory?: string | null
          amount: number
          description?: string | null
          proof_document_url?: string | null
          financial_year?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          category?: string
          subcategory?: string | null
          amount?: number
          description?: string | null
          proof_document_url?: string | null
          financial_year?: string | null
          created_at?: string | null
        }
      }
      conversation_sessions: {
        Row: {
          id: string
          user_id: string | null
          session_started_at: string | null
          session_ended_at: string | null
          conversation_stage: string | null
          extracted_info: Json | null
          ai_notes: Json | null
          is_active: boolean | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          session_started_at?: string | null
          session_ended_at?: string | null
          conversation_stage?: string | null
          extracted_info?: Json | null
          ai_notes?: Json | null
          is_active?: boolean | null
        }
        Update: {
          id?: string
          user_id?: string | null
          session_started_at?: string | null
          session_ended_at?: string | null
          conversation_stage?: string | null
          extracted_info?: Json | null
          ai_notes?: Json | null
          is_active?: boolean | null
        }
      }
      conversation_messages: {
        Row: {
          id: string
          session_id: string | null
          role: string
          content: string
          intent_detected: string | null
          information_extracted: Json | null
          timestamp: string | null
        }
        Insert: {
          id?: string
          session_id?: string | null
          role: string
          content: string
          intent_detected?: string | null
          information_extracted?: Json | null
          timestamp?: string | null
        }
        Update: {
          id?: string
          session_id?: string | null
          role?: string
          content?: string
          intent_detected?: string | null
          information_extracted?: Json | null
          timestamp?: string | null
        }
      }
      tax_provisions: {
        Row: {
          id: string
          section_number: string
          provision_title: string
          provision_text: string
          category: string
          applicable_to: string[] | null
          deduction_limit: string | null
          conditions: string[] | null
          examples: Json | null
          embedding: number[] | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          section_number: string
          provision_title: string
          provision_text: string
          category: string
          applicable_to?: string[] | null
          deduction_limit?: string | null
          conditions?: string[] | null
          examples?: Json | null
          embedding?: number[] | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          section_number?: string
          provision_title?: string
          provision_text?: string
          category?: string
          applicable_to?: string[] | null
          deduction_limit?: string | null
          conditions?: string[] | null
          examples?: Json | null
          embedding?: number[] | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      tax_strategies: {
        Row: {
          id: string
          strategy_name: string
          description: string
          legal_basis: string
          applicable_sections: string[] | null
          target_profile: Json | null
          estimated_savings_range: string | null
          risk_level: string | null
          implementation_steps: Json | null
          examples: Json | null
          embedding: number[] | null
          created_at: string | null
        }
        Insert: {
          id?: string
          strategy_name: string
          description: string
          legal_basis: string
          applicable_sections?: string[] | null
          target_profile?: Json | null
          estimated_savings_range?: string | null
          risk_level?: string | null
          implementation_steps?: Json | null
          examples?: Json | null
          embedding?: number[] | null
          created_at?: string | null
        }
        Update: {
          id?: string
          strategy_name?: string
          description?: string
          legal_basis?: string
          applicable_sections?: string[] | null
          target_profile?: Json | null
          estimated_savings_range?: string | null
          risk_level?: string | null
          implementation_steps?: Json | null
          examples?: Json | null
          embedding?: number[] | null
          created_at?: string | null
        }
      }
      user_tax_analysis: {
        Row: {
          id: string
          user_id: string | null
          session_id: string | null
          financial_year: string
          total_income: number
          taxable_income: number
          current_tax_liability: number
          recommended_strategies: Json | null
          optimized_tax_liability: number | null
          potential_savings: number | null
          analysis_details: Json | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          session_id?: string | null
          financial_year: string
          total_income: number
          taxable_income: number
          current_tax_liability: number
          recommended_strategies?: Json | null
          optimized_tax_liability?: number | null
          potential_savings?: number | null
          analysis_details?: Json | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          session_id?: string | null
          financial_year?: string
          total_income?: number
          taxable_income?: number
          current_tax_liability?: number
          recommended_strategies?: Json | null
          optimized_tax_liability?: number | null
          potential_savings?: number | null
          analysis_details?: Json | null
          created_at?: string | null
        }
      }
      tax_recommendations: {
        Row: {
          id: string
          analysis_id: string | null
          user_id: string | null
          strategy_id: string | null
          recommendation_text: string
          legal_references: string[] | null
          estimated_saving: number | null
          priority: number | null
          implementation_status: string | null
          user_feedback: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          analysis_id?: string | null
          user_id?: string | null
          strategy_id?: string | null
          recommendation_text: string
          legal_references?: string[] | null
          estimated_saving?: number | null
          priority?: number | null
          implementation_status?: string | null
          user_feedback?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          analysis_id?: string | null
          user_id?: string | null
          strategy_id?: string | null
          recommendation_text?: string
          legal_references?: string[] | null
          estimated_saving?: number | null
          priority?: number | null
          implementation_status?: string | null
          user_feedback?: string | null
          created_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
