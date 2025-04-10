import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card } from '@/components/Card';

export default function ReportsScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Reports & Analytics</Text>
      </View>

      <View style={styles.content}>
        <Card style={styles.reportCard}>
          <Text style={styles.reportTitle}>Portfolio Summary</Text>
          <View style={styles.reportStats}>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>Total Active Loans</Text>
              <Text style={styles.statValue}>24</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>Total Value</Text>
              <Text style={styles.statValue}>$145,230</Text>
            </View>
          </View>
        </Card>

        <Card style={styles.reportCard}>
          <Text style={styles.reportTitle}>Payment Status</Text>
          <View style={styles.reportStats}>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>On Time</Text>
              <Text style={styles.statValue}>85%</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>Late</Text>
              <Text style={styles.statValue}>15%</Text>
            </View>
          </View>
        </Card>

        <Card style={styles.reportCard}>
          <Text style={styles.reportTitle}>Monthly Collections</Text>
          <View style={styles.reportStats}>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>Expected</Text>
              <Text style={styles.statValue}>$12,450</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>Received</Text>
              <Text style={styles.statValue}>$10,850</Text>
            </View>
          </View>
        </Card>
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
  content: {
    padding: 20,
    gap: 20,
  },
  reportCard: {
    padding: 20,
  },
  reportTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 15,
  },
  reportStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stat: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
  },
});