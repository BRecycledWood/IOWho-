import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native'
import { format } from 'date-fns'
import { theme } from '@/lib/theme'
import { Avatar } from '@/components/Avatar'
import { StatusBadge } from '@/components/StatusBadge'
import { currency, directionColor, loanTypeLabel } from '@/lib/data'
import type { Loan } from '@/types/app'

interface LoanRowProps {
  loan: Loan
  onPress: () => void
}

export function LoanRow({ loan, onPress }: LoanRowProps) {
  const isLent = loan.type === 'lent'
  const pct = loan.amount ? Math.round((loan.repaid / loan.amount) * 100) : 0
  const dueText = loan.dueDate ? `Due ${format(new Date(loan.dueDate), 'MMM d')}` : 'No due date'

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.85}>
      <View style={styles.row}>
        <Avatar name={loan.contactName} size={44} style={styles.avatar} />
        <View style={styles.body}>
          <View style={styles.headerRow}>
            <Text style={styles.name}>{loan.contactName}</Text>
            <Text style={[styles.chip, { backgroundColor: directionColor(loan.type) + '22' }]}>
              {loanTypeLabel(loan.type)}
            </Text>
          </View>
          <Text style={styles.subtitle}>{loan.description ?? dueText}</Text>
          <View style={styles.footer}>
            <Text style={styles.amount}>{isLent ? `+${currency(loan.outstanding)}` : `-${currency(loan.outstanding)}`}</Text>
            <View style={styles.progress}>
              <Text style={styles.progressText}>{pct}% repaid</Text>
            </View>
          </View>
        </View>
        <View style={styles.statusWrapper}>
          <StatusBadge status={loan.status} />
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius,
    marginBottom: 10,
    ...theme.shadow.soft,
  },
  row: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { marginRight: -4 },
  body: { flex: 1 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 17,
    fontWeight: '800',
    color: theme.colors.ink,
  },
  chip: {
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  subtitle: {
    fontSize: 13,
    color: theme.colors.inkSoft,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amount: {
    fontSize: 17,
    fontWeight: '800',
    color: theme.colors.ink,
  },
  progress: { alignItems: 'flex-end' },
  progressText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.inkMuted,
  },
  statusWrapper: { alignItems: 'flex-end' },
})
