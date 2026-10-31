import { View, Text, ScrollView, StyleSheet, Linking, TouchableOpacity } from 'react-native'
import { useEffect, useState } from 'react'
import { router } from 'expo-router'
import { Phone, Mail, ChevronRight } from 'lucide-react-native'
import { Card } from '@/components/Card'
import { SectionHeader } from '@/components/SectionHeader'
import { StatusBadge } from '@/components/StatusBadge'
import { EmptyState } from '@/components/EmptyState'
import { Avatar } from '@/components/Avatar'
import { LoanRow } from '@/components/LoanRow'
import { store, currency, loanTypeLabel, directionColor } from '@/lib/data'
import type { Loan } from '@/types/app'
import { theme } from '@/lib/theme'

export default function BorrowerDetailScreen({ params }: { params: { id: string } }) {
  const [contact, setContact] = useState(store.getContact(params.id) ?? null)

  if (!contact) return null

  const contactLoans = store.getLoans().filter((l) => l.contactId === contact.id)
  const stats = store.getContactStats(contact.id)

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <Avatar name={contact.name} size={72} style={styles.avatar} />
        <Text style={styles.name}>{contact.name}</Text>
        <View style={styles.contactRow}>
          {contact.phone && (
            <PressableText onPress={() => Linking.openURL(`tel:${contact.phone}`)}>
              <Phone size={16} color={theme.colors.primaryDark} style={styles.contactIcon} />
              <Text style={styles.contactText}>{contact.phone}</Text>
            </PressableText>
          )}
          {contact.email && (
            <PressableText onPress={() => Linking.openURL(`mailto:${contact.email}`)}>
              <Mail size={16} color={theme.colors.primaryDark} style={styles.contactIcon} />
              <Text style={styles.contactText}>{contact.email}</Text>
            </PressableText>
          )}
        </View>
      </View>

      <View style={styles.balanceRow}>
        <BalancePill label="Owes you" value={currency(stats.owedToMe)} color={theme.colors.success} softColor={theme.colors.successSoft} />
        <BalancePill label="You owe" value={currency(stats.oweOthers)} color={theme.colors.amber} softColor={theme.colors.amberSoft} />
        <BalancePill label="Net" value={currency(stats.net)} color={stats.net >= 0 ? theme.colors.success : theme.colors.red} softColor={stats.net >= 0 ? theme.colors.successSoft : theme.colors.redSoft} />
      </View>

      <View style={styles.section}>
        <SectionHeader title="Loans with {contact.name}" subtitle={`${contactLoans.length} agreements`} />
        {contactLoans.length > 0 ? (
          <View style={styles.loanList}>
            {contactLoans.map((loan) => (
              <View key={loan.id}>
                <LoanRow
                  loan={loan}
                  onPress={() => router.push(`/(tabs)/loan/${loan.id}`)}
                />
              </View>
            ))}
          </View>
        ) : (
          <EmptyState
            icon={<View style={styles.emptyIcon} />}
            title="No loans together"
            subtitle="Start tracking your first tab with this person."
          />
        )}
      </View>

      <View style={styles.section}>
        <SectionHeader title="Shared payment history" subtitle="Payments recorded on loans with {contact.name}" />
        {viewAllPayments().length > 0 ? (
          <View style={styles.historyList}>
            {viewAllPayments().map((payment) => (
              <PaymentRow key={payment.id} payment={payment} loan={store.getLoan(payment.loanId)!} />
            ))}
          </View>
        ) : (
          <EmptyState
            icon={<View style={styles.emptyIcon} />}
            title="No payments yet"
            subtitle="Record a payment from any of their loan screens."
          />
        )}
      </View>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  )
}

function viewAllPayments() {
  return store
    .getLoans()
    .flatMap((l) => l.payments.map((p) => ({ ...p, loanId: l.id })))
    .sort((a, b) => b.date.localeCompare(a.date))
}

function PressableText({ children, onPress }: { children: React.ReactNode; onPress: () => void }) {
  return (
    <TouchablePressable onPress={onPress}>{children}</TouchablePressable>
  )
}

function TouchablePressable({ children, onPress }: { children: React.ReactNode; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.contactLink} onPress={onPress} activeOpacity={0.9}>
      {children}
    </TouchableOpacity>
  )
}

function BalancePill({ label, value, color, softColor }: { label: string; value: string; color: string; softColor: string }) {
  return (
    <View style={[styles.pill, { backgroundColor: softColor }]}>
      <Text style={[styles.pillLabel, { color: color }]}>{label}</Text>
      <Text style={[styles.pillValue, { color }]}>{value}</Text>
    </View>
  )
}

function PaymentRow({ payment, loan }: { payment: { amount: number; date: string; method?: string; note?: string }; loan: Loan }) {
  const isLent = loan.type === 'lent'
  return (
    <View style={styles.paymentRow}>
      <View style={styles.paymentBody}>
        <Text style={styles.paymentPerson}>{loan.contactName}</Text>
        <Text style={styles.paymentNote}>
          {isLent ? 'Received' : 'Paid'} · {currency(payment.amount)}
          {payment.method ? ` · ${payment.method.replace('-', ' ')}` : ''}
        </Text>
      </View>
      <Text style={styles.paymentDate}>{new Date(payment.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</Text>
      <ChevronRight size={16} color={theme.colors.inkMuted} />
    </View>
  )
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
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    marginBottom: 12,
  },
  name: {
    fontSize: 26,
    fontWeight: '900',
    color: theme.colors.ink,
    marginBottom: 8,
  },
  contactRow: {
    flexDirection: 'row',
    gap: 16,
  },
  contactLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 10,
  },
  contactIcon: { marginRight: 6 },
  contactText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.primaryDark,
  },
  balanceRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  pill: {
    flex: 1,
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
    ...theme.shadow.soft,
  },
  pillLabel: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 4,
  },
  pillValue: {
    fontSize: 20,
    fontWeight: '800',
  },
  section: { marginBottom: 24 },
  loanList: { gap: 8 },
  historyList: { gap: 8 },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderSoft,
  },
  paymentBody: { flex: 1 },
  paymentPerson: {
    fontSize: 13,
    fontWeight: '800',
    color: theme.colors.ink,
  },
  paymentNote: {
    fontSize: 12,
    color: theme.colors.inkSoft,
    marginTop: 2,
  },
  paymentDate: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.ink,
  },
  emptyIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0EBDD',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  bottomSpacer: { height: 20 },
})
