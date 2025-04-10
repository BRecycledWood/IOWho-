import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card } from '@/components/Card';
import { LoanSummary } from '@/components/LoanSummary';

export default function Dashboard() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Loan Portfolio Overview</Text>
      </View>

      <View style={styles.statsContainer}>
        <Card style={styles.statCard}>
          <Text style={styles.statLabel}>Active Loans</Text>
          <Text style={styles.statValue}>24</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statLabel}>Total Outstanding</Text>
          <Text style={styles.statValue}>$145,230</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statLabel}>Due This Week</Text>
          <Text style={styles.statValue}>$3,450</Text>
        </Card>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Loans</Text>
        <LoanSummary
          borrower="John Smith"
          amount={5000}
          dueDate="2024-02-15"
          status="current"
        />
        <LoanSummary
          borrower="Sarah Johnson"
          amount={7500}
          dueDate="2024-02-18"
          status="late"
        />
        <LoanSummary
          borrower="Mike Wilson"
          amount={3000}
          dueDate="2024-02-20"
          status="current"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 10,
  },
  statCard: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fff',
  },
  statLabel: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 15,
  },
});