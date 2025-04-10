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
      profiles: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      borrowers: {
        Row: {
          id: string
          created_by: string
          full_name: string
          email: string | null
          phone: string | null
          address: string | null
          credit_score: number | null
          employment_status: string | null
          monthly_income: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          created_by: string
          full_name: string
          email?: string | null
          phone?: string | null
          address?: string | null
          credit_score?: number | null
          employment_status?: string | null
          monthly_income?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          created_by?: string
          full_name?: string
          email?: string | null
          phone?: string | null
          address?: string | null
          credit_score?: number | null
          employment_status?: string | null
          monthly_income?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      loans: {
        Row: {
          id: string
          borrower_id: string
          created_by: string
          amount: number
          interest_rate: number
          term_months: number
          status: 'pending' | 'active' | 'completed' | 'defaulted'
          start_date: string | null
          end_date: string | null
          payment_frequency: string
          total_payments: number | null
          remaining_balance: number | null
          next_payment_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          borrower_id: string
          created_by: string
          amount: number
          interest_rate: number
          term_months: number
          status?: 'pending' | 'active' | 'completed' | 'defaulted'
          start_date?: string | null
          end_date?: string | null
          payment_frequency?: string
          total_payments?: number | null
          remaining_balance?: number | null
          next_payment_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          borrower_id?: string
          created_by?: string
          amount?: number
          interest_rate?: number
          term_months?: number
          status?: 'pending' | 'active' | 'completed' | 'defaulted'
          start_date?: string | null
          end_date?: string | null
          payment_frequency?: string
          total_payments?: number | null
          remaining_balance?: number | null
          next_payment_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          loan_id: string
          amount: number
          due_date: string
          payment_date: string | null
          status: 'scheduled' | 'paid' | 'late' | 'missed'
          payment_method: string | null
          transaction_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          loan_id: string
          amount: number
          due_date: string
          payment_date?: string | null
          status?: 'scheduled' | 'paid' | 'late' | 'missed'
          payment_method?: string | null
          transaction_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          loan_id?: string
          amount?: number
          due_date?: string
          payment_date?: string | null
          status?: 'scheduled' | 'paid' | 'late' | 'missed'
          payment_method?: string | null
          transaction_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: 'payment_due' | 'payment_received' | 'payment_late' | 'loan_approved'
          title: string
          message: string
          read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'payment_due' | 'payment_received' | 'payment_late' | 'loan_approved'
          title: string
          message: string
          read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'payment_due' | 'payment_received' | 'payment_late' | 'loan_approved'
          title?: string
          message?: string
          read?: boolean
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_loan_schedule: {
        Args: {
          p_loan_id: string
        }
        Returns: void
      }
    }
    Enums: {
      loan_status: 'pending' | 'active' | 'completed' | 'defaulted'
      payment_status: 'scheduled' | 'paid' | 'late' | 'missed'
      notification_type: 'payment_due' | 'payment_received' | 'payment_late' | 'loan_approved'
    }
  }
}