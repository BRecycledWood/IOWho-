import type { ViewStyle, TextStyle } from 'react-native'

export const theme = {
  // Warm, human palette — a personal organizer, not a bank dashboard.
  colors: {
    background: '#FBFAF6', // warm paper
    surface: '#FFFFFF',
    surfaceSoft: '#F4EFE6',
    surfaceActive: '#EDE6D7',
    border: '#E3DECE',
    borderSoft: '#F0EBDD',
    ink: '#2E271B',        // warm near-black
    inkSoft: '#6B6358',    // warm gray
    inkMuted: '#9A9285',
    primary: '#6B4E8B',    // deep plum — confidence & trust
    primaryDark: '#543C70',
    primarySoft: '#F3EEF7',
    success: '#1E7A46',    // money owed to me (coming in)
    successSoft: '#EEF7F2',
    amber: '#B45309',      // money I owe / attention
    amberSoft: '#FDF3E2',
    red: '#B3402E',        // overdue
    redSoft: '#FBECE9',
    overlay: 'rgba(46, 39, 27, 0.45)',
    white: '#FFFFFF',
  } as const,
  radius: 18,
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
    xxxl: 48,
  },
  shadow: {
    soft: {
      shadowColor: '#2E271B',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.06,
      shadowRadius: 12,
      elevation: 2,
    },
    card: {
      shadowColor: '#2E271B',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.08,
      shadowRadius: 16,
      elevation: 3,
    },
  },
} as const

export type ThemeColors = typeof theme.colors

export function cn(styles: (ViewStyle | TextStyle | undefined | false)[]) {
  return styles.filter(Boolean) as (ViewStyle | TextStyle)[]
}
