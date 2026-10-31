import { TextInput, Text, View, StyleSheet, ViewProps } from 'react-native'
import type { KeyboardTypeOptions, StyleProp, TextStyle } from 'react-native'
import { theme } from '@/lib/theme'

interface InputProps extends Omit<ViewProps, 'color'> {
  label?: string
  value: string
  onChangeText: (text: string) => void
  placeholder?: string
  error?: string
  multiline?: boolean
  minHeight?: number
  keyboardType?: KeyboardTypeOptions
  secureTextEntry?: boolean
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters'
}

export function Input({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  multiline = false,
  minHeight,
  keyboardType,
  secureTextEntry,
  autoCapitalize,
  ...props
}: InputProps) {
  const hasError = Boolean(error)
  const borderColor = hasError ? theme.colors.red : '#D8D2C4'
  const bg = '#FFFFFF'

  return (
    <View style={styles.wrapper}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          multiline && { minHeight: minHeight ?? 100, textAlignVertical: 'top' },
          { borderColor, backgroundColor: bg },
        ] as any}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        multiline={multiline}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        autoCapitalize={autoCapitalize}
        {...props}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: 16 },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.inkSoft,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 16,
    color: theme.colors.ink,
  },
  error: {
    fontSize: 12,
    color: theme.colors.red,
    marginTop: 6,
  },
})
