export type LoanType = 'lent' | 'borrowed'
export type LoanStatus =
  | 'active'
  | 'partially-paid'
  | 'paid-in-full'
  | 'overdue'
  | 'cancelled'
  | 'disputed'
export type PaymentMethod =
  | 'cash'
  | 'bank-transfer'
  | 'venmo'
  | 'cash-app'
  | 'zelle'
  | 'paypal'
  | 'check'
  | 'other'
export type ActivityType =
  | 'loan_created'
  | 'payment_recorded'
  | 'loan_updated'
  | 'reminder_sent'
  | 'status_changed'
export type ReminderTone = 'friendly' | 'direct' | 'playful'
export type TimeFilter = 'today' | 'this-week' | 'this-month' | 'all-time'

export interface Contact {
  id: string
  name: string
  avatarUrl?: string
  phone?: string
  email?: string
  createdAt: string
}

export interface Payment {
  id: string
  loanId: string
  amount: number
  date: string // ISO date
  method?: PaymentMethod
  note?: string
  createdAt: string // ISO timestamp
}

export interface Loan {
  id: string
  contactId: string
  contactName: string
  contactAvatar?: string
  type: LoanType
  amount: number // original amount
  outstanding: number
  repaid: number
  status: LoanStatus
  startDate: string // ISO date
  dueDate?: string // ISO date
  description?: string
  interestRate?: number
  lateFee?: number
  paymentFrequency?: 'weekly' | 'biweekly' | 'monthly'
  notes?: string
  payments: Payment[]
  createdAt: string
  updatedAt: string
}

export interface Activity {
  id: string
  type: ActivityType
  title: string
  subtitle?: string
  person?: string
  amount?: number
  date: string // ISO timestamp
  loanId?: string
  status?: LoanStatus
  loanType?: LoanType
}

export interface DashboardStats {
  owedToMe: number
  oweOthers: number
  net: number
  activeLoans: number
  upcoming: Loan[]
  overdue: Loan[]
  recentActivity: Activity[]
}

export interface NewLoanInput {
  contactId?: string
  contactName: string
  type: LoanType
  amount: number
  startDate: string
  dueDate?: string
  description?: string
  interestRate?: number
  lateFee?: number
  paymentFrequency?: 'weekly' | 'biweekly' | 'monthly'
  notes?: string
}

export interface NewPaymentInput {
  amount: number
  date: string
  method?: PaymentMethod
  note?: string
}

export interface User {
  id: string
  email: string
  fullName: string
}
