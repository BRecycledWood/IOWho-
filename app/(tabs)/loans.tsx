import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import { useEffect, useMemo, useState } from 'react'
import { router } from 'expo-router'
import { Search, Plus } from 'lucide-react-native'
import { Card } from '@/components/Card'
import { SectionHeader } from '@/components/SectionHeader'
import { StatusBadge } from '@/components/StatusBadge'
import { EmptyState } from '@/components/EmptyState'
import { FAB } from '@/components/FAB'
import { Button } from '@/components/Button'
import { LoanRow } from '@/components/LoanRow'
import { store } from '@/lib/data'
import type { LoanStatus, LoanType } from '@/types/app'
import { theme } from '@/lib/theme'

const STATUS_CHIPS: LoanStatus[] = [
  'active',
  'partially-paid',
  'paid-in-full',
  'overdue',
  'cancelled',
  'disputed',
]

export default function LoansScreen() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<LoanStatus | 'all'>('all')
  const [typeFilter, setTypeFilter] = useState<LoanType | 'all'>('all')

  const loans = useMemo(() => {
    return store.getLoans({
      status: statusFilter === 'all' ? undefined : statusFilter,
      type: typeFilter === 'all' ? undefined : typeFilter,
      search: search || undefined,
    })
  }, [search, statusFilter, typeFilter])

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Loans</Text>
        <Button variant="ghost" title="New loan" onPress={() => router.push('/(tabs)/loan-create')} />
      </View>

      <View style={styles.searchBar}>
        <Search size={20} color={theme.colors.inkMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search people, loans, notes…"
          placeholderTextColor={theme.colors.inkMuted}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <View style={styles.filters}>
        <Chip
          selected={typeFilter === 'all'}
          onPress={() => setTypeFilter('all')}
        >
          All types
        </Chip>
        <Chip
          selected={typeFilter === 'lent'}
          onPress={() => setTypeFilter('lent')}
        >
          I lent
        </Chip>
        <Chip
          selected={typeFilter === 'borrowed'}
          onPress={() => setTypeFilter('borrowed')}
        >
          I borrowed
        </Chip>
      </View>

      <View style={styles.statusFilters}>
        {STATUS_CHIPS.map((status) => (
          <Chip
            key={status}
            selected={statusFilter === status}
            onPress={() => setStatusFilter(status)}
          >
            {status.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
          </Chip>
        ))}
      </View>

      <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
        {loans.length > 0 ? (
          loans.map((loan) => (
            <View key={loan.id}>
              <LoanRow
                loan={loan}
                onPress={() => router.push(`/(tabs)/loan/${loan.id}`)}
              />
            </View>
          ))
        ) : (
          <EmptyState
            icon={<View style={styles.emptyIcon} />}
            title="No loans found"
            subtitle={
              search || statusFilter !== 'all' || typeFilter !== 'all'
                ? "Try adjusting your filters or search."
                : "You haven't recorded any loans yet."
            }
          />
        )}
      </ScrollView>

      <FAB title="New loan" onPress={() => router.push('/(tabs)/loan-create')} />
    </View>
  )
}

function Chip({ children, selected, onPress }: { children: React.ReactNode; selected: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity
      style={[
        styles.chip,
        selected && { backgroundColor: theme.colors.primarySoft, borderColor: theme.colors.primary },
      ]}
      onPress={onPress}>
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{children}</Text>
    </TouchableOpacity>
  )
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
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  statusFilters: {
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  list: { flex: 1 },
  listContent: { padding: 16, paddingBottom: 110 },
  emptyIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0EBDD',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#D8D2C4',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.inkSoft,
  },
  chipTextSelected: {
    color: theme.colors.primaryDark,
  },
})
