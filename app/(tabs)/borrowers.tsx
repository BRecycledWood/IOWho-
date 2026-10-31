import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import { useEffect, useMemo, useState } from 'react'
import { router } from 'expo-router'
import { Search, ChevronRight } from 'lucide-react-native'
import { Card } from '@/components/Card'
import { SectionHeader } from '@/components/SectionHeader'
import { EmptyState } from '@/components/EmptyState'
import { FAB } from '@/components/FAB'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { Avatar } from '@/components/Avatar'
import { store, currency } from '@/lib/data'
import type { Contact } from '@/types/app'
import { theme } from '@/lib/theme'

export default function BorrowersScreen() {
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  const contacts = useMemo(() => {
    return store.getContacts().filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
  }, [search])

  const addContact = () => {
    setError('')
    if (!name.trim()) {
      setError("Enter a name.")
      return
    }
    store.createContact({ name: name.trim(), phone: phone || undefined, email: email || undefined })
    setName('')
    setPhone('')
    setEmail('')
    setShowForm(false)
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>People</Text>
        <Button variant="ghost" title="Add person" onPress={() => setShowForm(true)} />
      </View>

      <View style={styles.searchBar}>
        <Search size={20} color={theme.colors.inkMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search people…"
          placeholderTextColor={theme.colors.inkMuted}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {showForm && (
        <Card style={styles.addCard} padding={16} elevated>
          <Text style={styles.formTitle}>New person</Text>
          <Input label="Full name" value={name} onChangeText={setName} placeholder="e.g. Sam Rivera" autoCapitalize="words" />
          <Input label="Phone (optional)" value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholder="(555) 000-0000" />
          <Input label="Email (optional)" value={email} onChangeText={setEmail} keyboardType="email-address" placeholder="sam@example.com" autoCapitalize="none" />
          {error && <Text style={styles.error}>{error}</Text>}
          <View style={styles.formButtons}>
            <Button variant="outline" title="Cancel" onPress={() => setShowForm(false)} />
            <Button variant="primary" title="Add person" onPress={addContact} />
          </View>
        </Card>
      )}

      <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
        {renderList(contacts, search)}
      </ScrollView>

      <FAB title="Add person" onPress={() => setShowForm(true)} />
    </View>
  )
}

function ContactRow({ contact }: { contact: Contact }) {
  return (
    <Card style={styles.row} padding={14} elevated>
      <TouchableRow onPress={() => router.push(`/(tabs)/borrower/${contact.id}`)}>
        <Avatar name={contact.name} size={46} style={styles.avatar} />
        <View style={styles.body}>
          <Text style={styles.name}>{contact.name}</Text>
          <View style={styles.metaRow}>
            {contact.phone && (
              <Text style={styles.meta}>📞 {contact.phone}</Text>
            )}
            {contact.email && (
              <Text style={styles.meta}>✉️ {contact.email}</Text>
            )}
          </View>
        </View>
        <View style={styles.balance}>
          <Text style={styles.balanceAmount}>—</Text>
          <Text style={styles.balanceLabel}>View balance</Text>
        </View>
        <ChevronRight size={16} color={theme.colors.inkMuted} />
      </TouchableRow>
    </Card>
  )
}

function renderList(contacts: Contact[], search: string) {
  if (contacts.length > 0) {
    return contacts.map((contact) => (
      <View key={contact.id}>
        <ContactRow contact={contact} />
      </View>
    ))
  }
  return (
    <EmptyState
      icon={<View style={styles.emptyIcon} />}
      title={search ? 'No matches' : 'No people yet'}
      subtitle={search ? 'Try a different name.' : "Add the people you lend to or borrow from."}
    />
  )
}

function TouchableRow({ children, onPress }: { children: React.ReactNode; onPress: () => void }) {
  return (
    <TouchableOpacity
      style={styles.touchable}
      onPress={onPress}
      activeOpacity={0.95}>
      {children}
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
  addCard: {
    margin: 16,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.colors.ink,
    marginBottom: 16,
  },
  formButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  error: {
    color: theme.colors.red,
    fontSize: 13,
    marginBottom: 10,
    padding: 10,
    backgroundColor: theme.colors.redSoft,
    borderRadius: 10,
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 2,
  },
  touchable: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    width: '100%',
  },
  avatar: { marginRight: -6 },
  body: { flex: 1 },
  name: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.colors.ink,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
    flexWrap: 'wrap',
  },
  meta: {
    fontSize: 12,
    color: theme.colors.inkMuted,
  },
  balance: { alignItems: 'flex-end' },
  balanceAmount: {
    fontSize: 15,
    fontWeight: '800',
    color: theme.colors.ink,
  },
  balanceLabel: {
    fontSize: 11,
    color: theme.colors.inkMuted,
  },
})

