import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useThemeStore } from '../../stores/theme.store';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

const DEFAULT_HOTEL_IMG = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600';

const formatCurrency = (amount) => {
  if (typeof amount !== 'number') return '0 ₫';
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' ₫';
};

export default function HotelCard({ hotel, onSelect, testID }) {
  const { mode, colors: themeColors } = useThemeStore();

  if (!hotel) return null;

  const imageUri = hotel.thumbnailUrl || (hotel.images && hotel.images[0]) || DEFAULT_HOTEL_IMG;
  const priceNight = typeof hotel.price?.amount === 'number'
    ? hotel.price.amount
    : (typeof hotel.pricePerNight === 'number' ? hotel.pricePerNight : 0);
  const nightsCount = typeof hotel.stayNights === 'number'
    ? hotel.stayNights
    : (typeof hotel.nights === 'number' ? hotel.nights : 1);
  const totalPrice = typeof hotel.totalPrice === 'number'
    ? hotel.totalPrice
    : (priceNight * nightsCount);
  const hotelType = hotel.type || 'LUXURY RESORT';
  const ratingScore = hotel.rating || hotel.reviewScore || 9.4;
  const starCount = hotel.starRating || 5;
  const amenitiesList = hotel.amenities || ['Riverfront Pool', 'Anantara Spa', 'Breakfast Incl.'];

  return (
    <TouchableOpacity
      testID={testID}
      activeOpacity={0.85}
      onPress={() => onSelect && onSelect(hotel)}
      style={[
        styles.card,
        {
          backgroundColor: themeColors.card,
          borderColor: themeColors.border,
        },
      ]}
    >
      {/* Top Header Strip matching User Image 1 */}
      <View testID="hotel-top-header-strip" style={styles.topHeaderStrip}>
        <Text style={styles.topHeaderType}>
          {hotelType} • {starCount} Stars ★
        </Text>
        <View style={styles.topHeaderScoreBadge}>
          <Text style={styles.topHeaderScoreText}>{Number(ratingScore).toFixed(1)} Excellent</Text>
        </View>
      </View>

      {/* Hotel Photo Hero */}
      <View style={styles.imageContainer}>
        <Image
          testID="hotel-card-image"
          source={{ uri: imageUri }}
          style={styles.hotelImage}
          resizeMode="cover"
        />
        <View style={styles.tagBadgeOverlay}>
          <Text style={styles.tagBadgeText}>Beachfront</Text>
        </View>
        <View style={styles.heartBtnOverlay}>
          <Text style={{ fontSize: 14 }}>🤍</Text>
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.headerRow}>
          <View style={styles.titleContainer}>
            <Text style={[styles.hotelName, { color: themeColors.text }]}>{hotel.name}</Text>
            <Text style={[styles.addressText, { color: themeColors.textMuted }]} numberOfLines={1}>
              📍 {hotel.address}
            </Text>
          </View>
        </View>

        {/* Amenity Pills matching Image 1 */}
        <View style={styles.amenitiesRow}>
          {amenitiesList.slice(0, 3).map((amenity, idx) => (
            <View key={idx} style={[styles.amenityPill, { backgroundColor: mode === 'dark' ? '#1E293B' : '#F1F5F9' }]}>
              <Text style={[styles.amenityText, { color: mode === 'dark' ? '#E2E8F0' : '#475569' }]}>
                {amenity}
              </Text>
            </View>
          ))}
        </View>

        {/* Dotted Perforation Line with Side Notches */}
        <View style={styles.perforationWrap}>
          <View style={[styles.perforationNotch, styles.notchLeft, { backgroundColor: mode === 'dark' ? '#121316' : '#F8FAFC' }]} />
          <View style={[styles.dottedLine, { borderColor: mode === 'dark' ? '#334155' : '#E2E8F0' }]} />
          <View style={[styles.perforationNotch, styles.notchRight, { backgroundColor: mode === 'dark' ? '#121316' : '#F8FAFC' }]} />
        </View>

        <View style={styles.footerRow}>
          <View>
            <Text style={[styles.pricePerNightText, { color: themeColors.textMuted }]}>
              {formatCurrency(priceNight)} / night
            </Text>
            <Text style={styles.totalPriceText}>
              {formatCurrency(totalPrice)} <Text style={{ fontSize: 13, fontWeight: '500', color: themeColors.textMuted }}>total</Text>
            </Text>
          </View>

          <TouchableOpacity
            testID="hotel-book-stay-btn"
            style={[styles.bookBtn, { backgroundColor: mode === 'dark' ? '#FFFFFF' : '#0F172A' }]}
            onPress={() => onSelect && onSelect(hotel)}
            activeOpacity={0.85}
          >
            <Text style={[styles.bookBtnText, { color: mode === 'dark' ? '#0F172A' : '#FFFFFF' }]}>
              Book Stay
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 22,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: 'rgba(60,40,160,0.4)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
    overflow: 'hidden',
  },
  topHeaderStrip: {
    backgroundColor: '#0E1B2C',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  topHeaderType: {
    color: '#FACC15',
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 0.8,
  },
  topHeaderScoreBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.4)',
  },
  topHeaderScoreText: {
    color: '#10B981',
    fontWeight: '700',
    fontSize: 11,
  },
  tagBadgeOverlay: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: '#0F172A',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagBadgeText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 11,
  },
  heartBtnOverlay: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: '#FFFFFF',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  amenitiesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
    marginBottom: 4,
  },
  amenityPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  amenityText: {
    fontSize: 11,
    fontWeight: '600',
  },
  perforationWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
    marginHorizontal: -16,
    position: 'relative',
  },
  perforationNotch: {
    width: 14,
    height: 14,
    borderRadius: 7,
    zIndex: 2,
  },
  notchLeft: {
    marginLeft: -7,
  },
  notchRight: {
    marginRight: -7,
  },
  dottedLine: {
    flex: 1,
    borderBottomWidth: 1.5,
    borderStyle: 'dashed',
    marginHorizontal: 4,
  },
  imageContainer: {
    width: '100%',
    height: 160,
    position: 'relative',
    backgroundColor: '#E2E8F0',
  },
  hotelImage: {
    width: '100%',
    height: '100%',
  },
  ratingBadgeOverlay: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  overlayRatingText: {
    color: '#FACC15',
    fontWeight: '700',
    fontSize: 12,
  },
  scoreBadgeOverlay: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  scoreTextOverlay: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 11,
  },
  body: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleContainer: {
    flex: 1,
    paddingRight: 8,
  },
  hotelName: {
    ...typography.h3,
    color: colors.text,
  },
  addressText: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 4,
  },
  ratingBadge: {
    backgroundColor: 'rgba(255, 214, 10, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ratingText: {
    ...typography.caption,
    color: colors.warning,
    fontWeight: '700',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  scoreBadge: {
    backgroundColor: 'rgba(10, 132, 255, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginRight: 10,
  },
  scoreText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
  },
  nightsText: {
    ...typography.caption,
    color: colors.textMuted,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
    paddingTop: 4,
  },
  pricePerNightText: {
    ...typography.body,
    color: colors.textMuted,
  },
  totalBlock: {
    alignItems: 'flex-end',
  },
  totalLabel: {
    ...typography.caption,
    color: colors.textMuted,
  },
  totalPriceText: {
    ...typography.h3,
    color: colors.success,
    fontWeight: '700',
  },
  bookBtn: {
    borderRadius: 14,
    paddingHorizontal: 24,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
  },
  bookBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 15,
    letterSpacing: 0.3,
  },
});
