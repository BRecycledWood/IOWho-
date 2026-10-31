import { Pressable, Text, StyleSheet, ViewProps } from 'react-native'
import { Plus } from 'lucide-react-native'
import { theme } from '@/lib/theme'

interface FABProps extends ViewProps {
  title?: string
  onPress?: () => void
}

export function FAB({ title = 'New loan', onPress, ...props }: FABProps) {
  return (
    <Pressable
      style={styles.container}
      onPress={onPress}
      android_ripple={{ color: 'rgba(255,255,255,0.25)', borderless: true }}
      {...props}>
      <Plus size={22} color="#FFFFFF" strokeWidth={2.5} />
      {title && <Text style={styles.label}>{title}</Text>}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 28,
    gap: 8,
    ...theme.shadow.card,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
})
