import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { useThemeStore } from '../../stores/theme.store';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  SupportIcon,
  TicketIcon,
  SearchArrowIcon,
} from '../../components/common/NomadixIcons';
import { REDESIGN_THEME } from '../../theme/designTokens';

export default function HelpSupportModal({ visible, onClose, onOpenTicketSupport }) {
  const { mode } = useThemeStore();
  const isDark = mode === 'dark';

  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);

  if (!visible) return null;

  const bg = isDark ? '#121316' : '#F8FAFC';
  const cardBg = isDark ? '#1C1D21' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : (REDESIGN_THEME.dark || '#0E1B2C');
  const textMuted = isDark ? '#94A3B8' : (REDESIGN_THEME.textMuted || '#5B6776');
  const borderColor = isDark ? '#2A2D35' : (REDESIGN_THEME.border || '#E3E6E0');
  const inputBg = isDark ? '#121316' : '#FAFAFA';
  const primaryTeal = '#0B7A75';

  const faqs = [
    {
      id: 'faq-1',
      question: 'How do I change or refund my flight ticket?',
      answer: 'Go to "My Tickets" or tap "Ticket Support & Refunds" directly in Nomadix. Our platform securely connects with Duffel API and airline partners (Vietnam Airlines, VietJet) to check fare rules and calculate cancellation or change quotes in real time.',
    },
    {
      id: 'faq-2',
      question: 'Can I cancel my hotel reservation?',
      answer: 'Cancellation terms depend on the hotel and room package chosen. If your stay includes "Free Cancellation", you can cancel directly in "My Bookings" up to 24 hours prior to check-in for a full 100% refund.',
    },
    {
      id: 'faq-3',
      question: 'How does the Squad expense splitting algorithm work?',
      answer: 'Nomadix uses an O(N log N) Greedy Minimum Cash-Flow Reduction algorithm to condense dozens of tangled debts into the absolute minimum number of direct payments (at most N-1 transactions), maintaining exact net balance accuracy.',
    },
    {
      id: 'faq-4',
      question: 'Is my payment information secure?',
      answer: 'All card transactions are tokenized with end-to-end PCI-DSS Level 1 compliant encryption. Nomadix never stores your CVV/CVC code on our servers, ensuring bank-grade financial security.',
    },
  ];

  const filteredFaqs = searchQuery.trim()
    ? faqs.filter(
        (f) =>
          f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqs;

  const handleChannelPress = (channelName, detail) => {
    Alert.alert(channelName, detail);
  };

  return (
    <View testID="subscreen-help" style={[styles.container, { backgroundColor: bg }]}>
      <View testID="help-support-modal" style={{ position: 'absolute', width: 0, height: 0, opacity: 0 }} />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          testID="btn-close-help-support"
          onPress={onClose}
          style={[styles.backBtn, { backgroundColor: isDark ? '#1C1D21' : '#FFFFFF', borderColor }]}
          activeOpacity={0.7}
        >
          <ChevronLeftIcon size={20} color={textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: textColor }]}>Help & Support</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={[styles.searchBox, { backgroundColor: inputBg, borderColor }]}>
          <SearchArrowIcon size={18} color={textMuted} />
          <TextInput
            testID="input-help-search"
            style={[styles.searchInput, { color: textColor }]}
            placeholder="Search help topics or questions..."
            placeholderTextColor={textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* 24/7 Direct Channels */}
        <Text style={[styles.sectionTitle, { color: textMuted }]}>DIRECT SUPPORT CHANNELS</Text>
        <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
          <TouchableOpacity
            testID="btn-support-chat"
            style={styles.channelRow}
            onPress={() => handleChannelPress('24/7 Live Chat', 'Connecting to Nomadix Support Specialist (Reply under 2 mins)...')}
            activeOpacity={0.7}
          >
            <View style={[styles.channelIconBadge, { backgroundColor: '#E3F2F0' }]}>
              <SupportIcon size={20} color="#0B7A75" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.channelTitle, { color: textColor }]}>24/7 Live Chat</Text>
              <Text style={[styles.channelSub, { color: textMuted }]}>Instant assistance in under 2 minutes</Text>
            </View>
            <ChevronRightIcon size={18} color={textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            testID="btn-support-hotline"
            style={styles.channelRow}
            onPress={() => handleChannelPress('Hotline Support', 'Calling 24/7 Helpline: 1900 6868')}
            activeOpacity={0.7}
          >
            <View style={[styles.channelIconBadge, { backgroundColor: '#FDECE7' }]}>
              <Text style={{ fontSize: 16 }}>📞</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.channelTitle, { color: textColor }]}>Hotline Support</Text>
              <Text style={[styles.channelSub, { color: primaryTeal, fontWeight: '800' }]}>1900 6868</Text>
            </View>
            <ChevronRightIcon size={18} color={textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            testID="btn-support-email"
            style={styles.channelRow}
            onPress={() => handleChannelPress('Email Support', 'Send email to support@nomadix.app (Response in 2-4 hrs)')}
            activeOpacity={0.7}
          >
            <View style={[styles.channelIconBadge, { backgroundColor: '#E8EAF8' }]}>
              <Text style={{ fontSize: 16 }}>✉️</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.channelTitle, { color: textColor }]}>Email Support</Text>
              <Text style={[styles.channelSub, { color: textMuted }]}>support@nomadix.app</Text>
            </View>
            <ChevronRightIcon size={18} color={textMuted} />
          </TouchableOpacity>
        </View>

        {/* Dedicated Ticket & Refunds Card */}
        <TouchableOpacity
          testID="btn-support-ticket-link"
          style={[styles.ticketSupportCard, { backgroundColor: isDark ? '#1A2938' : '#EAF4F4', borderColor: primaryTeal }]}
          onPress={() => {
            if (onOpenTicketSupport) {
              onOpenTicketSupport();
            } else {
              Alert.alert('Ticket Support', 'Opening ticket change and refund center');
            }
          }}
          activeOpacity={0.8}
        >
          <View style={[styles.channelIconBadge, { backgroundColor: '#FFFFFF' }]}>
            <TicketIcon size={20} color="#0B7A75" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.ticketSupportTitle, { color: textColor }]}>Ticket Support & Refunds Center</Text>
            <Text style={[styles.ticketSupportSub, { color: textMuted }]}>Request itinerary changes, refunds or emergency help</Text>
          </View>
          <ChevronRightIcon size={18} color={primaryTeal} />
        </TouchableOpacity>

        {/* FAQs Section */}
        <Text style={[styles.sectionTitle, { color: textMuted }]}>FREQUENTLY ASKED QUESTIONS (FAQ)</Text>
        <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
          {filteredFaqs.map((faq) => {
            const isExpanded = expandedFaq === faq.id;
            return (
              <View
                key={faq.id}
                style={styles.faqItem}
              >
                <TouchableOpacity
                  testID={`faq-toggle-${faq.id}`}
                  style={styles.faqHeader}
                  onPress={() => setExpandedFaq(isExpanded ? null : faq.id)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.faqQuestion, { color: textColor, flex: 1, paddingRight: 8 }]}>
                    {faq.question}
                  </Text>
                  <Text style={{ color: primaryTeal, fontSize: 16, fontWeight: '800' }}>
                    {isExpanded ? '−' : '+'}
                  </Text>
                </TouchableOpacity>

                {isExpanded && (
                  <View style={styles.faqBody}>
                    <Text style={[styles.faqAnswer, { color: textMuted }]}>{faq.answer}</Text>
                  </View>
                )}
              </View>
            );
          })}
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
  searchBox: {
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    marginTop: 6,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginTop: 22,
    marginBottom: 8,
    paddingLeft: 4,
  },
  card: {
    borderRadius: 20,
    padding: 12,
    borderWidth: 1,
  },
  channelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  channelIconBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  channelTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  channelSub: {
    fontSize: 12,
    marginTop: 2,
  },
  ticketSupportCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 20,
    borderWidth: 1.5,
    marginTop: 16,
    gap: 12,
  },
  ticketSupportTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  ticketSupportSub: {
    fontSize: 11,
    marginTop: 2,
  },
  faqItem: {
    paddingVertical: 12,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  faqQuestion: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
  },
  faqBody: {
    marginTop: 8,
    paddingTop: 8,
  },
  faqAnswer: {
    fontSize: 13,
    lineHeight: 19,
  },
});
