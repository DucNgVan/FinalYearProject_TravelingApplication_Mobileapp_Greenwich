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

  const imageUri = hotel.thumbnailUrl || DEFAULT_HOTEL_IMG;

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
      {/* Hotel Photo Hero */}
      <View style={styles.imageContainer}>
        <Image
          testID="hotel-card-image"
          source={{ uri: imageUri }}
          style={styles.hotelImage}
          resizeMode="cover"
        />
        <View style={styles.ratingBadgeOverlay}>
          <Text style={styles.overlayRatingText}>★ {hotel.starRating || 5}</Text>
        </View>
        {hotel.reviewScore ? (
          <View style={styles.scoreBadgeOverlay}>
            <Text style={styles.scoreTextOverlay}>
              {Number(hotel.reviewScore).toFixed(1)} Excellent
            </Text>
          </View>
        ) : null}
      </View>

      <View style={styles.body}>
        <View style={styles.headerRow}>
          <View style={styles.titleContainer}>
            <Text style={[styles.hotelName, { color: themeColors.text }]}>{hotel.name}</Text>
            <Text style={[styles.addressText, { color: themeColors.textMuted }]} numberOfLines={1}>{hotel.address}</Text>
          </View>
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingText}>{hotel.starRating} Stars ★</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          {hotel.reviewScore ? (
            <View style={styles.scoreBadge}>
              <Text style={styles.scoreText}>{Number(hotel.reviewScore).toFixed(1)} Excellent</Text>
            </View>
          ) : null}
          {hotel.nights ? (
            <Text style={[styles.nightsText, { color: themeColors.textMuted }]}>
              {hotel.nights} {hotel.nights > 1 ? 'nights' : 'night'}
            </Text>
          ) : null}
        </View>

        <View style={[styles.footerRow, { borderTopColor: themeColors.border }]}>
          <View>
            <Text style={[styles.pricePerNightText, { color: themeColors.textMuted }]}>
              {formatCurrency(hotel.pricePerNight)} / night
            </Text>
          </View>
          <View style={styles.totalBlock}>
            <Text style={[styles.totalLabel, { color: themeColors.textMuted }]}>Total stay:</Text>
            <Text style={styles.totalPriceText}>
              {formatCurrency(hotel.totalPrice || hotel.pricePerNight)}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.bookBtn, { backgroundColor: themeColors.primary }]}
          onPress={() => onSelect && onSelect(hotel)}
          activeOpacity={0.85}
        >
          <Text style={[styles.bookBtnText, { color: mode === 'dark' ? '#111827' : '#FFFFFF' }]}>Book now</Text>
        </TouchableOpacity>
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
    alignItems: 'flex-end',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
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
    marginTop: 12,
    borderRadius: 18,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
});
