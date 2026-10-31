import { View, Text, ScrollView, StyleSheet, Alert, TouchableOpacity } from 'react-native'
import { useEffect, useState, useCallback } from 'react'
import { router } from 'expo-router'
import { ChevronLeft, Clock, ChevronRight, CirclePlus, Wallet, Banknote } from 'lucide-react-native'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { Card } from '@/components/Card'
import { SectionHeader } from '@/components/SectionHeader'
import { StatusBadge } from '@/components/StatusBadge'
import { ProgressRing } from '@/components/ProgressRing'
import { Avatar } from '@/components/Avatar'
import { store, currency, loanTypeLabel, directionColor } from '@/lib/data'
import type { Loan } from '@/types/app'
import { theme } from '@/lib/theme'

export default function LoanDetailScreen({ params }: { params: { id: string } }) {
  const [loan, setLoan] = useState<Loan | null>(null)
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [payAmount, setPayAmount] = useState('')
  const [payDate, setPayDate] = useState('')
  const [payMethod, setPayMethod] = useState<string | null>('cash')
  const [payNote, setPayNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadLoan()
  }, [])

  const loadLoan = useCallback(() => {
    setLoan(store.getLoan(params.id) ?? null)
  }, [params.id])

  const methods = [
    { value: 'cash', label: 'Cash', icon: '💵' },
    { value: 'venmo', label: 'Venmo', icon: '📱' },
    { value: 'cash-app', label: 'Cash App', icon: '💚' },
    { value: 'bank-transfer', label: 'Bank transfer', icon: '🏦' },
    { value: 'zelle', label: 'Zelle', icon: '⚡' },
    { value: 'paypal', label: 'PayPal', icon: '🔵' },
    { value: 'check', label: 'Check', icon: '🧾' },
    { value: 'other', label: 'Other', icon: '•' },
  ]

  if (!loan) {
    return null
  }

  const pct = loan.amount ? Math.round((loan.repaid / loan.amount) * 100) : 0
  const isLent = loan.type === 'lent'

  const recordPayment = async () => {
    setError('')
    if (!payAmount || parseFloat(payAmount) <= 0) {
      setError("Enter a valid amount.")
      return
    }
    if (!payDate) {
      setError("Pick a payment date.")
      return
    }

    setLoading(true)
    try {
      const result = store.recordPayment(loan.id, {
        amount: parseFloat(payAmount),
        date: payDate,
        method: payMethod as any,
        note: payNote || undefined,
      })
      if (!result) throw new Error("Couldn't record the payment.")
      setLoan(result.loan)
      setShowPaymentForm(false)
      setPayAmount('')
      setPayDate(new Date().toISOString().slice(0, 10))
      setPayMethod('cash')
      setPayNote('')
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't record the payment.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled">
      <View style={styles.headerBar}>
        <ChevronLeft size={24} color={theme.colors.inkSoft} style={styles.back} />
        <View style={styles.headerContent}>
          <View style={styles.headerTop}>
            <Avatar name={loan.contactName} size={44} />
            <View style={styles.headerTags}>
              <StatusBadge status={loan.status} />
              <Text style={[styles.typeChip, { backgroundColor: directionColor(loan.type) + '22' }]}>
                {loanTypeLabel(loan.type)}
              </Text>
            </View>
          </View>
          <Text style={styles.contactName}>{loan.contactName}</Text>
          {loan.description && <Text style={styles.loanDescription}>{loan.description}</Text>}
        </View>
      </View>

      <View style={styles.metrics}>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>Original amount</Text>
          <Text style={styles.metricValue}>{currency(loan.amount)}</Text>
        </View>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>Repaid</Text>
          <Text style={styles.metricValue}>{currency(loan.repaid)}</Text>
        </View>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>Outstanding</Text>
          <Text style={[styles.metricValue, { color: isLent ? theme.colors.success : theme.colors.red }]}>
            {isLent ? '+' : '-'}{currency(loan.outstanding)}
          </Text>
        </View>
      </View>

      <View style={styles.progressCard}>
        <ProgressRing value={pct} size={140} label="Repaid" />
        <View style={styles.progressFooter}>
          <Text style={styles.progressNote}>
            {loan.dueDate ? `Due {formatDate(loan.dueDate)}` : 'No due date set'}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <SectionHeader
          title="Record a payment"
          subtitle="Full or partial — this updates the outstanding balance"
        />
        <View style={styles.paymentFormContainer}>
          {showPaymentForm ? (
            <View style={styles.paymentForm}>
              <View style={styles.twoColumn}>
                <Input
                  label="Amount ($)"
                  value={payAmount}
                  onChangeText={setPayAmount}
                  keyboardType="decimal-pad"
                />
                <Input
                  label="Date"
                  value={payDate}
                  onChangeText={setPayDate}
                  placeholder="YYYY-MM-DD"
                />
              </View>
              <Text style={styles.methodLabel}>Method</Text>
              <View style={styles.methodRow}>
                {methods.map((m) => (
                  <MethodChip
                    key={m.value}
                    selected={payMethod === m.value}
                    onPress={() => setPayMethod(m.value)}
                    icon={m.icon}
                    label={m.label}
                  />
                ))}
              </View>
              <Input
                label="Note (optional)"
                value={payNote}
                onChangeText={setPayNote}
                placeholder="e.g. Venmo from last weekend"
              />
              {error && <Text style={styles.error}>{error}</Text>}
              <View style={styles.formButtons}>
                <Button
                  variant="outline"
                  title="Cancel"
                  onPress={() => setShowPaymentForm(false)}
                />
                <Button
                  variant="primary"
                  title="Record payment"
                  loading={loading}
                  onPress={recordPayment}
                />
              </View>
            </View>
          ) : null}
          <Button
            variant="ghost"
            title={showPaymentForm ? 'Hide payment form' : 'Record payment'}
            onPress={() => setShowPaymentForm(!showPaymentForm)}
            style={[styles.recordButton]}
          />
        </View>
      </View>

      <View style={styles.section}>
        <SectionHeader
          title="Payment history"
          subtitle={loan.payments.length ? `${loan.payments.length} recorded` : 'No payments yet'}
        />
        {loan.payments.length > 0 ? (
          <View style={styles.historyList}>
            {loan.payments.map((payment) => (
              <PaymentRow key={payment.id} payment={payment} />
            ))}
          </View>
        ) : (
          <EmptyHistory />
        )}
      </View>

      <View style={styles.section}>
        <SectionHeader title="Loan details" subtitle="Agreement terms" />
        <View style={styles.detailRow}>
          <DetailItem title="Status" value={loan.status.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} />
          <DetailItem title="Type" value={loanTypeLabel(loan.type)} />
        </View>
        <View style={styles.detailRow}>
          <DetailItem title="Started" value={formatDate(loan.startDate)} />
          {loan.dueDate && <DetailItem title="Due date" value={formatDate(loan.dueDate)} />}
        </View>
        {loan.interestRate != null && (
          <View style={styles.detailRow}>
            <DetailItem title="Interest rate" value={`${loan.interestRate}%`} />
          </View>
        )}
        {loan.lateFee != null && (
          <View style={styles.detailRow}>
            <DetailItem title="Late fee" value={currency(loan.lateFee)} />
          </View>
        )}
        {loan.paymentFrequency && (
          <View style={styles.detailRow}>
            <DetailItem title="Frequency" value={loan.paymentFrequency} />
          </View>
        )}
        {loan.notes && (
          <View style={styles.noteCard}>
            <Text style={styles.noteLabel}>Notes</Text>
            <Text style={styles.noteText}>{loan.notes}</Text>
          </View>
        )}
        <View style={styles.footerNote}>
          <Banknote size={16} color={theme.colors.inkMuted} style={styles.footerIcon} />
          <Text style={styles.footerText}>
            IOWho? records the agreement — it never moves money or verifies transfers.
          </Text>
        </View>
      </View>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  )
}

function MethodChip({
  selected,
  onPress,
  icon,
  label,
}: {
  selected: boolean
  onPress: () => void
  icon: string
  label: string
}) {
  return (
    <TouchableOpacity
      style={[
        styles.methodChip,
        selected && { backgroundColor: theme.colors.primarySoft, borderColor: theme.colors.primary },
      ]}
      onPress={onPress}
      activeOpacity={0.9}>
      <Text style={[styles.methodChipIcon, { opacity: selected ? 1 : 0.6 }]}>{icon}</Text>
      <Text style={[styles.methodChipLabel, selected && styles.methodChipLabelSelected]}>{label}</Text>
    </TouchableOpacity>
  )
}

function PaymentRow({ payment }: { payment: PaymentRowProps }) {
  return (
    <View style={styles.paymentRow}>
      <View style={styles.paymentAmount}>-{currency(payment.amount)}</View>
      <View style={styles.paymentBody}>
        <Text style={styles.paymentDate}>{formatDate(payment.date)}</Text>
        <Text style={styles.paymentNote}>
          {payment.method ? payment.method.replace('-', ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : ''}
          {payment.note ? ` · ${payment.note}` : ''}
        </Text>
      </View>
      <ChevronRight size={16} color={theme.colors.inkMuted} />
    </View>
  )
}

type PaymentRowProps = { amount: number; date: string; method?: string; note?: string }

function EmptyHistory() {
  return (
    <View style={styles.emptyHistory}>
      <Text style={styles.emptyHistoryText}>No payments recorded yet.</Text>
    </View>
  )
}

function DetailItem({ title, value }: { title: string; value: string }) {
  return (
    <View style={styles.detailItem}>
      <Text style={styles.detailLabel}>{title}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  )
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 110,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  back: {
    marginRight: 10,
    marginTop: -2,
  },
  headerContent: { flex: 1 },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerTags: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  typeChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  contactName: {
    fontSize: 22,
    fontWeight: '900',
    color: theme.colors.ink,
    marginTop: 6,
  },
  loanDescription: {
    fontSize: 14,
    color: theme.colors.inkSoft,
    marginTop: 4,
  },
  metrics: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  metric: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    ...theme.shadow.soft,
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.inkMuted,
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 19,
    fontWeight: '800',
    color: theme.colors.ink,
  },
  progressCard: {
    alignItems: 'center',
    marginBottom: 20,
  },
  progressFooter: { marginTop: 8 },
  progressNote: {
    fontSize: 13,
    color: theme.colors.inkSoft,
  },
  paymentFormContainer: {
    gap: 10,
  },
  recordButton: {
    alignSelf: 'flex-start',
  },
  paymentForm: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius,
    padding: 16,
    ...theme.shadow.card,
  },
  twoColumn: {
    flexDirection: 'row',
    gap: 10,
  },
  methodLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.inkSoft,
    marginTop: 14,
    marginBottom: 8,
  },
  methodRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    marginBottom: 14,
  },
  methodChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#D8D2C4',
    backgroundColor: '#FFFFFF',
  },
  methodChipIcon: { fontSize: 16 },
  methodChipLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.inkSoft,
  },
  methodChipLabelSelected: {
    color: theme.colors.primaryDark,
  },
  error: {
    color: theme.colors.red,
    fontSize: 13,
    marginBottom: 10,
    padding: 10,
    backgroundColor: theme.colors.redSoft,
    borderRadius: 10,
  },
  formButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  historyList: { gap: 8 },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderSoft,
  },
  paymentAmount: {
    fontSize: 15,
    fontWeight: '800',
    color: theme.colors.success,
    minWidth: 70,
    textAlign: 'right',
  },
  paymentBody: { flex: 1 },
  paymentDate: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.ink,
  },
  paymentNote: {
    fontSize: 12,
    color: theme.colors.inkSoft,
    marginTop: 2,
  },
  emptyHistory: {
    paddingVertical: 30,
    alignItems: 'center',
  },
  emptyHistoryText: {
    fontSize: 14,
    color: theme.colors.inkSoft,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderSoft,
  },
  section: { marginBottom: 24 },
  detailItem: { flex: 1 },
  detailLabel: {
    fontSize: 13,
    color: theme.colors.inkMuted,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.ink,
    textAlign: 'right',
  },
  noteCard: {
    marginTop: 4,
    backgroundColor: theme.colors.surfaceSoft,
    borderRadius: 12,
    padding: 14,
  },
  noteLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.inkMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 6,
  },
  noteText: {
    fontSize: 14,
    color: theme.colors.inkSoft,
    lineHeight: 20,
  },
  footerNote: {
    marginTop: 16,
    padding: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  footerIcon: { marginTop: 2 },
  footerText: {
    fontSize: 12,
    color: theme.colors.inkMuted,
    lineHeight: 18,
  },
  bottomSpacer: { height: 20 },
})
