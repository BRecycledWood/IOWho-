import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native'
import { theme } from '@/lib/theme'

interface CardProps {
  children: React.ReactNode
  style?: StyleProp<ViewStyle>
  padding?: number
  elevated?: boolean
}

export function Card({ children, style, padding = 16, elevated = true }: CardProps) {
  return (
    <View style={[styles.base, elevated && styles.elevated, { padding }, style]}>
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius,
  },
  elevated: {
    ...theme.shadow.card,
  },
})
