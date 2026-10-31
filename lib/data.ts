import type {
  Activity,
  ActivityType,
  Contact,
  DashboardStats,
  Loan,
  LoanStatus,
  LoanType,
  NewLoanInput,
  NewPaymentInput,
  Payment,
} from '@/types/app'

const TODAY = '2026-10-30'

function id() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function isoDate(offsetDays: number) {
  const d = new Date(TODAY)
  d.setDate(d.getDate() + offsetDays)
  return d.toISOString().slice(0, 10)
}

function isoTs(offsetMinutes = 0) {
  return new Date(Date.parse(`${TODAY}T09:00:00`) + offsetMinutes * 60000).toISOString()
}

function computeStatus(loan: Partial<Loan> & { status?: LoanStatus }): LoanStatus {
  if (loan.status === 'cancelled' || loan.status === 'disputed') {
    return loan.status
  }
  if ((loan.outstanding ?? 0) <= 0) return 'paid-in-full'
  if (loan.dueDate && new Date(loan.dueDate) < new Date(TODAY) && (loan.outstanding ?? 0) > 0) {
    return 'overdue'
  }
  if ((loan.repaid ?? 0) > 0) return 'partially-paid'
  return 'active'
}

function currency(amount: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
}

// ---------------------------------------------------------------------------
// Seed data
// ---------------------------------------------------------------------------

const contacts: Contact[] = [
  {
    id: 'c-1',
    name: 'Sam Rivera',
    avatarUrl: undefined,
    phone: '(555) 014-2281',
    email: 'sam.rivera@example.com',
    createdAt: isoTs(-40000),
  },
  {
    id: 'c-2',
    name: 'Jordan Lee',
    avatarUrl: undefined,
    phone: '(555) 018-9103',
    email: 'jordan.lee@example.com',
    createdAt: isoTs(-38000),
  },
  {
    id: 'c-3',
    name: 'Alex Patel',
    avatarUrl: undefined,
    phone: '(555) 011-4472',
    email: 'alex.patel@example.com',
    createdAt: isoTs(-36000),
  },
  {
    id: 'c-4',
    name: 'Casey Morgan',
    avatarUrl: undefined,
    phone: '(555) 017-3341',
    email: 'casey.morgan@example.com',
    createdAt: isoTs(-34000),
  },
  {
    id: 'c-5',
    name: 'Riley Kim',
    avatarUrl: undefined,
    phone: '(555) 019-5582',
    email: 'riley.kim@example.com',
    createdAt: isoTs(-32000),
  },
  {
    id: 'c-6',
    name: 'Avery Brooks',
    avatarUrl: undefined,
    phone: '(555) 013-1176',
    email: 'avery.brooks@example.com',
    createdAt: isoTs(-30000),
  },
  {
    id: 'c-7',
    name: 'Quinn Taylor',
    avatarUrl: undefined,
    phone: '(555) 016-8845',
    email: 'quinn.taylor@example.com',
    createdAt: isoTs(-28000),
  },
  {
    id: 'c-8',
    name: 'Dylan Cruz',
    avatarUrl: undefined,
    phone: '(555) 012-6619',
    email: 'dylan.cruz@example.com',
    createdAt: isoTs(-26000),
  },
]

const loans: Loan[] = [
  {
    id: 'l-1',
    contactId: 'c-1',
    contactName: 'Sam Rivera',
    type: 'lent',
    amount: 500,
    outstanding: 200,
    repaid: 300,
    status: 'active',
    startDate: isoDate(-45),
    dueDate: isoDate(6),
    description: 'Dinner & concert tickets',
    paymentFrequency: 'monthly',
    notes: 'Sam promised to pay back after his freelance invoice clears.',
    payments: [
      { id: 'p-1', loanId: 'l-1', amount: 200, date: isoDate(-29), method: 'cash', note: 'First chunk', createdAt: isoTs(-43200) },
      { id: 'p-2', loanId: 'l-1', amount: 100, date: isoDate(-15), method: 'venmo', note: '', createdAt: isoTs(-21600) },
    ],
    createdAt: isoTs(-43000),
    updatedAt: isoTs(-21600),
  },
  {
    id: 'l-2',
    contactId: 'c-2',
    contactName: 'Jordan Lee',
    type: 'borrowed',
    amount: 1200,
    outstanding: 900,
    repaid: 300,
    status: 'overdue',
    startDate: isoDate(-60),
    dueDate: isoDate(-5),
    description: 'Security deposit help',
    paymentFrequency: 'monthly',
    notes: 'Rent deposit for the new place.',
    payments: [{ id: 'p-3', loanId: 'l-2', amount: 300, date: isoDate(-30), method: 'bank-transfer', note: '', createdAt: isoTs(-43200) }],
    createdAt: isoTs(-43000),
    updatedAt: isoTs(-43200),
  },
  {
    id: 'l-3',
    contactId: 'c-3',
    contactName: 'Alex Patel',
    type: 'lent',
    amount: 300,
    outstanding: 0,
    repaid: 300,
    status: 'paid-in-full',
    startDate: isoDate(-20),
    dueDate: isoDate(-10),
    description: 'Shared hotel room',
    payments: [{ id: 'p-4', loanId: 'l-3', amount: 300, date: isoDate(-10), method: 'cash-app', note: 'Settled up', createdAt: isoTs(-14400) }],
    createdAt: isoTs(-28800),
    updatedAt: isoTs(-14400),
  },
  {
    id: 'l-4',
    contactId: 'c-4',
    contactName: 'Casey Morgan',
    type: 'borrowed',
    amount: 50,
    outstanding: 50,
    repaid: 0,
    status: 'overdue',
    startDate: isoDate(-45),
    dueDate: isoDate(-15),
    description: 'Lunch tab',
    notes: "I told Casey I'd cover lunch and they'd get me back.",
    payments: [],
    createdAt: isoTs(-43000),
    updatedAt: isoTs(-43000),
  },
  {
    id: 'l-5',
    contactId: 'c-5',
    contactName: 'Riley Kim',
    type: 'lent',
    amount: 1000,
    outstanding: 600,
    repaid: 400,
    status: 'active',
    startDate: isoDate(-90),
    dueDate: isoDate(2),
    interestRate: 0,
    paymentFrequency: 'monthly',
    description: 'Laptop repair',
    notes: 'Riley pays $200 on the first of each month.',
    payments: [
      { id: 'p-5', loanId: 'l-5', amount: 200, date: isoDate(-30), method: 'bank-transfer', note: 'October installment', createdAt: isoTs(-43200) },
      { id: 'p-6', loanId: 'l-5', amount: 200, date: isoDate(-1), method: 'venmo', note: '', createdAt: isoTs(-180) },
    ],
    createdAt: isoTs(-86400),
    updatedAt: isoTs(-180),
  },
  {
    id: 'l-6',
    contactId: 'c-6',
    contactName: 'Avery Brooks',
    type: 'borrowed',
    amount: 200,
    outstanding: 120,
    repaid: 80,
    status: 'partially-paid',
    startDate: isoDate(-30),
    dueDate: isoDate(16),
    description: 'Weekend getaway',
    notes: 'Avery covered the cabin; I owe the rest.',
    payments: [{ id: 'p-7', loanId: 'l-6', amount: 80, date: isoDate(-10), method: 'cash-app', note: '', createdAt: isoTs(-14400) }],
    createdAt: isoTs(-43200),
    updatedAt: isoTs(-14400),
  },
  {
    id: 'l-7',
    contactId: 'c-7',
    contactName: 'Quinn Taylor',
    type: 'lent',
    amount: 450,
    outstanding: 450,
    repaid: 0,
    status: 'disputed',
    startDate: isoDate(-10),
    description: 'Electronics purchase',
    notes: "Quinn says the headphones were never delivered. We're working it out.",
    payments: [],
    createdAt: isoTs(-14400),
    updatedAt: isoTs(-14400),
  },
  {
    id: 'l-8',
    contactId: 'c-8',
    contactName: 'Dylan Cruz',
    type: 'lent',
    amount: 100,
    outstanding: 100,
    repaid: 0,
    status: 'active',
    startDate: isoDate(-5),
    dueDate: isoDate(32),
    description: 'Coffee & a ride to the airport',
    notes: 'Small one, easy to forget — that is why it is in here.',
    payments: [],
    createdAt: isoTs(-7200),
    updatedAt: isoTs(-7200),
  },
]

const activities: Activity[] = [
  {
    id: 'a-1',
    type: 'payment_recorded',
    title: 'Payment recorded',
    subtitle: '$200 from Sam Rivera',
    person: 'Sam Rivera',
    amount: 200,
    date: isoTs(-180),
    loanId: 'l-1',
    loanType: 'lent',
  },
  {
    id: 'a-2',
    type: 'loan_updated',
    title: 'Loan marked overdue',
    subtitle: "Jordan Lee's security deposit loan",
    person: 'Jordan Lee',
    amount: 900,
    date: isoTs(-10080),
    loanId: 'l-2',
    loanType: 'borrowed',
    status: 'overdue',
  },
  {
    id: 'a-3',
    type: 'loan_created',
    title: 'New loan recorded',
    subtitle: 'You lent $100 to Dylan Cruz',
    person: 'Dylan Cruz',
    amount: 100,
    date: isoTs(-7200),
    loanId: 'l-8',
    loanType: 'lent',
  },
  {
    id: 'a-4',
    type: 'status_changed',
    title: 'Paid in full',
    subtitle: 'Alex Patel settled the hotel room tab',
    person: 'Alex Patel',
    amount: 300,
    date: isoTs(-14400),
    loanId: 'l-3',
    loanType: 'lent',
    status: 'paid-in-full',
  },
  {
    id: 'a-5',
    type: 'reminder_sent',
    title: 'Friendly reminder sent',
    subtitle: "Riley Kim's November installment",
    person: 'Riley Kim',
    amount: 200,
    date: isoTs(-28800),
    loanId: 'l-5',
    loanType: 'lent',
  },
  {
    id: 'a-6',
    type: 'loan_created',
    title: 'New loan recorded',
    subtitle: 'You borrowed $200 from Avery Brooks',
    person: 'Avery Brooks',
    amount: 200,
    date: isoTs(-43200),
    loanId: 'l-6',
    loanType: 'borrowed',
  },
]

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export class Store {
  private contacts: Contact[] = [...contacts]
  private loans: Loan[] = loans.map((loan) => ({ ...loan, payments: [...loan.payments] }))
  private activities: Activity[] = [...activities]

  private recompute(): void {
    const nowTs = isoTs()
    this.loans.forEach((loan) => {
      const totalPaid = loan.payments.reduce((sum, p) => sum + p.amount, 0)
      const outstanding = Math.max(0, loan.amount - totalPaid)
      const repaid = totalPaid
      const next = computeStatus({ ...loan, outstanding, repaid })
      if (next !== loan.status || loan.outstanding !== outstanding || loan.repaid !== repaid) {
        loan.status = next
        loan.outstanding = outstanding
        loan.repaid = repaid
        loan.updatedAt = nowTs
      }
    })
  }

  // ---------- Contacts ----------
  getContacts(): Contact[] {
    return [...this.contacts].sort((a, b) => a.name.localeCompare(b.name))
  }

  getContact(id: string): Contact | undefined {
    return this.contacts.find((c) => c.id === id)
  }

  createContact(input: { name: string; phone?: string; email?: string }): Contact {
    const contact: Contact = {
      id: id(),
      name: input.name.trim(),
      phone: input.phone,
      email: input.email,
      createdAt: isoTs(),
    }
    this.contacts.push(contact)
    return contact
  }

  // ---------- Loans ----------
  getLoans({
    status,
    type,
    search,
  }: { status?: LoanStatus; type?: LoanType; search?: string } = {}): Loan[] {
    this.recompute()
    let list = [...this.loans]
    if (status) list = list.filter((l) => l.status === status)
    if (type) list = list.filter((l) => l.type === type)
    if (search) {
      const q = search.toLowerCase()
      list = list.filter((l) => l.contactName.toLowerCase().includes(q))
    }
    return list.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
  }

  getLoan(id: string): Loan | undefined {
    this.recompute()
    return this.loans.find((l) => l.id === id)
  }

  createLoan(input: NewLoanInput): Loan {
    let contact =
      input.contactId ? this.getContact(input.contactId) : undefined
    if (!contact) contact = this.createContact({ name: input.contactName })
    const contactName = input.contactName || contact.name
    const loan: Loan = {
      id: id(),
      contactId: contact.id,
      contactName,
      contactAvatar: contact.avatarUrl,
      type: input.type,
      amount: input.amount,
      outstanding: input.amount,
      repaid: 0,
      status: computeStatus({
        amount: input.amount,
        outstanding: input.amount,
        repaid: 0,
        dueDate: input.dueDate,
      }),
      startDate: input.startDate,
      dueDate: input.dueDate,
      description: input.description,
      interestRate: input.interestRate,
      lateFee: input.lateFee,
      paymentFrequency: input.paymentFrequency,
      notes: input.notes,
      payments: [],
      createdAt: isoTs(),
      updatedAt: isoTs(),
    }
    this.loans.push(loan)
    this.addActivity({
      type: 'loan_created',
      title: `New ${input.type === 'lent' ? 'loan' : 'borrowed'} recorded`,
      subtitle: `${
        input.type === 'lent' ? `You lent ${currency(input.amount)} to` : `You borrowed ${currency(input.amount)} from`
      } ${contactName}`,
      person: contactName,
      amount: input.amount,
      loanId: loan.id,
      loanType: input.type,
    })
    return loan
  }

  recordPayment(loanId: string, input: NewPaymentInput): { loan: Loan; payment: Payment } | null {
    const loan = this.loans.find((l) => l.id === loanId)
    if (!loan) return null
    const payment: Payment = {
      id: id(),
      loanId,
      amount: input.amount,
      date: input.date,
      method: input.method,
      note: input.note,
      createdAt: isoTs(),
    }
    loan.payments.push(payment)
    this.recompute()
    const updated = this.loans.find((l) => l.id === loanId)!
    this.addActivity({
      type: 'payment_recorded',
      title: 'Payment recorded',
      subtitle: `${currency(input.amount)} on ${updated.contactName}'s loan`,
      person: updated.contactName,
      amount: input.amount,
      loanId: updated.id,
      loanType: updated.type,
      status: updated.status,
    })
    return { loan: updated, payment }
  }

  updateLoan(id: string, fields: Partial<Loan>): Loan | null {
    const loan = this.loans.find((l) => l.id === id)
    if (!loan) return null
    Object.assign(loan, fields, { updatedAt: isoTs() })
    this.recompute()
    return this.loans.find((l) => l.id === id)!
  }

  // ---------- Payments ----------
  getPaymentsForLoan(loanId: string): Payment[] {
    return [...this.loans.flatMap((l) => l.payments).filter((p) => p.loanId === loanId)].sort(
      (a, b) => b.date.localeCompare(a.date),
    )
  }

  // ---------- Dashboard ----------
  getDashboardStats(): DashboardStats {
    this.recompute()
    const active = this.loans.filter(
      (l) => l.status === 'active' || l.status === 'partially-paid',
    )
    const owedToMe = active
      .filter((l) => l.type === 'lent')
      .reduce((sum, l) => sum + l.outstanding, 0)
    const oweOthers = active
      .filter((l) => l.type === 'borrowed')
      .reduce((sum, l) => sum + l.outstanding, 0)

    const upcoming = this.loans.filter(
      (l) =>
        (l.status === 'active' || l.status === 'partially-paid') &&
        l.dueDate &&
        new Date(l.dueDate) >= new Date(TODAY) &&
        new Date(l.dueDate) <= new Date(isoDate(7)) &&
        l.outstanding > 0,
    )
    const overdue = this.loans.filter((l) => l.status === 'overdue')

    return {
      owedToMe,
      oweOthers,
      net: owedToMe - oweOthers,
      activeLoans: active.length,
      upcoming: upcoming.sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime()),
      overdue,
      recentActivity: [...this.activities].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6),
    }
  }

  getContactStats(contactId: string): {
    owedToMe: number
    oweOthers: number
    net: number
    loanCount: number
  } {
    this.recompute()
    const contactLoans = this.loans.filter((l) => l.contactId === contactId)
    const owedToMe = contactLoans
      .filter((l) => l.type === 'lent')
      .reduce((sum, l) => sum + l.outstanding, 0)
    const oweOthers = contactLoans
      .filter((l) => l.type === 'borrowed')
      .reduce((sum, l) => sum + l.outstanding, 0)
    return {
      owedToMe,
      oweOthers,
      net: owedToMe - oweOthers,
      loanCount: contactLoans.length,
    }
  }

  // ---------- Activity ----------
  getActivities({
    type,
    person,
    loanId,
  }: { type?: ActivityType; person?: string; loanId?: string } = {}): Activity[] {
    let list = [...this.activities]
    if (type) list = list.filter((a) => a.type === type)
    if (person) list = list.filter((a) => a.person?.toLowerCase().includes(person.toLowerCase()))
    if (loanId) list = list.filter((a) => a.loanId === loanId)
    return list.sort((a, b) => b.date.localeCompare(a.date))
  }

  addActivity(activity: Omit<Activity, 'id' | 'date'> & { date?: string }): void {
    this.activities.unshift({
      id: id(),
      ...activity,
      date: activity.date ?? isoTs(),
    })
    if (this.activities.length > 200) this.activities.length = 200
  }
}

export const store = new Store()

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export { currency }

export function loanStatusLabel(status: LoanStatus): string {
  return status
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function loanTypeLabel(type: LoanType): string {
  return type === 'lent' ? 'I lent money' : 'I borrowed money'
}

export function directionColor(type: LoanType): string {
  return type === 'lent' ? '#1E7A46' : '#B45309'
}
