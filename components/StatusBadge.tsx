import { View, Text, StyleSheet, ViewStyle } from 'react-native'
import { theme } from '@/lib/theme'
import type { LoanStatus } from '@/types/app'

const statusConfig: Record<LoanStatus, { color: string; soft: string }> = {
  active: { color: '#1E7A46', soft: '#EEF7F2' },
  'partially-paid': { color: '#B45309', soft: '#FDF3E2' },
  'paid-in-full': { color: '#6B6358', soft: '#F0EBDD' },
  overdue: { color: '#B3402E', soft: '#FBECE9' },
  cancelled: { color: '#9A9285', soft: '#F0EBDD' },
  disputed: { color: '#6B4E8B', soft: '#F3EEF7' },
}

interface StatusBadgeProps {
  status: LoanStatus
  style?: ViewStyle
  small?: boolean
}

export function StatusBadge({ status, style, small = false }: StatusBadgeProps) {
  const config = statusConfig[status]
  return (
    <View style={[styles.container, style, { backgroundColor: config.soft }]}>
      <Text style={[styles.text, { color: config.color, fontSize: small ? 11 : 12 }]}>
        {status.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    alignItems: 'center',
  },
  text: {
    fontWeight: '700',
  },
})
