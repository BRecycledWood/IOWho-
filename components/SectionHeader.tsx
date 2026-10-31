import { View, Text, StyleSheet, ViewStyle } from 'react-native'
import { theme } from '@/lib/theme'

interface SectionHeaderProps {
  title: string
  subtitle?: string
  style?: ViewStyle
}

export function SectionHeader({ title, subtitle, style }: SectionHeaderProps) {
  return (
    <View style={[styles.row, style]}>
      <View style={styles.text}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  text: { flex: 1 },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.ink,
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 13,
    color: theme.colors.inkSoft,
    marginTop: 2,
  },
})
