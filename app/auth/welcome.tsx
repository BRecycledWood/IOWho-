import { View, Text, ScrollView, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { Button } from '@/components/Button'
import { theme } from '@/lib/theme'

export default function Welcome() {
  const router = useRouter()
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.brand}>
        <Text style={styles.kicker}>IOWho?</Text>
        <Text style={styles.tagline}>“Who owes who? IOWho? knows.”</Text>
      </View>

      <View style={styles.copy}>
        <Text style={styles.heading}>Money between friends gets complicated.</Text>
        <Text style={styles.body}>Keeping track shouldn’t.</Text>
      </View>

      <View style={styles.buttons}>
        <Button variant="primary" title="Track the Tab" onPress={() => router.push('/auth/sign-up')} />
        <View style={styles.divider}>
          <Text style={styles.dividerText}>— or —</Text>
        </View>
        <Button variant="outline" title="Already in the Hole? Log In" onPress={() => router.push('/auth/sign-in')} />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100%',
  },
  brand: {
    alignItems: 'center',
    marginBottom: 40,
  },
  kicker: {
    fontSize: 34,
    fontWeight: '900',
    color: theme.colors.ink,
    letterSpacing: -1,
    lineHeight: 40,
  },
  tagline: {
    fontSize: 15,
    color: theme.colors.primaryDark,
    fontWeight: '700',
    marginTop: 12,
    textAlign: 'center',
    lineHeight: 22,
  },
  copy: {
    alignItems: 'center',
    marginBottom: 32,
  },
  heading: {
    fontSize: 26,
    fontWeight: '800',
    color: theme.colors.ink,
    textAlign: 'center',
    lineHeight: 34,
    marginBottom: 12,
  },
  body: {
    fontSize: 17,
    color: theme.colors.inkSoft,
    textAlign: 'center',
    lineHeight: 26,
    maxWidth: 260,
  },
  buttons: {
    gap: 12,
    width: '100%',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
    width: '100%',
  },
  dividerText: {
    fontSize: 13,
    color: theme.colors.inkMuted,
    fontWeight: '600',
  },
})
