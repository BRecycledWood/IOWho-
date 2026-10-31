import { View, Text, StyleSheet } from 'react-native'
import { theme } from '@/lib/theme'

interface EmptyStateProps {
  title: string
  subtitle: string
  icon?: React.ReactNode
}

export function EmptyState({ title, subtitle, icon }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  iconContainer: {
    marginBottom: 20,
    opacity: 0.45,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.ink,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: theme.colors.inkSoft,
    textAlign: 'center',
    lineHeight: 22,
  },
})
