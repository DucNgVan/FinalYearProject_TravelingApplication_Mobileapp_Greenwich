import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useThemeStore } from '../../stores/theme.store';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

const formatDuration = (minutes) => {
  if (!minutes && minutes !== 0) return '0h 0m';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
};

const formatCurrency = (amount) => {
  if (typeof amount !== 'number') return '0 ₫';
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' ₫';
};

export default function FlightCard({ flight, onSelect, testID }) {
  const { mode, colors: themeColors } = useThemeStore();
  const [imageError, setImageError] = useState(false);

  if (!flight) return null;

  const isDirect = flight.stops === 0;
  const stopsText = isDirect ? 'Direct' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`;
  const priceAmount = flight.price?.amount ?? 0;

  const carrierCode = (flight.airlineCode || (flight.flightNumber ? flight.flightNumber.slice(0, 2) : 'VN')).toUpperCase();
  const badgeColor = carrierCode === 'VJ' ? '#E11B22' : carrierCode === 'SQ' ? '#D97706' : '#007AFF';
  const aircraft = flight.aircraft || (flight.flightNumber?.includes('VN-0240') ? 'Airbus A350-900' : 'Airbus A321');
  const logoUri = flight.airlineLogo || `https://images.kiwi.com/airlines/64x64/${carrierCode}.png`;
  const baggageText = flight.baggageSummary || '1 checked bag (20kg) • 1 carry-on (7kg)';

  // Format departure / arrival times
  const depTime = flight.departureTime
    ? flight.departureTime.includes('T')
      ? flight.departureTime.slice(11, 16)
      : flight.departureTime
    : '07:00';

  const arrTime = flight.arrivalTime
    ? flight.arrivalTime.includes('T')
      ? flight.arrivalTime.slice(11, 16)
      : flight.arrivalTime
    : '09:10';

  const baggageTransferText = !isDirect
    ? flight.baggageTransfer || (flight.baggageTransferType === 'manual' ? '⚠️ Self-transfer baggage' : '🔄 Auto baggage transfer')
    : null;

  return (
    <TouchableOpacity
      testID={testID || (flight?.id ? `flight-card-${flight.id}` : undefined)}
      activeOpacity={0.85}
      onPress={() => onSelect && onSelect(flight)}
      style={[
        styles.card,
        {
          backgroundColor: themeColors.card,
          borderColor: themeColors.border,
        },
      ]}
    >
      {/* Header Row: Airline Logo Image & Flight Number + Direct Badge */}
      <View style={styles.headerRow}>
        <View style={styles.carrierInfo}>
          {logoUri && !imageError ? (
            <Image
              testID="airline-logo-image"
              source={{ uri: logoUri }}
              style={styles.carrierLogoImage}
              resizeMode="contain"
              onError={() => setImageError(true)}
            />
          ) : (
            <View style={[styles.carrierBadge, { backgroundColor: badgeColor }]}>
              <Text style={styles.carrierBadgeText}>{carrierCode}</Text>
            </View>
          )}
          <View>
            <Text style={[styles.airlineName, { color: themeColors.text }]}>{flight.airlineName || flight.airline || 'Vietnam Airlines'}</Text>
            <Text style={[styles.flightNumber, { color: themeColors.textMuted }]}>{flight.flightNumber} • {aircraft}</Text>
          </View>
        </View>

        <View style={[styles.badge, isDirect ? styles.directBadge : styles.stopsBadge]}>
          <Text style={[styles.badgeText, isDirect ? styles.directBadgeText : styles.stopsBadgeText]}>
            {stopsText}
          </Text>
        </View>
      </View>

      {/* Route Timeline */}
      <View style={[styles.routeRow, { borderTopColor: themeColors.border, borderBottomColor: themeColors.border }]}>
        <View style={styles.stationBlock}>
          <Text style={[styles.timeText, { color: themeColors.text }]}>{depTime}</Text>
          <Text style={[styles.airportCode, { color: themeColors.textMuted }]}>{flight.origin}</Text>
        </View>

        <View style={styles.middleRoute}>
          <Text style={[styles.durationText, { color: themeColors.textMuted }]}>{formatDuration(flight.durationMinutes)}</Text>
          <View style={styles.routeLineContainer}>
            <View style={[styles.routeLine, !isDirect && styles.routeLineTransit]} />
            {isDirect ? (
              <Text
                testID="route-plane-icon"
                style={[
                  styles.planeIcon,
                  {
                    backgroundColor: themeColors.card,
                    color: themeColors.primary,
                  },
                ]}
              >
                ✈
              </Text>
            ) : (
              <View style={styles.stopsContainer}>
                {Array.from({ length: Math.max(1, flight.stops || 1) }).map((_, idx) => (
                  <View
                    key={idx}
                    testID={`stop-dot-${idx}`}
                    style={[
                      styles.stopDot,
                      {
                        backgroundColor: '#D97706',
                        borderColor: themeColors.card,
                      },
                    ]}
                  />
                ))}
              </View>
            )}
          </View>
          <Text style={[styles.transitNote, isDirect ? styles.directNote : styles.transitNoteText]}>
            {isDirect ? 'Non-stop' : 'Connecting'}
          </Text>
        </View>

        <View style={[styles.stationBlock, styles.alignRight]}>
          <Text style={[styles.timeText, { color: themeColors.text }]}>{arrTime}</Text>
          <Text style={[styles.airportCode, { color: themeColors.textMuted }]}>{flight.destination}</Text>
        </View>
      </View>

      {/* Rich Metadata: Baggage info & Baggage transfer status */}
      <View style={[styles.baggageRow, { backgroundColor: mode === 'dark' ? '#273549' : '#F8FAFC' }]}>
        <Text style={[styles.baggageText, { color: themeColors.textMuted }]}>
          🧳 {baggageText}
          {baggageTransferText ? ` • ${baggageTransferText}` : ''}
        </Text>
      </View>

      {/* Footer Row: CTA Hint & Localized Price */}
      <View style={styles.footerRow}>
        <Text style={[styles.actionHint, { color: themeColors.primary }]}>Tap to view details & sandbox book →</Text>
        <Text style={styles.priceAmount}>{formatCurrency(priceAmount)}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 14,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    shadowColor: 'rgba(60,40,160,0.4)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  carrierInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  carrierLogoImage: {
    width: 40,
    height: 40,
    borderRadius: 14,
  },
  carrierBadge: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  carrierBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  baggageRow: {
    backgroundColor: '#F8FAFC',
    borderRadius: 99,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  baggageText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  airlineName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1C1C1E',
  },
  flightNumber: {
    fontSize: 11,
    color: '#8E8E93',
    fontWeight: '600',
    marginTop: 1,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  directBadge: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#D1FAE5',
  },
  stopsBadge: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FEE3B8',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  directBadgeText: {
    color: '#2E7D5B',
  },
  stopsBadgeText: {
    color: '#D97706',
  },
  routeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#F2F2F7',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F2F2F7',
  },
  stationBlock: {
    minWidth: 50,
  },
  alignRight: {
    alignItems: 'flex-end',
  },
  timeText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1C1C1E',
  },
  airportCode: {
    fontSize: 11,
    fontWeight: '800',
    color: '#8E8E93',
    marginTop: 2,
  },
  middleRoute: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  durationText: {
    fontSize: 11,
    color: '#8E8E93',
    fontWeight: '600',
    marginBottom: 2,
  },
  routeLineContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 2,
    position: 'relative',
  },
  routeLine: {
    width: '100%',
    height: 1,
    backgroundColor: '#E5E5EA',
  },
  routeLineTransit: {
    backgroundColor: '#FDE68A',
  },
  planeIcon: {
    position: 'absolute',
    fontSize: 10,
    color: '#007AFF',
    paddingHorizontal: 4,
  },
  stopsContainer: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    alignItems: 'center',
  },
  stopDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#D97706',
    borderWidth: 1.5,
  },
  transitNote: {
    fontSize: 9,
    fontWeight: '700',
    marginTop: 2,
  },
  directNote: {
    color: '#2E7D5B',
  },
  transitNoteText: {
    color: '#D97706',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
  },
  actionHint: {
    fontSize: 10,
    color: '#8E8E93',
    fontWeight: '500',
  },
  priceAmount: {
    fontSize: 16,
    fontWeight: '900',
    color: '#007AFF',
  },
});
