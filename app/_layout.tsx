import { useEffect } from 'react'
import { Stack, useRouter, useSegments } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { auth } from '@/lib/auth'

export default function RootLayout() {
  const segments = useSegments()
  const router = useRouter()

  useEffect(() => {
    const subscription = auth.onAuthStateChange((session) => {
      const inAuthGroup = segments[0] === 'auth'

      if (session && inAuthGroup) {
        router.replace('/(tabs)')
      } else if (!session && !inAuthGroup) {
        router.replace('/auth/welcome')
      }
    })

    return () => {
      subscription.dispose()
    }
  }, [segments])

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="auth" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </>
  )
}
