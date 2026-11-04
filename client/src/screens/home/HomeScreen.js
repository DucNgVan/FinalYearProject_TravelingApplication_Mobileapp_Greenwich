import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ImageBackground,
} from 'react-native';
import { useThemeStore } from '../../stores/theme.store';
import { useAuthStore } from '../../stores/auth.store';
import CategoryBadge from '../../components/common/CategoryBadge';
import LucideIcon from '../../components/common/LucideIcon';

export default function HomeScreen({ onNavigateTab, onOpenProfile }) {
  const { colors: themeColors, mode } = useThemeStore();
  const { user } = useAuthStore();

  const [activeSegment, setActiveSegment] = useState('planned'); // 'planned' | 'archived' | 'completed'
  const [fromAmount, setFromAmount] = useState('100');
  const [fromCurrency, setFromCurrency] = useState('EUR');
  const [toCurrency, setToCurrency] = useState('USD');

  // Exchange rate logic
  const exchangeRate = fromCurrency === 'EUR' && toCurrency === 'USD' ? 1.1546 : 0.8661;
  const numericAmount = parseFloat(fromAmount) || 0;
  const convertedAmount = (numericAmount * exchangeRate).toFixed(2);

  const handleSwapCurrency = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const isDark = mode === 'dark';

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: isDark ? '#121316' : '#F5F6F8' }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. Header Bar: Brand Logo, Notification & Avatar */}
      <View style={styles.headerRow}>
        <View style={styles.brandContainer}>
          <View style={[styles.brandLogoIcon, { backgroundColor: isDark ? '#FFFFFF' : '#111827' }]}>
            <Text style={[styles.brandLogoGlyph, { color: isDark ? '#111827' : '#FFFFFF' }]}>N</Text>
          </View>
          <View>
            <Text style={[styles.brandTitle, { color: isDark ? '#FFFFFF' : '#111827' }]}>NOMADIX</Text>
            <Text style={[styles.brandSubtitle, { color: themeColors.textMuted }]}>Smart Squad Travel</Text>
          </View>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity
            testID="home-bell-btn"
            style={[styles.iconButton, { backgroundColor: isDark ? '#1C1D21' : '#FFFFFF', borderColor: isDark ? '#2A2D35' : '#E5E7EB' }]}
            activeOpacity={0.7}
          >
            <Text style={{ fontSize: 16 }}>🔔</Text>
          </TouchableOpacity>

          <TouchableOpacity
            testID="home-avatar-btn"
            style={styles.avatarButtonContainer}
            onPress={() => onOpenProfile && onOpenProfile()}
            activeOpacity={0.8}
          >
            <View style={[styles.avatarCircle, { backgroundColor: themeColors.pineGreen || '#2E7D5B' }]}>
              <Text style={styles.avatarText}>
                {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'DN'}
              </Text>
            </View>
            <Text style={[styles.avatarLabelText, { color: isDark ? '#FFFFFF' : '#111827' }]}>Profile</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 2. Hero Recent Trip Card (Berlin 2026 / Active Trip) */}
      <View testID="hero-trip-card" style={styles.heroCardContainer}>
        <ImageBackground
          source={{ uri: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?q=80&w=1000&auto=format&fit=crop' }}
          style={styles.heroCardBg}
          imageStyle={{ borderRadius: 24 }}
        >
          <View style={styles.heroOverlay}>
            {/* Top Action Pills on Hero Card */}
            <View style={styles.heroTopActions}>
              <View style={styles.recentBadge}>
                <Text style={styles.recentBadgeText}>RECENT</Text>
              </View>

              <View style={styles.heroActionPills}>
                <TouchableOpacity style={styles.glassPillBtn} activeOpacity={0.7}>
                  <Text style={styles.glassPillIcon}>✎</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.glassPillBtn} activeOpacity={0.7}>
                  <Text style={styles.glassPillIcon}>⎘</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.glassPillBtn} activeOpacity={0.7}>
                  <Text style={styles.glassPillIcon}>★</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.glassPillBtn} activeOpacity={0.7}>
                  <Text style={styles.glassPillIcon}>🗑</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Hero Trip Content */}
            <View style={styles.heroBottomContent}>
              <Text style={styles.heroTripTitle}>Berlin 2026</Text>
              <View style={styles.heroMetadataRow}>
                <View style={styles.heroMetaPill}>
                  <LucideIcon name="calendar" size={13} color="#FFFFFF" strokeWidth={2.2} />
                  <Text style={styles.heroMetaText}>19 days</Text>
                </View>
                <View style={styles.heroMetaPill}>
                  <Text style={styles.heroMetaText}>📍 13 destinations</Text>
                </View>
                <View style={styles.heroMetaPill}>
                  <LucideIcon name="users" size={13} color="#FFFFFF" strokeWidth={2.2} />
                  <Text style={styles.heroMetaText}>3 travelers</Text>
                </View>
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>

      {/* 3. Segmented Filter Pills: Planned, Archived, Completed */}
      <View style={[styles.segmentedContainer, { backgroundColor: isDark ? '#1C1D21' : '#EAECEF' }]}>
        <TouchableOpacity
          testID="segmented-pill-planned"
          style={[
            styles.segmentPill,
            activeSegment === 'planned' && [
              styles.segmentPillActive,
              { backgroundColor: isDark ? '#FFFFFF' : '#111827' },
            ],
          ]}
          onPress={() => setActiveSegment('planned')}
        >
          <Text
            style={[
              styles.segmentPillText,
              { color: activeSegment === 'planned' ? (isDark ? '#111827' : '#FFFFFF') : themeColors.textMuted },
            ]}
          >
            Planned
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          testID="segmented-pill-archived"
          style={[
            styles.segmentPill,
            activeSegment === 'archived' && [
              styles.segmentPillActive,
              { backgroundColor: isDark ? '#FFFFFF' : '#111827' },
            ],
          ]}
          onPress={() => setActiveSegment('archived')}
        >
          <Text
            style={[
              styles.segmentPillText,
              { color: activeSegment === 'archived' ? (isDark ? '#111827' : '#FFFFFF') : themeColors.textMuted },
            ]}
          >
            Archived
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          testID="segmented-pill-completed"
          style={[
            styles.segmentPill,
            activeSegment === 'completed' && [
              styles.segmentPillActive,
              { backgroundColor: isDark ? '#FFFFFF' : '#111827' },
            ],
          ]}
          onPress={() => setActiveSegment('completed')}
        >
          <Text
            style={[
              styles.segmentPillText,
              { color: activeSegment === 'completed' ? (isDark ? '#111827' : '#FFFFFF') : themeColors.textMuted },
            ]}
          >
            Completed
          </Text>
        </TouchableOpacity>
      </View>

      {/* 4. Currency Converter Widget */}
      <View
        testID="currency-converter-widget"
        style={[
          styles.cardContainer,
          {
            backgroundColor: isDark ? '#1C1D21' : '#FFFFFF',
            borderColor: isDark ? '#2A2D35' : '#E5E7EB',
          },
        ]}
      >
        <View style={styles.cardHeaderRow}>
          <Text style={[styles.cardSectionLabel, { color: themeColors.textMuted }]}>CURRENCY</Text>
          <Text style={{ fontSize: 14 }}>🔄</Text>
        </View>

        <View style={styles.converterInputsRow}>
          {/* FROM Box */}
          <View style={[styles.currencyBox, { backgroundColor: isDark ? '#121316' : '#F9FAFB', borderColor: isDark ? '#2A2D35' : '#E5E7EB' }]}>
            <Text style={styles.currencyBoxLabel}>FROM</Text>
            <TextInput
              testID="currency-from-input"
              value={fromAmount}
              onChangeText={setFromAmount}
              keyboardType="numeric"
              style={[styles.currencyAmountInput, { color: isDark ? '#FFFFFF' : '#111827' }]}
            />
            <View style={styles.currencyBadge}>
              <Text style={[styles.currencyBadgeText, { color: isDark ? '#FFFFFF' : '#111827' }]}>{fromCurrency}</Text>
            </View>
          </View>

          {/* Swap Button */}
          <TouchableOpacity
            testID="currency-swap-btn"
            style={[styles.swapButton, { backgroundColor: isDark ? '#2A2D35' : '#111827' }]}
            onPress={handleSwapCurrency}
            activeOpacity={0.8}
          >
            <Text style={styles.swapButtonGlyph}>⇄</Text>
          </TouchableOpacity>

          {/* TO Box */}
          <View style={[styles.currencyBox, { backgroundColor: isDark ? '#121316' : '#F9FAFB', borderColor: isDark ? '#2A2D35' : '#E5E7EB' }]}>
            <Text style={styles.currencyBoxLabel}>TO</Text>
            <Text style={[styles.currencyAmountInput, { color: isDark ? '#FFFFFF' : '#111827' }]}>
              {convertedAmount}
            </Text>
            <View style={styles.currencyBadge}>
              <Text style={[styles.currencyBadgeText, { color: isDark ? '#FFFFFF' : '#111827' }]}>{toCurrency}</Text>
            </View>
          </View>
        </View>

        <Text style={[styles.exchangeRateFormula, { color: themeColors.textMuted }]}>
          1 {fromCurrency} = {exchangeRate} {toCurrency}
        </Text>
      </View>

      {/* 5. Collections Card (Toyko 2025 / Saved Trips) */}
      <View
        testID="collections-card"
        style={[
          styles.cardContainer,
          {
            backgroundColor: isDark ? '#1C1D21' : '#FFFFFF',
            borderColor: isDark ? '#2A2D35' : '#E5E7EB',
          },
        ]}
      >
        <View style={styles.cardHeaderRow}>
          <Text style={[styles.cardSectionLabel, { color: themeColors.textMuted }]}>COLLECTIONS</Text>
          <Text style={{ fontSize: 16 }}>→</Text>
        </View>

        <TouchableOpacity
          style={[styles.collectionItemCard, { backgroundColor: themeColors.pineGreen || '#2E7D5B' }]}
          activeOpacity={0.85}
          onPress={() => onNavigateTab && onNavigateTab('plan')}
        >
          <View style={styles.collectionTextGroup}>
            <Text style={styles.collectionTitle}>Tokyo 2025</Text>
            <Text style={styles.collectionSubtitle}>Explored Itinerary</Text>
          </View>
          <View style={styles.collectionBadge}>
            <Text style={styles.collectionBadgeText}>👁 8</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* 6. Quick Action Shortcuts (Flights, Hotels, Plan, Group) */}
      <View
        testID="quick-shortcuts"
        style={[
          styles.cardContainer,
          {
            backgroundColor: isDark ? '#1C1D21' : '#FFFFFF',
            borderColor: isDark ? '#2A2D35' : '#E5E7EB',
          },
        ]}
      >
        <Text style={[styles.cardSectionLabel, { color: themeColors.textMuted, marginBottom: 12 }]}>
          QUICK SHORTCUTS
        </Text>

        <View style={styles.shortcutsGrid}>
          <TouchableOpacity
            testID="shortcut-flights"
            style={[styles.shortcutBtn, { backgroundColor: isDark ? '#121316' : '#F8FAFC' }]}
            onPress={() => onNavigateTab && onNavigateTab('flights')}
            activeOpacity={0.7}
          >
            <CategoryBadge category="flights" size={40} />
            <Text style={[styles.shortcutLabel, { color: isDark ? '#FFFFFF' : '#111827' }]}>Flights</Text>
          </TouchableOpacity>

          <TouchableOpacity
            testID="shortcut-hotels"
            style={[styles.shortcutBtn, { backgroundColor: isDark ? '#121316' : '#F8FAFC' }]}
            onPress={() => onNavigateTab && onNavigateTab('hotels')}
            activeOpacity={0.7}
          >
            <CategoryBadge category="hotels" size={40} />
            <Text style={[styles.shortcutLabel, { color: isDark ? '#FFFFFF' : '#111827' }]}>Hotels</Text>
          </TouchableOpacity>

          <TouchableOpacity
            testID="shortcut-plan"
            style={[styles.shortcutBtn, { backgroundColor: isDark ? '#121316' : '#F8FAFC' }]}
            onPress={() => onNavigateTab && onNavigateTab('plan')}
            activeOpacity={0.7}
          >
            <CategoryBadge category="plan" size={40} />
            <Text style={[styles.shortcutLabel, { color: isDark ? '#FFFFFF' : '#111827' }]}>Plan</Text>
          </TouchableOpacity>

          <TouchableOpacity
            testID="shortcut-group"
            style={[styles.shortcutBtn, { backgroundColor: isDark ? '#121316' : '#F8FAFC' }]}
            onPress={() => onNavigateTab && onNavigateTab('group')}
            activeOpacity={0.7}
          >
            <CategoryBadge category="group" size={40} />
            <Text style={[styles.shortcutLabel, { color: isDark ? '#FFFFFF' : '#111827' }]}>Squad & Split</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandLogoIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  brandLogoGlyph: {
    fontSize: 20,
    fontWeight: '900',
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  brandSubtitle: {
    fontSize: 11,
    fontWeight: '500',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 18,
  },
  avatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarLabelText: {
    fontSize: 11,
    fontWeight: '700',
  },
  avatarButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  heroCardContainer: {
    marginBottom: 16,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
  heroCardBg: {
    width: '100%',
    height: 220,
    justifyContent: 'flex-end',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 24,
    padding: 16,
    justifyContent: 'space-between',
  },
  heroTopActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recentBadge: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  recentBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: 0.5,
  },
  heroActionPills: {
    flexDirection: 'row',
    gap: 6,
  },
  glassPillBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  glassPillIcon: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  heroBottomContent: {
    gap: 6,
  },
  heroTripTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  heroMetadataRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  heroMetaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  heroMetaText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  segmentedContainer: {
    flexDirection: 'row',
    borderRadius: 24,
    padding: 4,
    marginBottom: 16,
  },
  segmentPill: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  segmentPillActive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  segmentPillText: {
    fontSize: 13,
    fontWeight: '700',
  },
  cardContainer: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardSectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  converterInputsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 8,
  },
  currencyBox: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    padding: 10,
    position: 'relative',
  },
  currencyBoxLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#9CA3AF',
    marginBottom: 4,
  },
  currencyAmountInput: {
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 4,
  },
  currencyBadge: {
    position: 'absolute',
    right: 8,
    top: 8,
    backgroundColor: 'rgba(156,163,175,0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  currencyBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  swapButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  swapButtonGlyph: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  exchangeRateFormula: {
    fontSize: 11,
    fontWeight: '600',
  },
  collectionItemCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
  },
  collectionTextGroup: {
    gap: 2,
  },
  collectionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  collectionSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 11,
    fontWeight: '500',
  },
  collectionBadge: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  collectionBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  shortcutsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  shortcutBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderRadius: 14,
    gap: 6,
  },
  shortcutIcon: {
    fontSize: 22,
  },
  shortcutLabel: {
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
  },
});
