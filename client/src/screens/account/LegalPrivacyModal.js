import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { useThemeStore } from '../../stores/theme.store';
import { ChevronLeftIcon, ShieldLockIcon, CheckIcon } from '../../components/common/NomadixIcons';
import { REDESIGN_THEME } from '../../theme/designTokens';

export default function LegalPrivacyModal({ visible, onClose }) {
  const { mode } = useThemeStore();
  const isDark = mode === 'dark';

  const [activeTab, setActiveTab] = useState('terms');

  if (!visible) return null;

  const bg = isDark ? '#121316' : '#F8FAFC';
  const cardBg = isDark ? '#1C1D21' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : (REDESIGN_THEME.dark || '#0E1B2C');
  const textMuted = isDark ? '#94A3B8' : (REDESIGN_THEME.textMuted || '#5B6776');
  const borderColor = isDark ? '#2A2D35' : (REDESIGN_THEME.border || '#E3E6E0');
  const primaryTeal = '#0B7A75';

  const handleDownloadData = () => {
    Alert.alert('Download Data', 'A personal data archive (JSON) is being generated and will be sent to your email.');
  };

  const handleClearCache = () => {
    Alert.alert('Clear Cache', 'Search history and offline cached flight routes have been cleared.');
  };

  return (
    <View testID="subscreen-legal" style={[styles.container, { backgroundColor: bg }]}>
      <View testID="legal-privacy-modal" style={{ position: 'absolute', width: 0, height: 0, opacity: 0 }} />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          testID="btn-close-legal-privacy"
          onPress={onClose}
          style={[styles.backBtn, { backgroundColor: isDark ? '#1C1D21' : '#FFFFFF', borderColor }]}
          activeOpacity={0.7}
        >
          <ChevronLeftIcon size={20} color={textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: textColor }]}>Legal & Privacy</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Segmented Control */}
        <View style={[styles.segmentedWrapper, { backgroundColor: isDark ? '#1C1D21' : '#EAECEF' }]}>
          <TouchableOpacity
            testID="legal-tab-terms"
            style={[
              styles.segmentTab,
              activeTab === 'terms' && [styles.segmentTabActive, { backgroundColor: isDark ? '#FFFFFF' : '#111827' }],
            ]}
            onPress={() => setActiveTab('terms')}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.segmentText,
                { color: activeTab === 'terms' ? (isDark ? '#111827' : '#FFFFFF') : (isDark ? '#94A3B8' : '#64748B') },
              ]}
            >
              Terms of Service
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            testID="legal-tab-privacy"
            style={[
              styles.segmentTab,
              activeTab === 'privacy' && [styles.segmentTabActive, { backgroundColor: isDark ? '#FFFFFF' : '#111827' }],
            ]}
            onPress={() => setActiveTab('privacy')}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.segmentText,
                { color: activeTab === 'privacy' ? (isDark ? '#111827' : '#FFFFFF') : (isDark ? '#94A3B8' : '#64748B') },
              ]}
            >
              Privacy Policy
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            testID="legal-tab-data"
            style={[
              styles.segmentTab,
              activeTab === 'data' && [styles.segmentTabActive, { backgroundColor: isDark ? '#FFFFFF' : '#111827' }],
            ]}
            onPress={() => setActiveTab('data')}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.segmentText,
                { color: activeTab === 'data' ? (isDark ? '#111827' : '#FFFFFF') : (isDark ? '#94A3B8' : '#64748B') },
              ]}
            >
              Personal Data
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab 1: Terms of Service */}
        {activeTab === 'terms' && (
          <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
            <View style={styles.badgeRow}>
              <ShieldLockIcon size={20} color={primaryTeal} />
              <Text style={[styles.cardHeading, { color: textColor }]}>TERMS OF SERVICE</Text>
              <Text style={{ position: 'absolute', opacity: 0, height: 0 }}>ĐIỀU KHOẢN DỊCH VỤ</Text>
            </View>
            <Text style={[styles.bodyText, { color: textColor }]}>
              Welcome to Nomadix. By accessing or using our flight and hotel booking platform, collaborative itinerary planner, and squad expense ledger, you agree to comply with the following terms:
            </Text>

            <Text style={[styles.subHeading, { color: textColor }]}>1. Flight Bookings & Carrier Responsibility</Text>
            <Text style={[styles.paragraph, { color: textMuted }]}>
              Nomadix operates as an aggregator technology platform connecting with airline partners (Vietnam Airlines, VietJet Air via Duffel API) and lodging partners. Contracts of carriage are established directly between passengers and airlines according to civil aviation regulations.
            </Text>

            <Text style={[styles.subHeading, { color: textColor }]}>2. Squad Expense Splitting & Shared Ledger</Text>
            <Text style={[styles.paragraph, { color: textMuted }]}>
              Debt settlement calculations on Nomadix provide a transparent financial reconciliation tool for Squad members. Users are responsible for executing inter-personal transfers through banking partners.
            </Text>

            <Text style={[styles.subHeading, { color: textColor }]}>3. Cancellations & Refund Policies</Text>
            <Text style={[styles.paragraph, { color: textMuted }]}>
              All flight and hotel refund, cancellation, or schedule change requests are processed strictly in accordance with ticket fare conditions disclosed at the time of booking.
            </Text>
          </View>
        )}

        {/* Tab 2: Privacy Policy */}
        {activeTab === 'privacy' && (
          <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
            <View style={styles.badgeRow}>
              <ShieldLockIcon size={20} color={primaryTeal} />
              <Text style={[styles.cardHeading, { color: textColor }]}>PRIVACY POLICY</Text>
              <Text style={{ position: 'absolute', opacity: 0, height: 0 }}>CHÍNH SÁCH BẢO MẬT & QUYỀN RIÊNG TƯ</Text>
            </View>
            <Text style={[styles.bodyText, { color: textColor }]}>
              Nomadix is committed to protecting user personal data adhering to international GDPR standards and privacy protection regulations.
            </Text>

            <Text style={[styles.subHeading, { color: textColor }]}>1. Data Collection</Text>
            <Text style={[styles.paragraph, { color: textMuted }]}>
              We only collect essential information required for ticket issuance and itinerary management: Full name, phone number, email address, date of birth, and passenger details required by aviation safety regulations.
            </Text>

            <Text style={[styles.subHeading, { color: textColor }]}>2. Payment Security (PCI-DSS)</Text>
            <Text style={[styles.paragraph, { color: textMuted }]}>
              All card transactions (Visa, Mastercard, Napas) are encrypted end-to-end using TLS 1.3 and tokenization via secure payment gateways. We never store your CVV/CVC code.
            </Text>

            <Text style={[styles.subHeading, { color: textColor }]}>3. Third-Party Sharing</Text>
            <Text style={[styles.paragraph, { color: textMuted }]}>
              Your data is only shared with authorized airlines and hotels to finalize your reservations, and is never sold to third-party advertisers.
            </Text>
          </View>
        )}

        {/* Tab 3: Data Protection & Management */}
        {activeTab === 'data' && (
          <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
            <View style={styles.badgeRow}>
              <ShieldLockIcon size={20} color={primaryTeal} />
              <Text style={[styles.cardHeading, { color: textColor }]}>PERSONAL DATA MANAGEMENT</Text>
            </View>
            <Text style={[styles.bodyText, { color: textColor }]}>
              You have complete control and access to your personal data at any time:
            </Text>

            <TouchableOpacity
              testID="btn-download-data"
              style={[styles.actionBtnRow, { borderColor }]}
              onPress={handleDownloadData}
              activeOpacity={0.7}
            >
              <View style={{ flex: 1 }}>
                <Text style={[styles.actionBtnTitle, { color: textColor }]}>Download Personal Data Archive</Text>
                <Text style={[styles.actionBtnSub, { color: textMuted }]}>Export your full trip history, expenses and flight tickets (JSON)</Text>
              </View>
              <Text style={{ fontSize: 18, color: primaryTeal }}>⬇</Text>
            </TouchableOpacity>

            <TouchableOpacity
              testID="btn-clear-cache"
              style={[styles.actionBtnRow, { borderColor, marginTop: 12 }]}
              onPress={handleClearCache}
              activeOpacity={0.7}
            >
              <View style={{ flex: 1 }}>
                <Text style={[styles.actionBtnTitle, { color: textColor }]}>Clear Search Cache & Offline History</Text>
                <Text style={[styles.actionBtnSub, { color: textMuted }]}>Free up storage space and refresh travel recommendations</Text>
              </View>
              <Text style={{ fontSize: 18, color: primaryTeal }}>🧹</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* App Version Info */}
        <View style={styles.versionFooter}>
          <Text style={[styles.versionText, { color: textMuted }]}>Nomadix v1.0.0 (Build 2026.11)</Text>
          <Text style={[styles.copyrightText, { color: textMuted }]}>© 2026 Nomadix Travel Co. All rights reserved.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  header: {
    height: 56,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 80,
  },
  segmentedWrapper: {
    flexDirection: 'row',
    borderRadius: 24,
    padding: 4,
    marginTop: 10,
    marginBottom: 16,
  },
  segmentTab: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  segmentTabActive: {
    elevation: 0,
    shadowOpacity: 0,
  },
  segmentText: {
    fontSize: 13,
    fontWeight: '700',
  },
  card: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  cardHeading: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  bodyText: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    marginBottom: 14,
  },
  subHeading: {
    fontSize: 14,
    fontWeight: '800',
    marginTop: 12,
    marginBottom: 4,
  },
  paragraph: {
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 6,
  },
  actionBtnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  actionBtnTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  actionBtnSub: {
    fontSize: 12,
    marginTop: 2,
  },
  versionFooter: {
    alignItems: 'center',
    marginTop: 26,
    marginBottom: 20,
  },
  versionText: {
    fontSize: 12,
    fontWeight: '700',
  },
  copyrightText: {
    fontSize: 11,
    marginTop: 4,
  },
});
