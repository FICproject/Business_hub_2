import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.brandTitle}>Business Hub <Text style={styles.brandTeal}>Admin</Text></Text>
          <Text style={styles.subtitle}>Mobile Administrative Control Center</Text>
        </View>

        <View style={styles.kpiContainer}>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>Total Users</Text>
            <Text style={styles.kpiValue}>1,250</Text>
          </View>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>Pending Approvals</Text>
            <Text style={[styles.kpiValue, { color: '#F59E0B' }]}>3</Text>
          </View>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>Active Listings</Text>
            <Text style={styles.kpiValue}>180</Text>
          </View>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>Gross Volume</Text>
            <Text style={[styles.kpiValue, { color: '#10B981' }]}>$48.2k</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pending Business Approvals</Text>
          <View style={styles.actionCard}>
            <Text style={styles.itemTitle}>NextGen Robotics & AI Labs</Text>
            <Text style={styles.itemSubtitle}>Owner: Elena Rostova (Autonomous sensors)</Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.approveButton}>
                <Text style={styles.buttonText}>Approve</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.rejectButton}>
                <Text style={styles.rejectButtonText}>Reject</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Eligible Teacher Stipends</Text>
          <View style={styles.actionCard}>
            <Text style={styles.itemTitle}>Live Workshop: Building Microservices</Text>
            <Text style={styles.itemSubtitle}>Prof. David Vance • 88 Students Attended</Text>
            <TouchableOpacity style={styles.approveButton}>
              <Text style={styles.buttonText}>Approve Payout ($400)</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  content: {
    padding: 20,
    gap: 20,
  },
  header: {
    marginBottom: 10,
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  brandTeal: {
    color: '#14B8A6',
  },
  subtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 4,
  },
  kpiContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  kpiCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#1E293B',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  kpiLabel: {
    fontSize: 11,
    color: '#94A3B8',
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  kpiValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 4,
  },
  section: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  actionCard: {
    backgroundColor: '#1E293B',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 8,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  itemSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 6,
  },
  approveButton: {
    backgroundColor: '#14B8A6',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
  },
  buttonText: {
    color: '#0F172A',
    fontWeight: 'bold',
    fontSize: 12,
  },
  rejectButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#EF4444',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
  },
  rejectButtonText: {
    color: '#EF4444',
    fontWeight: 'bold',
    fontSize: 12,
  },
});
