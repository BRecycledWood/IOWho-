import { View, Text, StyleSheet } from 'react-native';
import { format } from 'date-fns';

interface LoanSummaryProps {
  borrower: string;
  amount: number;
  dueDate: string;
  status: 'current' | 'late' | 'paid';
}

export function LoanSummary({ borrower, amount, dueDate, status }: LoanSummaryProps) {
  const statusColors = {
    current: '#10b981',
    late: '#ef4444',
    paid: '#6b7280',
  };

  const formattedDate = format(new Date(dueDate), 'MMM d, yyyy');
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.borrower}>{borrower}</Text>
        <Text style={styles.amount}>{formattedAmount}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.dueDate}>Due: {formattedDate}</Text>
        <Text style={[styles.status, { color: statusColors[status] }]}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  borrower: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  dueDate: {
    fontSize: 14,
    color: '#64748b',
  },
  status: {
    fontSize: 14,
    fontWeight: '500',
  },
});