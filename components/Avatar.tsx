import { View, Text, StyleSheet, ViewStyle } from 'react-native'
import { theme } from '@/lib/theme'

const colors = [
  '#6B4E8B',
  '#1E7A46',
  '#B45309',
  '#B3402E',
  '#543C70',
  '#0E7C86',
]

function colorForName(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}

interface AvatarProps {
  name: string
  size?: number
  style?: ViewStyle
}

export function Avatar({ name, size = 32, style }: AvatarProps) {
  const initials = name
    .split(' ')
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <View style={[styles.container, { width: size, height: size, backgroundColor: colorForName(name) }, style]}>
      <Text style={[styles.text, { fontSize: Math.round(size * 0.4) }]}>{initials}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D8D2C4',
  },
  text: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
})
