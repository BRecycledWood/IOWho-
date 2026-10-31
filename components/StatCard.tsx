import { View, Text, StyleSheet, ViewStyle } from 'react-native'
import { Card } from '@/components/Card'
import { theme } from '@/lib/theme'

interface StatCardProps {
  label: string
  value: string
  subtitle?: string
  color?: string
  softColor?: string
  style?: ViewStyle
}

export function StatCard({
  label,
  value,
  subtitle,
  color = theme.colors.primary,
  softColor = theme.colors.primarySoft,
  style,
}: StatCardProps) {
  return (
    <Card style={[styles.card, style]} elevated padding={16}>
      <View style={styles.row}>
        <View style={styles.text}>
          <Text style={[styles.label, { color: theme.colors.inkSoft }]}>{label}</Text>
          <Text style={[styles.value, { color }]}>{value}</Text>
          {subtitle && <Text style={[styles.subtitle, { color: theme.colors.inkMuted }]}>{subtitle}</Text>}
        </View>
        <View style={[styles.badge, { backgroundColor: softColor }]} />
      </View>
    </Card>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  row: { flex: 1 },
  text: { flex: 1 },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 2,
  },
  value: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
  },
  badge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginLeft: 12,
  },
})
