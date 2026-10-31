import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import { router } from 'expo-router'
import { useEffect, useMemo, useState } from 'react'
import { Clock, Filter } from 'lucide-react-native'
import { Card } from '@/components/Card'
import { SectionHeader } from '@/components/SectionHeader'
import { EmptyState } from '@/components/EmptyState'
import { FAB } from '@/components/FAB'
import { Button } from '@/components/Button'
import { store, currency } from '@/lib/data'
import type { Activity } from '@/types/app'
import { theme } from '@/lib/theme'

const TYPE_CHIPS: { key: string; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'loan_created', label: 'Loans' },
  { key: 'payment_recorded', label: 'Payments' },
  { key: 'reminder_sent', label: 'Reminders' },
  { key: 'status_changed', label: 'Status changes' },
  { key: 'loan_updated', label: 'Updates' },
]

export default function ActivityScreen() {
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [search, setSearch] = useState('')

  const activities = useMemo(() => {
    return store
      .getActivities({
        type: typeFilter === 'all' ? undefined : (typeFilter as any),
        person: search || undefined,
      })
      .slice(0, 60)
  }, [typeFilter, search])

  const grouped = useMemo(() => {
    const map: Record<string, Activity[]> = {}
    for (const a of activities) {
      const day = new Date(a.date).toDateString()
      ;(map[day] ??= []).push(a)
    }
    return Object.entries(map).map(([day, items]) => ({ day, items }))
  }, [activities])

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Activity</Text>
        <Button variant="ghost" title={search ? 'Clear' : 'Filter'} onPress={() => setSearch('')} />
      </View>

      <View style={styles.searchBar}>
        <Filter size={20} color={theme.colors.inkMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Filter by person…"
          placeholderTextColor={theme.colors.inkMuted}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <View style={styles.filters}>
        {TYPE_CHIPS.map((chip) => (
          <Chip
            key={chip.key}
            selected={typeFilter === chip.key}
            onPress={() => setTypeFilter(chip.key)}
          >
            {chip.label}
          </Chip>
        ))}
      </View>

      <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
        {grouped.length > 0 ? (
          grouped.map(({ day, items }) => (
            <View key={day} style={styles.dayGroup}>
              <View style={styles.dayHeader}>
                <View style={styles.dayLine} />
                <Text style={styles.dayLabel}>{formatDay(day)}</Text>
                <View style={styles.dayLine} />
              </View>
              {items.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </View>
          ))
        ) : (
          <EmptyState
            icon={<View style={styles.emptyIcon} />}
            title="Nothing here yet"
            subtitle={
              search || typeFilter !== 'all'
                ? "Try adjusting your filters."
                : "Your loan activity will show up here."
            }
          />
        )}
      </ScrollView>

      <FAB title="Track the tab" onPress={() => router.push('/(tabs)/loan-create')} />
    </View>
  )
}

function Chip({ children, selected, onPress }: { children: React.ReactNode; selected: boolean; onPress: () => void }) {
  return (
    <TouchableChip selected={selected} onPress={onPress}>
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{children}</Text>
    </TouchableChip>
  )
}

function TouchableChip({ children, selected, onPress }: { children: React.ReactNode; selected: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity style={[styles.chip, selected && styles.chipSelected]} onPress={onPress} activeOpacity={0.9}>
      {children}
    </TouchableOpacity>
  )
}

function ActivityItem({ activity }: { activity: Activity }) {
  const iconByType: Record<string, { icon: string; color: string }> = {
    loan_created: { icon: '📄', color: theme.colors.primary },
    payment_recorded: { icon: '💳', color: theme.colors.success },
    loan_updated: { icon: '✏️', color: theme.colors.inkMuted },
    reminder_sent: { icon: '🔔', color: theme.colors.amber },
    status_changed: { icon: '🚩', color: theme.colors.red },
  }
  const info = iconByType[activity.type] ?? { icon: '•', color: theme.colors.inkMuted }

  return (
    <View style={styles.item}>
      <View style={[styles.itemIcon, { backgroundColor: info.color + '22' }]}>{info.icon}</View>
      <View style={styles.itemBody}>
        <Text style={styles.itemTitle}>{activity.title}</Text>
        <Text style={styles.itemSubtitle}>
          {activity.subtitle ?? ''}
          {activity.amount != null ? ` — ${currency(activity.amount)}` : ''}
        </Text>
        <Text style={styles.itemTime}>
          {new Date(activity.date).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}
        </Text>
      </View>
    </View>
  )
}

const TODAY = new Date().toDateString()

function formatDay(dateString: string) {
  const d = new Date(dateString)
  const today = new Date(TODAY)
  const yesterday = new Date(TODAY)
  yesterday.setDate(today.getDate() - 1)
  if (d.toDateString() === today.toDateString()) return 'Today'
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday'
  return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: theme.colors.ink,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.ink,
  },
  filters: {
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  list: { flex: 1 },
  listContent: { padding: 16, paddingBottom: 110 },
  dayGroup: { marginBottom: 16 },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  dayLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.borderSoft,
  },
  dayLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: theme.colors.inkMuted,
    marginHorizontal: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  item: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderSoft,
  },
  itemIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemBody: { flex: 1 },
  itemTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.ink,
    marginBottom: 2,
  },
  itemSubtitle: {
    fontSize: 12,
    color: theme.colors.inkSoft,
    marginBottom: 4,
  },
  itemTime: {
    fontSize: 11,
    color: theme.colors.inkMuted,
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
  emptyIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0EBDD',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
})
