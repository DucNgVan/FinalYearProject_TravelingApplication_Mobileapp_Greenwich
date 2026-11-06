import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Image,
} from 'react-native';
import { useThemeStore } from '../../stores/theme.store';
import LucideIcon from '../common/LucideIcon';

export default function HotelBookingModal({
  visible,
  hotel,
  checkIn = '2026-11-14',
  checkOut = '2026-11-17',
  guests = 2,
  rooms = 1,
  onClose,
  onConfirm,
}) {
  const { mode, colors: themeColors } = useThemeStore();
  const isDark = mode === 'dark';

  const [guestName, setGuestName] = useState('Alex Rivers');
  const [guestEmail, setGuestEmail] = useState('traveler@example.com');
  const [guestPhone, setGuestPhone] = useState('+84 901 234 567');

  if (!visible || !hotel) return null;

  const d1 = new Date(checkIn);
  const d2 = new Date(checkOut);
  const nights = Math.max(1, Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24)) || 1);
  const pricePerNight = hotel.pricePerNight || 1500000;
  const totalPrice = pricePerNight * nights * (rooms || 1);

  const handleBooking = () => {
    onConfirm?.({
      hotelId: hotel.id,
      hotelName: hotel.name,
      checkIn,
      checkOut,
      nights,
      rooms,
      totalPrice,
      guestDetails: {
        fullName: guestName,
        email: guestEmail,
        phone: guestPhone,
      },
    });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
        <View style={[styles.sheet, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
          <View style={[styles.handle, { backgroundColor: themeColors.border }]} />

          {/* Header */}
          <View style={styles.headerRow}>
            <View>
              <Text style={[styles.providerBadge, { color: '#007AFF' }]}>
                ⚡ Duffel Stays Sandbox Booking
              </Text>
              <Text style={[styles.sheetTitle, { color: themeColors.text }]}>Confirm Hotel Stay</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={[styles.closeBtn, { backgroundColor: isDark ? '#2A2D35' : '#E2E8F0' }]}>
              <Text style={[styles.closeBtnText, { color: themeColors.text }]}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={styles.contentScroll}>
            {/* Hotel Summary Card */}
            <View style={[styles.hotelCard, { backgroundColor: isDark ? '#121316' : '#F8FAFC', borderColor: themeColors.border }]}>
              {hotel.thumbnailUrl ? (
                <Image source={{ uri: hotel.thumbnailUrl }} style={styles.thumbnail} />
              ) : null}
              <View style={styles.hotelInfo}>
                <Text style={[styles.hotelName, { color: themeColors.text }]} numberOfLines={1}>
                  {hotel.name}
                </Text>
                <Text style={[styles.hotelAddress, { color: themeColors.textMuted }]} numberOfLines={1}>
                  {hotel.address || `${hotel.city}, Vietnam`}
                </Text>
                <View style={styles.ratingRow}>
                  <Text style={styles.starText}>{'★'.repeat(hotel.starRating || 4)}</Text>
                  <View style={styles.scoreBadge}>
                    <Text style={styles.scoreText}>{hotel.reviewScore || 9.2}</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Stay Details Grid */}
            <View style={[styles.stayGrid, { backgroundColor: isDark ? '#121316' : '#F8FAFC', borderColor: themeColors.border }]}>
              <View style={styles.gridItem}>
                <Text style={[styles.gridLabel, { color: themeColors.textMuted }]}>CHECK-IN</Text>
                <Text style={[styles.gridValue, { color: themeColors.text }]}>{checkIn}</Text>
              </View>
              <View style={[styles.gridDivider, { backgroundColor: themeColors.border }]} />
              <View style={styles.gridItem}>
                <Text style={[styles.gridLabel, { color: themeColors.textMuted }]}>CHECK-OUT</Text>
                <Text style={[styles.gridValue, { color: themeColors.text }]}>{checkOut}</Text>
              </View>
            </View>

            <View style={styles.metadataPillsRow}>
              <View style={[styles.metaPill, { backgroundColor: isDark ? '#2A2D35' : '#E2E8F0' }]}>
                <LucideIcon name="moon" size={13} color={themeColors.text} strokeWidth={2.2} />
                <Text style={[styles.metaPillText, { color: themeColors.text }]}>{nights} Night{nights > 1 ? 's' : ''}</Text>
              </View>
              <View style={[styles.metaPill, { backgroundColor: isDark ? '#2A2D35' : '#E2E8F0' }]}>
                <LucideIcon name="users" size={13} color={themeColors.text} strokeWidth={2.2} />
                <Text style={[styles.metaPillText, { color: themeColors.text }]}>{guests} Guest{guests > 1 ? 's' : ''}</Text>
              </View>
              <View style={[styles.metaPill, { backgroundColor: isDark ? '#2A2D35' : '#E2E8F0' }]}>
                <LucideIcon name="home" size={13} color={themeColors.text} strokeWidth={2.2} />
                <Text style={[styles.metaPillText, { color: themeColors.text }]}>{rooms} Room{rooms > 1 ? 's' : ''}</Text>
              </View>
            </View>

            {/* Guest Form */}
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Guest Contact Information</Text>
            <View style={styles.formGroup}>
              <Text style={[styles.inputLabel, { color: themeColors.textMuted }]}>Full Name</Text>
              <TextInput
                value={guestName}
                onChangeText={setGuestName}
                style={[styles.input, { backgroundColor: isDark ? '#121316' : '#FFFFFF', borderColor: themeColors.border, color: themeColors.text }]}
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={[styles.inputLabel, { color: themeColors.textMuted }]}>Email Address</Text>
              <TextInput
                value={guestEmail}
                onChangeText={setGuestEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                style={[styles.input, { backgroundColor: isDark ? '#121316' : '#FFFFFF', borderColor: themeColors.border, color: themeColors.text }]}
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={[styles.inputLabel, { color: themeColors.textMuted }]}>Phone Number</Text>
              <TextInput
                value={guestPhone}
                onChangeText={setGuestPhone}
                keyboardType="phone-pad"
                style={[styles.input, { backgroundColor: isDark ? '#121316' : '#FFFFFF', borderColor: themeColors.border, color: themeColors.text }]}
              />
            </View>

            {/* Pricing Summary */}
            <View style={[styles.priceBox, { backgroundColor: isDark ? '#121316' : '#F8FAFC', borderColor: themeColors.border }]}>
              <View style={styles.priceRow}>
                <Text style={[styles.priceRowLabel, { color: themeColors.textMuted }]}>
                  ₫{pricePerNight.toLocaleString('vi-VN')} × {nights} nights ({rooms} room)
                </Text>
                <Text style={[styles.priceRowValue, { color: themeColors.text }]}>
                  ₫{totalPrice.toLocaleString('vi-VN')}
                </Text>
              </View>
              <View style={styles.priceRow}>
                <Text style={[styles.priceRowLabel, { color: themeColors.textMuted }]}>Duffel Sandbox Service Fee</Text>
                <Text style={[styles.priceRowValue, { color: '#16A34A' }]}>FREE</Text>
              </View>
              <View style={[styles.priceDivider, { backgroundColor: themeColors.border }]} />
              <View style={styles.totalRow}>
                <Text style={[styles.totalLabel, { color: themeColors.text }]}>Total Stay Price</Text>
                <Text style={[styles.totalAmount, { color: themeColors.primary }]}>
                  ₫{totalPrice.toLocaleString('vi-VN')}
                </Text>
              </View>
            </View>
          </ScrollView>

          {/* Footer CTA */}
          <View style={styles.footerRow}>
            <TouchableOpacity
              testID="confirm-hotel-booking-btn"
              style={[styles.confirmBtn, { backgroundColor: themeColors.primary }]}
              onPress={handleBooking}
              activeOpacity={0.8}
            >
              <Text style={styles.confirmBtnText}>Instant Sandbox Reservation</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
  },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 12,
    paddingHorizontal: 20,
    paddingBottom: 34,
    maxHeight: '90%',
    borderWidth: 1,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  providerBadge: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 14,
    fontWeight: '700',
  },
  contentScroll: {
    marginBottom: 12,
  },
  hotelCard: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    marginBottom: 12,
    alignItems: 'center',
    gap: 12,
  },
  thumbnail: {
    width: 68,
    height: 68,
    borderRadius: 12,
  },
  hotelInfo: {
    flex: 1,
  },
  hotelName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  hotelAddress: {
    fontSize: 12,
    marginBottom: 6,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  starText: {
    color: '#F59E0B',
    fontSize: 12,
  },
  scoreBadge: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  scoreText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  stayGrid: {
    flexDirection: 'row',
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    marginBottom: 10,
    alignItems: 'center',
  },
  gridItem: {
    flex: 1,
    alignItems: 'center',
  },
  gridDivider: {
    width: 1,
    height: 28,
  },
  gridLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  gridValue: {
    fontSize: 13,
    fontWeight: '700',
  },
  metadataPillsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  metaPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 7,
    borderRadius: 20,
  },
  metaPillText: {
    fontSize: 12,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 10,
  },
  formGroup: {
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 4,
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 14,
  },
  priceBox: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginTop: 8,
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  priceRowLabel: {
    fontSize: 12,
  },
  priceRowValue: {
    fontSize: 12,
    fontWeight: '600',
  },
  priceDivider: {
    height: 1,
    marginVertical: 8,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: '800',
  },
  footerRow: {
    paddingTop: 8,
  },
  confirmBtn: {
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
