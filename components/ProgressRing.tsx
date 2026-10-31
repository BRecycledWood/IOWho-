import { View, Text, StyleSheet, ViewStyle } from 'react-native'
import { Svg, Circle } from 'react-native-svg'
import { theme } from '@/lib/theme'

interface ProgressRingProps {
  value: number // percent 0-100
  size?: number
  color?: string
  label?: string
  style?: ViewStyle
}

export function ProgressRing({
  value,
  size = 96,
  color = theme.colors.success,
  label,
  style,
}: ProgressRingProps) {
  const radius = 34
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference
  const pct = Math.max(0, Math.min(100, value))

  return (
    <View style={[styles.wrapper, { width: size, height: size }, style]}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#EDE7D8"
          strokeWidth={10}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={10}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </Svg>
      <View style={styles.center}>
        {label && <Text style={styles.label}>{label}</Text>}
        <Text style={styles.percent}>{pct}%</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 96,
    height: 96,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.inkSoft,
    marginBottom: 2,
  },
  percent: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.ink,
  },
})
