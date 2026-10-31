import { View, Text, ScrollView, StyleSheet, Switch, TouchableOpacity } from 'react-native'
import { useEffect, useState } from 'react'
import { router } from 'expo-router'
import { ShieldCheck, Mail, Lock, Download, User, ChevronRight } from 'lucide-react-native'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { Card } from '@/components/Card'
import { SectionHeader } from '@/components/SectionHeader'
import { auth } from '@/lib/auth'
import { theme } from '@/lib/theme'

export default function SettingsScreen() {
  const [toggles, setToggles] = useState({
    upcoming: true,
    today: true,
    overdue: true,
    received: true,
    repaid: true,
  })
  const [tone, setTone] = useState<'friendly' | 'direct' | 'playful'>('friendly')
  const [user, setUser] = useState<{ email: string; name: string } | null>(null)

  useEffect(() => {
    const session = auth.getSession()
    setUser(session ? { email: session.user.email, name: session.user.fullName } : null)
  }, [])

  const toneLabels: Record<string, string> = {
    friendly: 'Friendly',
    direct: 'Direct',
    playful: 'Playful',
  }
  const toneExamples: Record<string, string> = {
    friendly: '“Just a heads-up! Your $50 payment is coming up.”',
    direct: '“Your $50 payment is due tomorrow.”',
    playful: '“That $50 hasn’t forgotten about you.”',
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <View style={styles.section}>
        <SectionHeader title="Profile" subtitle="Your account" />
        <Card padding={0} elevated>
          <ProfileRow icon={<User size={24} color={theme.colors.primaryDark} />} label="Full name" value={user?.name ?? 'IOWho user'} />
          <Divider />
          <ProfileRow icon={<Mail size={24} color={theme.colors.primaryDark} />} label="Email" value={user?.email ?? '—'} />
        </Card>
      </View>

      <View style={styles.section}>
        <SectionHeader title="Notifications" subtitle="Reminders to keep tabs friendly" />
        <Card padding={0} elevated>
          <ToggleRow label="Upcoming payment" subtitle="Ping before a payment is due" value={toggles.upcoming} onChange={(v) => setToggles((t) => ({ ...t, upcoming: v }))} />
          <Divider />
          <ToggleRow label="Payment due today" subtitle="Same-day reminders" value={toggles.today} onChange={(v) => setToggles((t) => ({ ...t, today: v }))} />
          <Divider />
          <ToggleRow label="Overdue payment" subtitle="Gentle nudges after the due date" value={toggles.overdue} onChange={(v) => setToggles((t) => ({ ...t, overdue: v }))} />
          <Divider />
          <ToggleRow label="Payment received" subtitle="Confirm when you’re paid back" value={toggles.received} onChange={(v) => setToggles((t) => ({ ...t, received: v }))} />
          <Divider />
          <ToggleRow label="Loan fully repaid" subtitle="Celebrate a closed tab" value={toggles.repaid} onChange={(v) => setToggles((t) => ({ ...t, repaid: v }))} />
        </Card>

        <Card style={styles.toneCard} padding={0} elevated>
          <Text style={styles.toneTitle}>Reminder tone</Text>
          <Text style={styles.toneSubtitle}>{toneExamples[tone]}</Text>
          <View style={styles.toneRow}>
            {(['friendly', 'direct', 'playful'] as const).map((t) => (
              <ToneChip key={t} selected={tone === t} onPress={() => setTone(t)} label={toneLabels[t]} />
            ))}
          </View>
        </Card>
      </View>

      <View style={styles.section}>
        <SectionHeader title="Subscription" subtitle="DIY Debt Collector → CFO of My Life" />
        <Card padding={0} elevated>
          <PlanRow name="DIY Debt Collector" plan="Free" features={['Manual loan creation', 'Basic dashboard', 'Manual payment tracking', 'Private personal records']} active />
          <Divider />
          <PlanRow name="CFO of My Life" plan="Premium" features={['Shared loan invitations', 'Automated reminders', 'Payment schedules', 'Advanced loan terms', 'Expanded history & reporting', 'Export functionality']} buttonTitle="Upgrade" onUpgrade={() => {}} />
          <Text style={styles.priceNote}>Pricing is configurable — premium placeholders shown without inventing prices.</Text>
        </Card>
      </View>

      <View style={styles.section}>
        <SectionHeader title="Data" subtitle="Export and privacy" />
        <Card padding={0} elevated>
          <DataRow icon={<Download size={20} color={theme.colors.primaryDark} />} label="Export your data" subtitle="Download your loans, payments, and contacts" onPress={() => {}} />
          <Divider />
          <DataRow icon={<Lock size={20} color={theme.colors.primaryDark} />} label="Security" subtitle="Change password and active sessions" onPress={() => {}} />
          <Divider />
          <DataRow icon={<ShieldCheck size={20} color={theme.colors.primaryDark} />} label="Privacy controls" subtitle="Manage what shared participants can see" onPress={() => {}} />
        </Card>
      </View>

      <View style={styles.section}>
        <Card padding={0} elevated>
          <Button variant="danger" title="Delete account" onPress={() => {}} style={styles.dangerButton} />
        </Card>
      </View>
    </ScrollView>
  )
}

function ToggleRow({ label, subtitle, value, onChange }: { label: string; subtitle: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <View style={styles.toggleRow}>
      <View>
        <Text style={styles.toggleLabel}>{label}</Text>
        <Text style={styles.toggleSubtitle}>{subtitle}</Text>
      </View>
      <Switch value={value} onValueChange={onChange} trackColor={{ false: '#D8D2C4', true: theme.colors.primary }} thumbColor="#FFFFFF" />
    </View>
  )
}

function ToneChip({ selected, onPress, label }: { selected: boolean; onPress: () => void; label: string }) {
  return (
    <TouchableOpacity style={[styles.chip, selected && styles.chipSelected]} onPress={onPress} activeOpacity={0.9}>
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
    </TouchableOpacity>
  )
}

function PlanRow({ name, plan, features, active, buttonTitle, onUpgrade }: { name: string; plan: string; features: string[]; active?: boolean; buttonTitle?: string; onUpgrade?: () => void }) {
  return (
    <View style={styles.planRow}>
      <View style={styles.planBody}>
        <Text style={styles.planName}>{name}</Text>
        <Text style={styles.planBadge}>{plan}</Text>
        <View style={styles.planFeatures}>
          {features.map((f) => (
            <Text key={f} style={styles.planFeature}>
              {'\u2022 '} {f}
            </Text>
          ))}
        </View>
      </View>
      {active ? (
        <Text style={styles.activeBadge}>Current plan</Text>
      ) : buttonTitle && onUpgrade ? (
        <Button variant="outline" title={buttonTitle} onPress={onUpgrade} />
      ) : null}
    </View>
  )
}

function DataRow({ icon, label, subtitle, onPress }: { icon: React.ReactNode; label: string; subtitle: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.dataRow} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.iconBox}>{icon}</View>
      <View style={styles.dataBody}>
        <Text style={styles.dataLabel}>{label}</Text>
        <Text style={styles.dataSubtitle}>{subtitle}</Text>
      </View>
      <Chevron size={16} color={theme.colors.inkMuted} />
    </TouchableOpacity>
  )
}

function ProfileRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <View style={styles.profileRow}>
      <View style={styles.iconBox}>{icon}</View>
      <View style={styles.profileBody}>
        <Text style={styles.profileLabel}>{label}</Text>
        <Text style={styles.profileValue}>{value}</Text>
      </View>
      <Chevron size={16} color={theme.colors.inkMuted} />
    </View>
  )
}

function Divider() {
  return <View style={styles.divider} />
}

function Chevron({ size = 16, color = theme.colors.inkMuted }: { size?: number; color?: string }) {
  return <ChevronRight size={size} color={color} />
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: { padding: 16, paddingBottom: 110 },
  header: { padding: 16, paddingTop: 8 },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: theme.colors.ink,
  },
  section: { marginBottom: 24 },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  toggleLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.ink,
  },
  toggleSubtitle: {
    fontSize: 12,
    color: theme.colors.inkSoft,
    marginTop: 2,
  },
  toneCard: {
    marginTop: 12,
    padding: 16,
  },
  toneTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: theme.colors.ink,
    marginBottom: 6,
  },
  toneSubtitle: {
    fontSize: 13,
    color: theme.colors.inkSoft,
    marginBottom: 14,
    fontStyle: 'italic',
  },
  toneRow: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#D8D2C4',
    backgroundColor: '#FFFFFF',
  },
  chipSelected: {
    backgroundColor: theme.colors.primarySoft,
    borderColor: theme.colors.primary,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.inkSoft,
  },
  chipTextSelected: {
    color: theme.colors.primaryDark,
  },
  planRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
  },
  planBody: { flex: 1 },
  planName: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.colors.ink,
    marginBottom: 4,
  },
  planBadge: {
    fontSize: 11,
    fontWeight: '800',
    color: theme.colors.primaryDark,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 8,
  },
  planFeatures: { gap: 4 },
  planFeature: {
    fontSize: 13,
    color: theme.colors.inkSoft,
  },
  activeBadge: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.success,
    alignSelf: 'center',
    marginTop: 30,
  },
  priceNote: {
    fontSize: 12,
    color: theme.colors.inkMuted,
    marginTop: 12,
    paddingHorizontal: 16,
    textAlign: 'center',
  },
  dataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  iconBox: {
    marginRight: 12,
  },
  dataBody: { flex: 1 },
  dataLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.ink,
  },
  dataSubtitle: {
    fontSize: 12,
    color: theme.colors.inkSoft,
    marginTop: 2,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 13,
    paddingHorizontal: 16,
  },
  profileBody: { flex: 1 },
  profileLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.inkMuted,
  },
  profileValue: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.ink,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.borderSoft,
    marginHorizontal: 16,
  },
  dangerButton: {
    backgroundColor: theme.colors.redSoft,
    borderWidth: 1,
    borderColor: '#E7B8AE',
    margin: 16,
  },
})
