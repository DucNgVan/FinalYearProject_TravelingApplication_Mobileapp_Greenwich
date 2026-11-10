import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { useThemeStore } from '../../stores/theme.store';
import { colors } from '../../theme/colors';

export const CITY_COVERS = {
  paris: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80',
  danang: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&q=80',
  hoian: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&q=80',
  hanoi: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80',
  dalat: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&q=80',
  tokyo: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&q=80',
  newyork: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80',
  london: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80',
  default: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80',
};

export function getDestinationCoverImage(destination, country) {
  const normalize = (str) =>
    (str || '')
      .toLowerCase()
      .replace(/[đĐ]/g, 'd')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '');

  const text = `${normalize(destination)} ${normalize(country)}`;

  if (text.includes('london')) return CITY_COVERS.london;
  if (text.includes('danang') || text.includes('da nang')) return CITY_COVERS.danang;
  if (text.includes('hoian') || text.includes('hoi an')) return CITY_COVERS.hoian;
  if (text.includes('hanoi') || text.includes('ha noi')) return CITY_COVERS.hanoi;
  if (text.includes('dalat') || text.includes('da lat')) return CITY_COVERS.dalat;
  if (text.includes('paris')) return CITY_COVERS.paris;
  if (text.includes('tokyo')) return CITY_COVERS.tokyo;
  if (text.includes('newyork') || text.includes('new york')) return CITY_COVERS.newyork;

  return CITY_COVERS.default;
}

export default function TripCardHero({ trip, onPress }) {
  const { colors: themeColors, mode } = useThemeStore();
  const isDark = mode === 'dark';

  if (!trip) return null;

  const coverUri =
    trip.coverImage ||
    getDestinationCoverImage(
      trip.destinationCity || trip.destination || trip.title,
      trip.country
    );

  const status = trip.status || (trip.days?.length > 0 ? 'Ready' : 'Draft');
  const isLive = status === 'LIVE';
  const isReady = status === 'Ready';
  const isDraft = status === 'Draft';

  const daysCount =
    trip.daysCount ||
    (trip.days?.length > 0 ? trip.days.length : 5);

  const currentDay = trip.currentDay || 1;
  const progressPct =
    typeof trip.progressPercentage === 'number'
      ? trip.progressPercentage
      : typeof trip.itineraryCompletionPercent === 'number'
      ? trip.itineraryCompletionPercent
      : isLive
      ? Math.round((currentDay / daysCount) * 100)
      : 0;

  const countryText = (trip.country || trip.destinationCity || 'EXPLORE').toUpperCase();
  const daysText = `${daysCount} DAYS`;

  const getStatusBadgeStyle = () => {
    if (isLive) {
      return { bg: 'rgba(239, 68, 68, 0.2)', text: '#EF4444', label: '🔴 LIVE' };
    }
    if (isReady) {
      return { bg: 'rgba(46, 125, 91, 0.2)', text: '#2E7D5B', label: '🟢 Ready' };
    }
    return { bg: 'rgba(245, 158, 11, 0.2)', text: '#F59E0B', label: '🟠 Draft' };
  };

  const badgeConfig = getStatusBadgeStyle();

  return (
    <TouchableOpacity
      testID={`trip-hero-card-${trip.id || 'current'}`}
      style={styles.cardContainer}
      onPress={() => onPress?.(trip)}
      activeOpacity={0.88}
    >
      <View testID={`saved-trip-card-${trip.id || 'current'}`} style={{ flex: 1 }}>
        <ImageBackground
          source={{ uri: coverUri }}
          style={styles.imageBackground}
          imageStyle={styles.imageStyle}
        >
          {/* Gradient dark scrim for high contrast readability */}
          <View style={styles.scrimOverlay}>
            {/* Top Row: Live/Ready/Draft Badge */}
            <View style={styles.topRow}>
              <View />
              <View
                testID={`trip-hero-badge-${status.toLowerCase()}`}
                style={[styles.badge, { backgroundColor: badgeConfig.bg }]}
              >
                <Text style={[styles.badgeText, { color: badgeConfig.text }]}>
                  {badgeConfig.label}
                </Text>
              </View>
            </View>

            {/* Bottom Content Area */}
            <View style={styles.bottomContent}>
              <Text style={styles.subtitleMeta}>
                {countryText} · {daysText}
              </Text>
              <Text style={styles.tripTitle} numberOfLines={1}>
                {trip.title || trip.destinationCity || 'Paris'}
              </Text>

              {/* Progress Row: DAY X OF Y and % */}
              <View style={styles.progressRow}>
                <Text style={styles.progressDayText}>
                  DAY {currentDay} OF {daysCount}
                </Text>
                <Text style={styles.progressPctText}>{progressPct}%</Text>
              </View>

              {/* Progress Bar Track & Fill */}
              <View testID="trip-hero-progress-bar" style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${Math.min(100, Math.max(0, progressPct))}%` },
                  ]}
                />
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: '100%',
    height: 380,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 20,
    backgroundColor: '#0F172A',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 16,
    elevation: 8,
  },
  imageBackground: {
    width: '100%',
    height: '100%',
  },
  imageStyle: {
    borderRadius: 24,
  },
  scrimOverlay: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
    backgroundColor: 'rgba(15, 23, 42, 0.42)',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  bottomContent: {
    paddingBottom: 4,
  },
  subtitleMeta: {
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 6,
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  tripTitle: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: -0.5,
    marginBottom: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressDayText: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
  },
  progressPctText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  progressTrack: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2E7D5B', // Nomadix Pine Green
    borderRadius: 2,
  },
});
