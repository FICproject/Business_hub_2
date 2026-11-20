import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, TouchableOpacity, Image } from 'react-native';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.brandTitle}>Business <Text style={styles.brandTeal}>Hub</Text></Text>
          <Text style={styles.subtitle}>Marketplace • Free Education • Careers</Text>
        </View>

        {/* Hero Card */}
        <View style={styles.heroCard}>
          <Text style={styles.badge}>100% Free Education & Verified Marketplace</Text>
          <Text style={styles.heroHeading}>Everything Your Business and Career Needs in One Place.</Text>
          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Explore Marketplace</Text>
          </TouchableOpacity>
        </View>

        {/* Featured Products */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured Products</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hScroll}>
            <View style={styles.productCard}>
              <View style={styles.imagePlaceholder} />
              <Text style={styles.productTitle}>Ergonomic Mechanical Keyboard</Text>
              <Text style={styles.productPrice}>$119.99</Text>
              <TouchableOpacity style={styles.cardButton}>
                <Text style={styles.cardButtonText}>Add to Cart</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.productCard}>
              <View style={styles.imagePlaceholder} />
              <Text style={styles.productTitle}>4K Ultra-Wide Monitor 34"</Text>
              <Text style={styles.productPrice}>$579.00</Text>
              <TouchableOpacity style={styles.cardButton}>
                <Text style={styles.cardButtonText}>Add to Cart</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>

        {/* Free Live Classes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Free Live Classes</Text>
          <View style={styles.classCard}>
            <Text style={styles.classBadge}>Interactive WebRTC</Text>
            <Text style={styles.classTitle}>Live Workshop: Building High-Throughput Microservices</Text>
            <Text style={styles.classSubtitle}>Prof. David Vance • Nov 25 at 18:00 EST</Text>
            <TouchableOpacity style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Join Live Session Free</Text>
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
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 20,
    gap: 20,
  },
  header: {
    marginBottom: 5,
  },
  brandTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#0F172A',
  },
  brandTeal: {
    color: '#0D9488',
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '500',
  },
  heroCard: {
    backgroundColor: '#0F172A',
    padding: 20,
    borderRadius: 24,
    gap: 12,
  },
  badge: {
    fontSize: 10,
    color: '#2DD4BF',
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  heroHeading: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 28,
  },
  primaryButton: {
    backgroundColor: '#0D9488',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 13,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  hScroll: {
    flexDirection: 'row',
  },
  productCard: {
    width: 200,
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginRight: 12,
    gap: 8,
  },
  imagePlaceholder: {
    width: '100%',
    height: 120,
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
  },
  productTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  cardButton: {
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#CCFBF1',
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  cardButtonText: {
    color: '#0D9488',
    fontSize: 12,
    fontWeight: '700',
  },
  classCard: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
  },
  classBadge: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0D9488',
    textTransform: 'uppercase',
  },
  classTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  classSubtitle: {
    fontSize: 12,
    color: '#64748B',
  },
});
