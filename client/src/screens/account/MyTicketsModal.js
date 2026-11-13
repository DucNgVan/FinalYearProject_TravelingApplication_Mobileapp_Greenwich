import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { useAuthStore } from '../../stores/auth.store';
import { useBookingStore } from '../../stores/booking.store';
import { useThemeStore } from '../../stores/theme.store';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  TicketIcon,
  DownloadIcon,
  ShareIcon,
  SupportIcon,
  FlightIcon,
} from '../../components/common/NomadixIcons';
import { REDESIGN_THEME } from '../../theme/designTokens';
import BarcodeStripes from '../../components/common/BarcodeStripes';
import BoardingPassModal from '../../components/booking/BoardingPassModal';
import TicketSupportModal from '../../components/booking/TicketSupportModal';

export default function MyTicketsModal({ visible, onClose }) {
  const { user } = useAuthStore();
  const { mode } = useThemeStore();
  const isDark = mode === 'dark';
  const bookedTickets = useBookingStore((state) => state.bookedTickets) || [];

  const [activeTab, setActiveTab] = useState('upcoming');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isBoardingPassOpen, setIsBoardingPassOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);

  if (!visible) return null;

  const defaultTicket = {
    id: 'tkt-seed-001',
    pnr: 'VN-8X2K9P',
    ticketNumber: '738-2491048291',
    airlineCode: 'VN',
    airlineName: 'Vietnam Airlines',
    flightNumber: 'VN-0240',
    origin: 'SGN',
    originCity: 'Ho Chi Minh',
    destination: 'HAN',
    destinationCity: 'Ha Noi',
    date: 'Sat, 14 Nov',
    departs: '07:00',
    duration: '2h 05m',
    aircraft: 'Airbus A350-900',
    totalPrice: 2073060,
    status: 'CONFIRMED',
    passenger: { fullName: user?.fullName || 'Guest Traveler', email: user?.email || 'guest@nomadix.app' },
  };

  const currentTicket = bookedTickets.length > 0 ? bookedTickets[0] : defaultTicket;

  const bg = isDark ? '#121316' : '#F8FAFC';
  const cardBg = isDark ? '#1C1D21' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : (REDESIGN_THEME.dark || '#0E1B2C');
  const textMuted = isDark ? '#94A3B8' : (REDESIGN_THEME.textMuted || '#5B6776');
  const borderColor = isDark ? '#2A2D35' : (REDESIGN_THEME.border || '#E3E6E0');

  const handleDownload = () => {
    Alert.alert('Download Ticket', 'Electronic flight ticket PDF saved to device.');
  };

  const handleShare = () => {
    Alert.alert('Share Ticket', 'Booking reference VN-8X2K9P ready to share with squad.');
  };

  return (
    <View testID="subscreen-tickets" style={[styles.container, { backgroundColor: bg }]}>
      {/* Header with compact top positioning */}
      <View style={styles.header}>
        <TouchableOpacity
          testID="btn-close-my-tickets"
          onPress={onClose}
          style={[styles.backBtn, { backgroundColor: isDark ? '#1C1D21' : '#FFFFFF', borderColor }]}
          activeOpacity={0.7}
        >
          <ChevronLeftIcon size={20} color={textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: textColor }]}>My Tickets</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Segmented Control */}
        <View style={[styles.segmentedWrapper, { backgroundColor: isDark ? '#1C1D21' : '#EAECEF' }]}>
          <TouchableOpacity
            testID="ticket-segment-upcoming"
            style={[
              styles.segmentTab,
              activeTab === 'upcoming' && [styles.segmentTabActive, { backgroundColor: isDark ? '#FFFFFF' : '#111827' }],
            ]}
            onPress={() => setActiveTab('upcoming')}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.segmentText,
                { color: activeTab === 'upcoming' ? (isDark ? '#111827' : '#FFFFFF') : (isDark ? '#94A3B8' : '#64748B') },
                activeTab === 'upcoming' && styles.segmentTextActive,
              ]}
            >
              Upcoming
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            testID="ticket-segment-past"
            style={[
              styles.segmentTab,
              activeTab === 'past' && [styles.segmentTabActive, { backgroundColor: isDark ? '#FFFFFF' : '#111827' }],
            ]}
            onPress={() => setActiveTab('past')}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.segmentText,
                { color: activeTab === 'past' ? (isDark ? '#111827' : '#FFFFFF') : (isDark ? '#94A3B8' : '#64748B') },
                activeTab === 'past' && styles.segmentTextActive,
              ]}
            >
              Past
            </Text>
          </TouchableOpacity>
        </View>

        {/* Clean Physical Flight Ticket Card (No faux stacked decorative card) */}
        <View testID="ticket-stack-wrapper" style={styles.ticketStackWrapper}>
          {/* Front Card: Hero Navy-Teal physical flight ticket */}
          <View testID="ticket-stack-front-card" style={styles.ticketStackFrontCard}>
            <View style={styles.rowBetween}>
              <View style={styles.airlineBadgeRow}>
                <View style={styles.carrierBadge}>
                  <Text style={styles.carrierBadgeText}>{currentTicket.airlineCode || 'VN'}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.carrierNameText}>
                    {currentTicket.airlineName || 'Vietnam Airlines'} ·{' '}
                  </Text>
                  <Text style={styles.carrierNameText}>
                    {currentTicket.flightNumber || 'VN-0240'}
                  </Text>
                </View>
              </View>
              <View style={styles.confirmedPill}>
                <Text style={styles.confirmedPillText}>Confirmed</Text>
              </View>
            </View>

            <View style={[styles.rowBetween, { marginVertical: 14 }]}>
              <View>
                <Text style={styles.airportCode}>{currentTicket.origin || 'SGN'}</Text>
                <Text style={styles.cityName}>{currentTicket.originCity || 'Ho Chi Minh'}</Text>
              </View>

              <View style={styles.flightCenter}>
                <FlightIcon size={24} color="#FFFFFF" />
                <Text style={styles.durationText}>{currentTicket.duration || '2h 05m'}</Text>
              </View>

              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.airportCode}>{currentTicket.destination || 'HAN'}</Text>
                <Text style={styles.cityName}>{currentTicket.destinationCity || 'Ha Noi'}</Text>
              </View>
            </View>

            <View style={styles.rowBetween}>
              <Text style={styles.ticketFrontSub}>{currentTicket.date || 'Sat, 14 Nov'} • {currentTicket.departs || '07:00'}</Text>
              <Text style={styles.ticketFrontSub}>PNR: {currentTicket.pnr || 'VN-8X2K9P'}</Text>
            </View>
          </View>
        </View>

        {/* Details & Authentic SVG Barcode Box */}
        <View style={[styles.detailsBox, { backgroundColor: cardBg, borderColor }]}>
          <View style={styles.grid2x2}>
            <View style={styles.gridItem}>
              <Text style={[styles.kvLabel, { color: textMuted }]}>Date</Text>
              <Text style={[styles.kvValue, { color: textColor }]}>{currentTicket.date || 'Sat, 14 Nov'}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={[styles.kvLabel, { color: textMuted }]}>Departs</Text>
              <Text style={[styles.kvValue, { color: textColor }]}>{currentTicket.departs || '07:00'}</Text>
            </View>
            <View style={[styles.gridItem, { marginTop: 12 }]}>
              <Text style={[styles.kvLabel, { color: textMuted }]}>Aircraft</Text>
              <Text style={[styles.kvValue, { color: textColor }]}>{currentTicket.aircraft || 'Airbus A350-900'}</Text>
            </View>
            <View style={[styles.gridItem, { marginTop: 12 }]}>
              <Text style={[styles.kvLabel, { color: textMuted }]}>PNR code</Text>
              <Text style={[styles.kvValue, { color: textColor }]}>{currentTicket.pnr || 'VN-8X2K9P'}</Text>
            </View>
          </View>

          {/* High-Fidelity SVG Barcode Component */}
          <View style={styles.barcodeContainer}>
            <BarcodeStripes
              code={currentTicket.pnr || 'VN-8X2K9P'}
              color={textColor}
              bgColor={isDark ? '#162235' : '#FAFAFA'}
            />
          </View>

          <View style={[styles.rowBetween, { marginTop: 14, paddingTop: 10, borderTopWidth: 1, borderColor }]}>
            <Text style={[styles.totalPaidLabel, { color: textMuted }]}>Total paid</Text>
            <Text style={[styles.totalPaidValue, { color: textColor }]}>
              {Number(currentTicket.totalPrice || 2073060).toLocaleString('en-US')} VND
            </Text>
          </View>
        </View>

        {/* Action Buttons Row */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            testID="btn-view-boarding-pass"
            style={styles.primaryActionBtn}
            onPress={() => {
              setSelectedTicket(currentTicket);
              setIsBoardingPassOpen(true);
            }}
            activeOpacity={0.8}
          >
            <TicketIcon size={20} color="#FFFFFF" />
            <Text style={styles.primaryActionText}>Boarding pass</Text>
          </TouchableOpacity>

          <TouchableOpacity
            testID="btn-download-ticket"
            style={[styles.iconActionBtn, { borderColor, backgroundColor: cardBg }]}
            onPress={handleDownload}
            activeOpacity={0.7}
          >
            <DownloadIcon size={20} color={textColor} />
          </TouchableOpacity>

          <TouchableOpacity
            testID="btn-share-ticket"
            style={[styles.iconActionBtn, { borderColor, backgroundColor: cardBg }]}
            onPress={handleShare}
            activeOpacity={0.7}
          >
            <ShareIcon size={20} color={textColor} />
          </TouchableOpacity>
        </View>

        {/* Change or refund ticket Support Link */}
        <TouchableOpacity
          testID="btn-ticket-support-link"
          style={[styles.supportCard, { backgroundColor: cardBg, borderColor }]}
          onPress={() => setIsSupportOpen(true)}
          activeOpacity={0.7}
        >
          <View style={styles.supportLeft}>
            <View style={styles.supportIconBadge}>
              <SupportIcon size={18} color="#7A4A06" />
            </View>
            <View>
              <Text style={[styles.supportTitle, { color: textColor }]}>Change or refund ticket</Text>
              <Text style={[styles.supportSub, { color: textMuted }]}>Ticket Support & Refunds</Text>
            </View>
          </View>
          <ChevronRightIcon size={18} color={textMuted} />
        </TouchableOpacity>
      </ScrollView>

      {/* Boarding Pass Modal */}
      <BoardingPassModal
        visible={isBoardingPassOpen}
        ticket={selectedTicket || currentTicket}
        onClose={() => setIsBoardingPassOpen(false)}
      />

      {/* Ticket Support Modal */}
      <TicketSupportModal
        visible={isSupportOpen}
        ticket={currentTicket}
        onClose={() => setIsSupportOpen(false)}
      />
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
    height: 52,
    paddingHorizontal: 16,
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
    paddingBottom: 40,
    paddingTop: 8,
  },
  segmentedWrapper: {
    flexDirection: 'row',
    borderRadius: 24,
    padding: 4,
    marginBottom: 12,
  },
  segmentTab: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentTabActive: {
    elevation: 0,
    shadowOpacity: 0,
  },
  segmentText: {
    fontSize: 14,
    fontWeight: '600',
  },
  segmentTextActive: {
    fontWeight: '800',
  },
  ticketStackWrapper: {
    marginTop: 6,
    marginBottom: 16,
  },
  ticketStackFrontCard: {
    borderRadius: 28,
    padding: 20,
    backgroundColor: '#0E1B2C',
    justifyContent: 'space-between',
    minHeight: 208,
    shadowColor: '#0E1B2C',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 4,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  airlineBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  carrierBadge: {
    backgroundColor: '#0A6CD6',
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 6,
  },
  carrierBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  carrierNameText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  confirmedPill: {
    backgroundColor: '#059669',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  confirmedPillText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  airportCode: {
    fontSize: 34,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  cityName: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  flightCenter: {
    alignItems: 'center',
  },
  durationText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
  },
  ticketFrontSub: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 11,
    fontWeight: '600',
  },
  detailsBox: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 18,
    marginBottom: 16,
  },
  grid2x2: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gridItem: {
    width: '50%',
  },
  kvLabel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  kvValue: {
    fontSize: 14,
    fontWeight: '800',
    marginTop: 2,
  },
  barcodeContainer: {
    marginTop: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  totalPaidLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  totalPaidValue: {
    fontSize: 16,
    fontWeight: '800',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  primaryActionBtn: {
    flex: 1,
    height: 52,
    borderRadius: 18,
    backgroundColor: '#0E1B2C',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryActionText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  iconActionBtn: {
    width: 52,
    height: 52,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  supportCard: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  supportLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  supportIconBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FBF1D6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  supportTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  supportSub: {
    fontSize: 11,
    marginTop: 2,
  },
});
