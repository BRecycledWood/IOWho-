import { Pressable, Text, StyleSheet, ViewProps } from 'react-native'
import type { TextStyle, ViewStyle } from 'react-native'
import type { ThemeColors } from '@/lib/theme'
import { theme } from '@/lib/theme'

type Variant = 'primary' | 'outline' | 'ghost' | 'danger'

interface ButtonProps extends ViewProps {
  title: string
  onPress?: () => void
  disabled?: boolean
  variant?: Variant
  loading?: boolean
}

export function Button({
  title,
  onPress,
  disabled = false,
  variant = 'primary',
  loading = false,
  ...props
}: ButtonProps) {
  const colors = theme.colors
  const isDisabled = disabled || loading

  const base: ViewStyle = {
    borderRadius: theme.radius,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  }

  const label: TextStyle = {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  }

  let style: ViewStyle = { ...base }
  let labelColor: string = colors.white

  if (variant === 'primary') {
    style.backgroundColor = isDisabled ? '#C9B8D6' : colors.primary
    labelColor = colors.white
  } else if (variant === 'outline') {
    style = {
      ...style,
      borderWidth: 1.5,
      borderColor: isDisabled ? '#D8D2C4' : colors.primary,
      backgroundColor: 'transparent',
    }
    labelColor = isDisabled ? '#A8A093' : colors.primary
  } else if (variant === 'ghost') {
    style = { ...style, backgroundColor: 'transparent', paddingVertical: 10 }
    labelColor = isDisabled ? '#A8A093' : colors.primaryDark
    label.fontWeight = '600'
  } else if (variant === 'danger') {
    style.backgroundColor = isDisabled ? '#D9A89E' : colors.red
    labelColor = colors.white
  }

  return (
    <Pressable
      style={style}
      onPress={isDisabled ? undefined : onPress}
      disabled={isDisabled}
      android_ripple={{ color: 'rgba(255,255,255,0.2)', borderless: true }}
      {...props}>
      <Text style={[styles.label, { color: labelColor }]}>{loading ? '…' : title}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  label: {
    textAlign: 'center',
  },
})
