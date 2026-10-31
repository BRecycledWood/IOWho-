import { View, Text, ScrollView, StyleSheet, Switch, TouchableOpacity } from 'react-native'
import { useEffect, useState } from 'react'
import { router } from 'expo-router'
import { ShieldAlert } from 'lucide-react-native'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { Card } from '@/components/Card'
import { SectionHeader } from '@/components/SectionHeader'
import { theme } from '@/lib/theme'
import { store } from '@/lib/data'
import type { NewLoanInput, LoanType } from '@/types/app'

type Step = 'type' | 'details'

export default function LoanCreateScreen() {
  const [step, setStep] = useState<Step>('type')
  const [type, setType] = useState<LoanType | null>(null)
  const [contactName, setContactName] = useState('')
  const [amount, setAmount] = useState('')
  const [startDate, setStartDate] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [description, setDescription] = useState('')
  const [advanced, setAdvanced] = useState(false)
  const [interestRate, setInterestRate] = useState('')
  const [lateFee, setLateFee] = useState('')
  const [paymentFrequency, setPaymentFrequency] = useState<
    'weekly' | 'biweekly' | 'monthly' | ''
  >('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setStartDate(new Date().toISOString().slice(0, 10))
  }, [])

  const handleSubmit = async () => {
    setError('')
    if (!contactName.trim()) {
      setError("Tell us who this loan is with.")
      return
    }
    if (!amount || parseFloat(amount) <= 0) {
      setError("Enter a valid amount.")
      return
    }
    if (!type) {
      setError("Pick a direction for the money.")
      return
    }

    setLoading(true)
    try {
      const input: NewLoanInput = {
        contactName: contactName.trim(),
        type,
        amount: parseFloat(amount),
        startDate,
        dueDate: dueDate || undefined,
        description: description || undefined,
        interestRate: interestRate ? parseFloat(interestRate) : undefined,
        lateFee: lateFee ? parseFloat(lateFee) : undefined,
        paymentFrequency: paymentFrequency || undefined,
        notes: notes || undefined,
      }

      store.createLoan(input)
      router.replace('/(tabs)')
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't record the loan.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity style={[styles.back]} onPress={() => router.back()}>
          <Text style={styles.backLabel}>&lt;</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Record a loan</Text>
      </View>

      {step === 'type' ? (
        <View style={styles.stepContainer}>
          <SectionHeader title="Who owes who?" subtitle="Pick the direction of the money" />
          <View style={styles.typeRow}>
            <TypeButton
              selected={type === 'lent'}
              onPress={() => setType('lent')}
              title="I lent money"
              subtitle="They owe you"
              icon="💸"
            />
            <TypeButton
              selected={type === 'borrowed'}
              onPress={() => setType('borrowed')}
              title="I borrowed money"
              subtitle="You owe them"
              icon="💰"
            />
          </View>
          <Text style={styles.hint}>
            Not sure yet? You can adjust the direction on the loan’s detail screen later.
          </Text>
        </View>
      ) : (
        <View style={styles.stepContainer}>
          <SectionHeader
            title="The details"
            subtitle="Keep it quick — advanced options are below"
          />

          <Input
            label="Person’s name"
            value={contactName}
            onChangeText={setContactName}
            placeholder="e.g. Sam Rivera"
            autoCapitalize="words"
          />

          <View style={styles.twoColumn}>
            <Input
              label="Amount ($)"
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
            />
            <Input
              label="Date"
              value={startDate}
              onChangeText={setStartDate}
              placeholder="YYYY-MM-DD"
            />
          </View>

          <Input
            label="Description (optional)"
            value={description}
            onChangeText={setDescription}
            placeholder="e.g. Dinner & concert tickets"
          />

          <View style={styles.twoColumn}>
            <Input
              label="Due date (optional)"
              value={dueDate}
              onChangeText={setDueDate}
              placeholder="YYYY-MM-DD"
            />
            <View style={styles.advancedToggle}>
              <Text style={styles.advancedLabel}>Advanced options</Text>
              <Switch
                value={advanced}
                onValueChange={setAdvanced}
                trackColor={{ false: '#D8D2C4', true: theme.colors.primary }}
                thumbColor={advanced ? theme.colors.primary : '#FFFFFF'}
              />
            </View>
          </View>

          {advanced && (
            <Card style={styles.advancedCard} padding={16} elevated>
              <Text style={styles.advancedHeading}>Loan terms</Text>
              <View style={styles.twoColumn}>
                <Input
                  label="Interest rate (%)"
                  value={interestRate}
                  onChangeText={setInterestRate}
                  keyboardType="decimal-pad"
                />
                <Input
                  label="Late fee ($)"
                  value={lateFee}
                  onChangeText={setLateFee}
                  keyboardType="decimal-pad"
                />
              </View>
              <Input
                label="Payment frequency"
                value={paymentFrequency}
                onChangeText={(t) => setPaymentFrequency(t as any)}
                placeholder="e.g. monthly"
              />
              <Input
                label="Notes (optional)"
                value={notes}
                onChangeText={setNotes}
                multiline
                minHeight={80}
                placeholder="Anything else worth remembering"
              />
              <View style={styles.privacyNote}>
                <ShieldAlert size={16} color={theme.colors.inkMuted} style={styles.noteIcon} />
                <Text style={styles.noteText}>
                  Recording a loan does not move any money — IOWho? never processes payments.
                </Text>
              </View>
            </Card>
          )}

          {error && <Text style={styles.error}>{error}</Text>}

          <View style={styles.buttonRow}>
            <Button variant="outline" title="Cancel" onPress={() => router.replace('/(tabs)')} />
            <Button
              variant="primary"
              title={type === 'lent' ? "Record that they owe you" : "Record that you owe them"}
              loading={loading}
              onPress={handleSubmit}
            />
          </View>
        </View>
      )}
    </ScrollView>
  )
}

function TypeButton({
  selected,
  onPress,
  title,
  subtitle,
  icon,
}: {
  selected: boolean
  onPress: () => void
  title: string
  subtitle: string
  icon: string
}) {
  return (
    <TouchableOpacity
      style={[
        styles.typeCard,
        selected && { borderColor: theme.colors.primary },
      ]}
      onPress={onPress}
      activeOpacity={0.9}>
      <View style={[styles.typeIcon, { backgroundColor: selected ? '#FFFFFF' : '#F0EBDD' }]}>
        {icon}
      </View>
      <View style={styles.typeText}>
        <Text style={[styles.typeTitle, { color: selected ? theme.colors.primaryDark : theme.colors.ink }]}>
          {title}
        </Text>
        <Text style={styles.typeSubtitle}>{subtitle}</Text>
      </View>
      {selected && <View style={styles.checkCircle} />}
    </TouchableOpacity>
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
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  back: {
    marginRight: 10,
    marginTop: -2,
  },
  backLabel: {
    fontSize: 22,
    color: theme.colors.inkSoft,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: theme.colors.ink,
  },
  stepContainer: { flex: 1 },
  typeRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  hint: {
    fontSize: 13,
    color: theme.colors.inkMuted,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  typeCard: {
    flex: 1,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#D8D2C4',
    backgroundColor: '#FFFFFF',
    ...theme.shadow.soft,
  },
  typeIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeText: { flex: 1 },
  typeTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  typeSubtitle: {
    fontSize: 12,
    color: theme.colors.inkSoft,
    marginTop: 2,
  },
  checkCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.colors.primary,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    position: 'absolute',
    right: 10,
    bottom: 10,
  },
  twoColumn: {
    flexDirection: 'row',
    gap: 10,
  },
  advancedToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  advancedLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.ink,
  },
  advancedCard: {
    marginTop: 12,
  },
  advancedHeading: {
    fontSize: 15,
    fontWeight: '800',
    color: theme.colors.ink,
    marginBottom: 12,
  },
  privacyNote: {
    flexDirection: 'row',
    marginTop: 12,
  },
  noteIcon: {
    marginTop: 2,
    marginRight: 8,
  },
  noteText: {
    fontSize: 12,
    color: theme.colors.inkMuted,
    lineHeight: 18,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  error: {
    color: theme.colors.red,
    fontSize: 13,
    marginBottom: 10,
    padding: 10,
    backgroundColor: theme.colors.redSoft,
    borderRadius: 10,
  },
})
