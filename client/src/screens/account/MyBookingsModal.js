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
import { useBookingStore } from '../../stores/booking.store';
import { ChevronLeftIcon, BedIcon } from '../../components/common/NomadixIcons';
import { REDESIGN_THEME } from '../../theme/designTokens';

export default function MyBookingsModal({ visible, onClose }) {
  const { mode } = useThemeStore();
  const isDark = mode === 'dark';
  const storeHotels = useBookingStore((state) => state.bookedHotels);
  const hotelList = Array.isArray(storeHotels)
    ? storeHotels
    : Array.isArray(storeHotels?.bookedHotels)
    ? storeHotels.bookedHotels
    : [];

  const [activeTab, setActiveTab] = useState('upcoming');

  if (!visible) return null;

  const upcomingStays = hotelList
    .filter((h) => !h.status || h.status === 'CONFIRMED' || h.status === 'Confirmed')
    .map((h, i) => ({
      id: h.id || `stay-live-${i}`,
      hotelName: h.hotelName,
      location: `${h.city || 'Da Nang'} · Luxury Stay`,
      dates: `${h.checkIn} – ${h.checkOut}`,
      stayDetails: `${h.nights} night${h.nights > 1 ? 's' : ''} · 2 adults · 1 room`,
      totalPrice: `${Number(h.totalPrice || 0).toLocaleString('en-US')} ₫`,
      status: 'Confirmed',
      bannerColor: i % 2 === 0 ? '#0B5F66' : '#5C4B99',
    }));

  const pastStays = hotelList
    .filter((h) => h.status === 'COMPLETED' || h.status === 'Completed')
    .map((h, i) => ({
      id: h.id || `stay-past-${i}`,
      hotelName: h.hotelName,
      location: `${h.city || 'Da Nang'} · Luxury Stay`,
      dates: `${h.checkIn} – ${h.checkOut}`,
      stayDetails: `${h.nights} night${h.nights > 1 ? 's' : ''} · 2 adults · 1 room`,
      totalPrice: `${Number(h.totalPrice || 0).toLocaleString('en-US')} ₫`,
      status: 'Completed',
      bannerColor: '#334155',
    }));

  const cancelledStays = hotelList
    .filter((h) => h.status === 'CANCELLED' || h.status === 'Cancelled')
    .map((h, i) => ({
      id: h.id || `stay-cancelled-${i}`,
      hotelName: h.hotelName,
      location: `${h.city || 'Da Nang'} · Luxury Stay`,
      dates: `${h.checkIn} – ${h.checkOut}`,
      stayDetails: `${h.nights} night${h.nights > 1 ? 's' : ''} · 2 adults · 1 room`,
      totalPrice: `${Number(h.totalPrice || 0).toLocaleString('en-US')} ₫ (Refunded)`,
      status: 'Cancelled',
      bannerColor: '#881337',
    }));

  const staysToDisplay =
    activeTab === 'cancelled'
      ? cancelledStays
      : activeTab === 'past'
      ? pastStays
      : upcomingStays;

  const activeStay = staysToDisplay[0];

  const getStatusBadgeStyle = (status) => {
    if (status === 'Cancelled') {
      return {
        pillBg: isDark ? 'rgba(239, 68, 68, 0.25)' : '#FEE2E2',
        textColor: '#EF4444',
      };
    }
    if (status === 'Completed') {
      return {
        pillBg: isDark ? '#2A2D35' : '#F1F5F9',
        textColor: isDark ? '#94A3B8' : '#475569',
      };
    }
    return {
      pillBg: isDark ? 'rgba(16, 185, 129, 0.2)' : '#D1FAE5',
      textColor: isDark ? '#34D399' : '#059669',
    };
  };

  const bg = isDark ? '#121316' : '#F8FAFC';
  const cardBg = isDark ? '#1C1D21' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : (REDESIGN_THEME.dark || '#0E1B2C');
  const textMuted = isDark ? '#94A3B8' : (REDESIGN_THEME.textMuted || '#5B6776');
  const borderColor = isDark ? '#2A2D35' : (REDESIGN_THEME.border || '#E3E6E0');

  const handleViewVoucher = (stay) => {
    Alert.alert('Hotel Voucher', `Voucher confirmed for ${stay.hotelName}.\nDates: ${stay.dates}`);
  };

  return (
    <View testID="subscreen-bookings" style={[styles.container, { backgroundColor: bg }]}>
      {/* Header with compact top positioning */}
      <View style={styles.header}>
        <TouchableOpacity
          testID="btn-close-my-bookings"
          onPress={onClose}
          style={[styles.backBtn, { backgroundColor: isDark ? '#1C1D21' : '#FFFFFF', borderColor }]}
          activeOpacity={0.7}
        >
          <ChevronLeftIcon size={20} color={textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: textColor }]}>My Bookings</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Segmented Control */}
        <View style={[styles.segmentedWrapper, { backgroundColor: isDark ? '#1C1D21' : '#EAECEF' }]}>
          <TouchableOpacity
            testID="booking-segment-upcoming"
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
            testID="booking-segment-past"
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

          <TouchableOpacity
            testID="booking-segment-cancelled"
            style={[
              styles.segmentTab,
              activeTab === 'cancelled' && [styles.segmentTabActive, { backgroundColor: isDark ? '#FFFFFF' : '#111827' }],
            ]}
            onPress={() => setActiveTab('cancelled')}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.segmentText,
                { color: activeTab === 'cancelled' ? (isDark ? '#111827' : '#FFFFFF') : (isDark ? '#94A3B8' : '#64748B') },
                activeTab === 'cancelled' && styles.segmentTextActive,
              ]}
            >
              Cancelled
            </Text>
          </TouchableOpacity>
        </View>

        {/* Clean Reservation Card or Authentic Empty State */}
        {staysToDisplay.length === 0 ? (
          <View testID="bookings-empty-state" style={styles.emptyContainer}>
            <View style={[styles.emptyIconCircle, { backgroundColor: isDark ? '#1C1D21' : '#F1F5F9' }]}>
              <BedIcon size={34} color={isDark ? '#64748B' : '#94A3B8'} />
            </View>
            <Text style={[styles.emptyTitle, { color: textColor }]}>Chưa có đặt phòng nào</Text>
            <Text style={[styles.emptySub, { color: textMuted }]}>
              Bạn chưa có đặt phòng khách sạn nào. Khi bạn đặt phòng, chi tiết và voucher lưu trú sẽ hiển thị tại đây.
            </Text>
          </View>
        ) : (
          <>
            {activeStay && (
              <View testID="booking-stack-wrapper" style={styles.bookingStackWrapper}>
                {/* Front Card: Hero physical reservation card */}
                <View testID="booking-stack-front-card" style={styles.bookingStackFrontCard}>
                  <View style={styles.frontCardTopRow}>
                    <View
                      style={[
                        styles.confirmedPill,
                        { backgroundColor: getStatusBadgeStyle(activeStay.status).pillBg },
                      ]}
                    >
                      <Text
                        style={[
                          styles.confirmedPillText,
                          { color: getStatusBadgeStyle(activeStay.status).textColor },
                        ]}
                      >
                        {activeStay.status}
                      </Text>
                    </View>
                    <Text style={styles.frontHotelPrice}>{activeStay.totalPrice}</Text>
                  </View>

                  <View>
                    <Text style={styles.frontHotelName}>{activeStay.hotelName}</Text>
                    <Text style={styles.frontHotelLoc}>{activeStay.location}</Text>
                  </View>

                  <View style={styles.frontDetailsRow}>
                    <View>
                      <Text style={styles.frontLabel}>DATES</Text>
                      <Text style={styles.frontVal}>{activeStay.dates}</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={styles.frontLabel}>STAY</Text>
                      <Text style={styles.frontVal}>{activeStay.stayDetails}</Text>
                    </View>
                  </View>
                </View>
              </View>
            )}

            {/* Other Stays List */}
            {staysToDisplay.slice(1).map((stay) => (
              <View
                key={stay.id}
                testID={`booking-card-${stay.id}`}
                style={[styles.hotelCard, { backgroundColor: cardBg, borderColor }]}
              >
                {/* Hotel Banner Top */}
                <View style={[styles.cardBanner, { backgroundColor: stay.bannerColor }]}>
                  <View
                    style={[
                      styles.confirmedBadge,
                      { backgroundColor: getStatusBadgeStyle(stay.status).pillBg },
                    ]}
                  >
                    <Text
                      style={[
                        styles.confirmedBadgeText,
                        { color: getStatusBadgeStyle(stay.status).textColor },
                      ]}
                    >
                      {stay.status}
                    </Text>
                  </View>
                </View>

                {/* Hotel Card Body */}
                <View style={styles.cardBody}>
                  <Text style={[styles.hotelName, { color: textColor }]}>{stay.hotelName}</Text>
                  <Text style={[styles.locationText, { color: textMuted }]}>{stay.location}</Text>

                  <View style={styles.detailsRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.kvLabel, { color: textMuted }]}>Dates</Text>
                      <Text style={[styles.kvValue, { color: textColor }]}>{stay.dates}</Text>
                    </View>
                    <View style={{ flex: 1.2 }}>
                      <Text style={[styles.kvLabel, { color: textMuted }]}>Stay</Text>
                      <Text style={[styles.kvValue, { color: textColor }]}>{stay.stayDetails}</Text>
                    </View>
                  </View>

                  {/* Footer with Total and View Voucher */}
                  <View style={[styles.cardFooter, { borderColor }]}>
                    <View>
                      <Text style={[styles.totalLabel, { color: textMuted }]}>Total</Text>
                      <Text style={[styles.totalValue, { color: textColor }]}>{stay.totalPrice}</Text>
                    </View>

                    <TouchableOpacity
                      style={styles.voucherBtn}
                      onPress={() => handleViewVoucher(stay)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.voucherBtnText}>View voucher</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </>
        )}
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
    fontSize: 13,
    fontWeight: '600',
  },
  segmentTextActive: {
    fontWeight: '800',
  },
  bookingStackWrapper: {
    marginTop: 6,
    marginBottom: 16,
  },
  bookingStackFrontCard: {
    borderRadius: 28,
    padding: 22,
    backgroundColor: '#0B5F66',
    justifyContent: 'space-between',
    minHeight: 208,
    shadowColor: '#0E1B2C',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 4,
  },
  frontCardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  confirmedPill: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 99,
  },
  confirmedPillText: {
    color: '#0E1B2C',
    fontSize: 11,
    fontWeight: '800',
  },
  frontHotelPrice: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  frontHotelName: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  frontHotelLoc: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 12,
    marginTop: 2,
  },
  frontDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    paddingTop: 10,
  },
  frontLabel: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },
  frontVal: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  hotelCard: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    marginTop: 14,
  },
  cardBanner: {
    height: 84,
    padding: 12,
    position: 'relative',
    justifyContent: 'flex-start',
  },
  confirmedBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 99,
  },
  confirmedBadgeText: {
    color: '#0E1B2C',
    fontSize: 11,
    fontWeight: '800',
  },
  cardBody: {
    padding: 16,
  },
  hotelName: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  locationText: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 14,
  },
  kvLabel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  kvValue: {
    fontSize: 13,
    fontWeight: '800',
    marginTop: 3,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderStyle: 'dashed',
    marginTop: 14,
    paddingTop: 12,
  },
  totalLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '800',
    marginTop: 2,
  },
  voucherBtn: {
    backgroundColor: '#E3F2F0',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  voucherBtnText: {
    color: '#0B6B67',
    fontSize: 13,
    fontWeight: '800',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 56,
    paddingHorizontal: 24,
  },
  emptyIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySub: {
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    maxWidth: 290,
  },
});
