import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import { useEffect, useState } from 'react'
import { router } from 'expo-router'
import { Settings } from 'lucide-react-native'
import { Card } from '@/components/Card'
import { StatCard } from '@/components/StatCard'
import { SectionHeader } from '@/components/SectionHeader'
import { StatusBadge } from '@/components/StatusBadge'
import { EmptyState } from '@/components/EmptyState'
import { FAB } from '@/components/FAB'
import { LoanRow } from '@/components/LoanRow'
import { store, currency, loanStatusLabel } from '@/lib/data'
import type { Loan, Activity } from '@/types/app'
import { theme } from '@/lib/theme'

export default function Dashboard() {
  const [stats, setStats] = useState(store.getDashboardStats())

  useEffect(() => {
    setStats(store.getDashboardStats())
  }, [])

  const activeLoans = stats.overdue.concat(stats.upcoming).filter(
    (l) => l.status !== 'paid-in-full' && l.status !== 'cancelled',
  )

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good morning.</Text>
          <Text style={styles.title}>
            Who’s in the hole?{' '}
            <Text style={styles.titleAccent}>
              {stats.net >= 0 ? 'You’re up' : 'You’re in the hole'}
            </Text>
          </Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/settings')} style={styles.settingsButton}>
          <Settings size={22} color={theme.colors.inkSoft} />
        </TouchableOpacity>
      </View>

      <View style={styles.statsRow}>
        <StatCard
          label="Owed to you"
          value={currency(stats.owedToMe)}
          subtitle={`${stats.overdue.length} overdue`}
          color={theme.colors.success}
          softColor={theme.colors.successSoft}
        />
        <StatCard
          label="You owe"
          value={currency(stats.oweOthers)}
          subtitle="Net position below"
          color={theme.colors.amber}
          softColor={theme.colors.amberSoft}
        />
        <StatCard
          label="Net position"
          value={currency(stats.net)}
          subtitle={stats.net >= 0 ? 'Positive' : 'Negative'}
          color={stats.net >= 0 ? theme.colors.success : theme.colors.red}
          softColor={stats.net >= 0 ? theme.colors.successSoft : theme.colors.redSoft}
        />
      </View>

      <View style={styles.section}>
        <SectionHeader
          title="Needs attention"
          subtitle="Payments that require a nudge"
        />
        <View style={styles.attentionRow}>
          {stats.overdue.length > 0 ? (
            <View style={styles.attentionCard}>
              <Text style={styles.attentionLabel}>Overdue</Text>
              <Text style={styles.attentionValue}>{stats.overdue.length}</Text>
              <Text style={styles.attentionNote}>
                {currency(
                  stats.overdue.reduce((sum, l) => sum + l.outstanding, 0),
                )} outstanding
              </Text>
            </View>
          ) : null}
          {stats.upcoming.length > 0 ? (
            <View style={styles.attentionCard}>
              <Text style={styles.attentionLabel}>Upcoming</Text>
              <Text style={styles.attentionValue}>{stats.upcoming.length}</Text>
              <Text style={styles.attentionNote}>Due within 7 days</Text>
            </View>
          ) : null}
          {stats.overdue.length === 0 && stats.upcoming.length === 0 && (
            <EmptyState
              icon={<View style={styles.emptyIcon} />}
              title="All caught up"
              subtitle="No upcoming or overdue payments right now."
            />
          )}
        </View>
      </View>

      <View style={styles.section}>
        <SectionHeader title="Active loans" subtitle={`${activeLoans.length} agreements`} />
        {activeLoans.length > 0 ? (
          <View style={styles.loanList}>
            {activeLoans.map((loan) => (
              <View key={loan.id}>
                <LoanRow loan={loan} onPress={() => router.push(`/(tabs)/loan/${loan.id}`)} />
              </View>
            ))}
          </View>
        ) : (
          <EmptyState
            icon={<View style={styles.emptyIcon} />}
            title="No active loans"
            subtitle="Track your first tab with the button below."
          />
        )}
      </View>

      <View style={styles.section}>
        <SectionHeader
          title="Recent activity"
          subtitle="The latest movement across your loans"
        />
        {stats.recentActivity.length > 0 ? (
          <View style={styles.activityList}>
            {stats.recentActivity.map((activity) => (
              <ActivityRow key={activity.id} activity={activity} />
            ))}
          </View>
        ) : null}
      </View>

      <FAB title="Track the tab" onPress={() => router.push('/(tabs)/loan-create')} />
    </ScrollView>
  )
}

function ActivityRow({ activity }: { activity: Activity }) {
  const iconByType: Record<string, string> = {
    loan_created: '📄',
    payment_recorded: '💳',
    loan_updated: '✏️',
    reminder_sent: '🔔',
    status_changed: '🚩',
  }
  return (
    <View style={styles.activityItem}>
      <View style={styles.activityIcon}>{iconByType[activity.type] ?? '•'}</View>
      <View style={styles.activityBody}>
        <Text style={styles.activityTitle}>{activity.title}</Text>
        <Text style={styles.activitySubtitle}>
          {activity.person ? activity.person + ' · ' : ''}
          {new Date(activity.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 110,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  settingsButton: {
    padding: 8,
  },
  greeting: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.inkSoft,
  },
  title: {
    fontSize: 27,
    fontWeight: '900',
    color: theme.colors.ink,
    letterSpacing: -0.8,
    marginTop: 2,
    lineHeight: 32,
  },
  titleAccent: {
    color: theme.colors.primaryDark,
  },
  statsRow: {
    gap: 10,
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  attentionRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 4,
  },
  attentionCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius,
    padding: 14,
    ...theme.shadow.soft,
  },
  attentionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.inkMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  attentionValue: {
    fontSize: 24,
    fontWeight: '900',
    color: theme.colors.ink,
    marginTop: 4,
  },
  attentionNote: {
    fontSize: 12,
    color: theme.colors.inkSoft,
    marginTop: 2,
  },
  emptyIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0EBDD',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  loanList: { gap: 8 },
  activityList: { gap: 8 },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderSoft,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.surfaceSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityBody: { flex: 1 },
  activityTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.ink,
  },
  activitySubtitle: {
    fontSize: 12,
    color: theme.colors.inkSoft,
    marginTop: 2,
  },
})
