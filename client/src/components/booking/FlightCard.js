import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useThemeStore } from '../../stores/theme.store';
import { colors } from '../../theme/colors';

const CITY_LOOKUP = {
  DPS: 'Denpasar',
  CGK: 'Jakarta',
  SGN: 'TP. Hồ Chí Minh',
  HAN: 'Hà Nội',
  DAD: 'Đà Nẵng',
  PQC: 'Phú Quốc',
  CXR: 'Nha Trang',
  VCA: 'Cần Thơ',
  HPH: 'Hải Phòng',
  SIN: 'Singapore',
  BKK: 'Bangkok',
  NRT: 'Tokyo',
  HND: 'Tokyo',
  ICN: 'Seoul',
  CDG: 'Paris',
  JFK: 'New York',
  LHR: 'London',
  SYD: 'Sydney',
};

const formatDuration = (minutes) => {
  if (!minutes && minutes !== 0) return '0h 0m';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
};

const formatCurrency = (priceObj) => {
  if (!priceObj && priceObj !== 0) return '0 ₫';
  const amount = typeof priceObj === 'number' ? priceObj : (priceObj.amount ?? 0);
  const currency = typeof priceObj === 'object' ? priceObj?.currency : null;
  if (currency === 'USD' || (amount < 1000 && currency !== 'VND')) {
    return `$${amount}`;
  }
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' ₫';
};

export default function FlightCard({ flight, onSelect, testID }) {
  const { mode, colors: themeColors } = useThemeStore();
  const isDark = mode === 'dark';
  const [imageError, setImageError] = useState(false);

  if (!flight) return null;

  const isDirect = flight.stops === 0;
  const stopsText = isDirect ? 'Direct' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`;
  const carrierCode = (flight.airlineCode || (flight.flightNumber ? flight.flightNumber.slice(0, 2) : 'VN')).toUpperCase();
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

  // Format date for stub header
  const formattedDate = flight.departureTime && flight.departureTime.includes('-')
    ? (() => {
        try {
          const d = new Date(flight.departureTime);
          const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
          const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
          return `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]}`;
        } catch {
          return 'FRI 4 SEP';
        }
      })()
    : 'FRI 4 SEP';

  const originCity = flight.originCity || CITY_LOOKUP[flight.origin] || 'Denpasar';
  const destCity = flight.destinationCity || CITY_LOOKUP[flight.destination] || 'Jakarta';
  const durationText = formatDuration(flight.durationMinutes);
  const displayPrice = formatCurrency(flight.price);
  const isVnd = flight.price?.currency === 'VND' || (typeof flight.price?.amount === 'number' && flight.price.amount >= 1000) || (typeof flight.price === 'number' && flight.price >= 1000);

  const baggageTransferText = !isDirect
    ? flight.baggageTransfer || (flight.baggageTransferType === 'manual' ? '⚠️ Self-transfer baggage' : '🔄 Automatic baggage transfer')
    : null;

  const styles = getStyles(themeColors, isDark);

  return (
    <TouchableOpacity
      testID={testID || (flight?.id ? `flight-card-${flight.id}` : undefined)}
      activeOpacity={0.88}
      onPress={() => onSelect && onSelect(flight)}
      style={styles.card}
    >
      {/* 1. Header Strip (Dark Black #0E1B2C) */}
      <View style={styles.headerRow}>
        <View testID="ticket-header-airline" style={styles.headerLeft}>
          {logoUri && !imageError ? (
            <Image
              testID="airline-logo-image"
              source={{ uri: logoUri }}
              style={styles.carrierLogoImage}
              resizeMode="contain"
              onError={() => setImageError(true)}
            />
          ) : (
            <View style={styles.carrierBadge}>
              <Text style={styles.carrierBadgeText}>{carrierCode}</Text>
            </View>
          )}
          <View style={{ flex: 1 }}>
            <Text style={styles.airlineName} numberOfLines={1}>
              {flight.airlineName || flight.airline || 'Garuda Indonesia'}
            </Text>
            {flight.aircraft ? (
              <Text style={styles.flightMetaSub} numberOfLines={1}>
                {aircraft}
              </Text>
            ) : null}
          </View>
          <View style={[styles.badge, isDirect ? styles.directBadge : styles.stopsBadge]}>
            <Text style={[styles.badgeText, isDirect ? styles.directBadgeText : styles.stopsBadgeText]}>
              {stopsText}
            </Text>
          </View>
        </View>

        <View style={styles.headerNotchDivider} />

        <View testID="ticket-header-date" style={styles.headerRight}>
          <Text style={styles.dateHeaderText}>{formattedDate}</Text>
        </View>
      </View>

      {/* 2. Boarding Pass Body (Main Flight Info + Perforated Stub) */}
      <View style={styles.bodyRow}>
        {/* Main Body (Left ~72%) */}
        <View testID="flight-ticket-main" style={styles.mainBody}>
          {/* Top Route Row: FROM | Arc | TO */}
          <View style={styles.routeRow}>
            {/* Origin */}
            <View style={styles.stationCol}>
              <Text style={styles.fieldLabel}>FROM</Text>
              <Text style={styles.airportCode}>{flight.origin}</Text>
              <Text style={styles.cityName} numberOfLines={1}>{originCity}</Text>
              <Text style={styles.timeText}>{depTime}</Text>
            </View>

            {/* Trajectory Flight Arc */}
            <View testID="ticket-flight-arc" style={styles.trajectoryCol}>
              <Text style={styles.durationText}>{durationText}</Text>
              <View style={styles.arcLineContainer}>
                <View style={styles.arcSvgCurve} />
                <View style={styles.planeIconWrapper}>
                  <Text testID="route-plane-icon" style={styles.planeIcon}>✈</Text>
                </View>
                {/* Dynamic Stop Dots for connecting flights */}
                {!isDirect && flight.stops > 0 ? (
                  <View style={styles.stopDotsContainer}>
                    {Array.from({ length: flight.stops }).map((_, idx) => (
                      <View key={idx} testID={`stop-dot-${idx}`} style={styles.stopDot} />
                    ))}
                  </View>
                ) : null}
              </View>
            </View>

            {/* Destination */}
            <View style={styles.stationCol}>
              <Text style={styles.fieldLabel}>TO</Text>
              <Text style={styles.airportCode}>{flight.destination}</Text>
              <Text style={styles.cityName} numberOfLines={1}>{destCity}</Text>
              <Text style={styles.timeText}>{arrTime}</Text>
            </View>
          </View>

          {/* Bottom Info Grid: FLIGHT | CLASS | SEATS */}
          <View style={styles.infoGridRow}>
            <View style={styles.infoGridCol}>
              <Text style={styles.fieldLabel}>FLIGHT</Text>
              <Text style={styles.infoGridVal}>{flight.flightNumber || 'GA 159'}</Text>
            </View>
            <View style={styles.infoGridCol}>
              <Text style={styles.fieldLabel}>CLASS</Text>
              <Text style={styles.infoGridVal}>{flight.cabinClass || 'Economy'}</Text>
            </View>
            <View style={styles.infoGridCol}>
              <Text style={styles.fieldLabel}>SEATS</Text>
              <Text style={styles.infoGridVal}>
                {flight.availableSeats ? `${flight.availableSeats} left` : '30 left'}
              </Text>
            </View>
          </View>

          {/* Baggage Row */}
          <View style={styles.baggageRow}>
            <Text style={styles.baggageText}>🧳 {baggageText}</Text>
            {baggageTransferText ? (
              <Text style={styles.baggageTransferText}>{baggageTransferText}</Text>
            ) : null}
          </View>
        </View>

        {/* Perforation Divider Line */}
        <View testID="ticket-perforation-line" style={styles.perforationWrapper}>
          <View style={styles.perforationNotchTop} />
          <View style={styles.perforationDashedLine} />
          <View style={styles.perforationNotchBottom} />
        </View>

        {/* Right Stub (~28%) */}
        <View testID="flight-ticket-stub" style={styles.stubBody}>
          <View style={styles.stubFareGroup}>
            <Text style={styles.fieldLabel}>FARE</Text>
            <Text
              style={[styles.stubPriceText, isVnd && styles.stubPriceTextVnd]}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {displayPrice}
            </Text>
            <Text style={styles.stubPerPersonText}>per person</Text>
          </View>

          {/* Barcode Graphic */}
          <View testID="ticket-barcode-view" style={styles.barcodeBox}>
            <View style={styles.barcodeBarsRow}>
              {[2, 1, 3, 1, 2, 1, 1, 3, 2, 1, 2, 3, 1, 2, 1, 3, 2, 1, 2].map((w, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.barcodeBar,
                    { width: w, height: 28, backgroundColor: isDark ? '#E2E8F0' : '#0F172A' },
                  ]}
                />
              ))}
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function getStyles(themeColors, isDark) {
  const cardBg = isDark ? '#1C1D21' : '#FFFFFF';
  const headerBg = '#0E1B2C';
  const borderCol = isDark ? '#2A2D35' : '#E2E8F0';
  const textColor = isDark ? '#FFFFFF' : '#0F172A';
  const mutedColor = isDark ? '#94A3B8' : '#64748B';

  return StyleSheet.create({
    card: {
      backgroundColor: cardBg,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: borderCol,
      marginHorizontal: 0,
      marginVertical: 8,
      maxHeight: 240,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDark ? 0.35 : 0.08,
      shadowRadius: 12,
      elevation: 4,
    },
    // Header Strip (Dark Black)
    headerRow: {
      flexDirection: 'row',
      backgroundColor: headerBg,
      alignItems: 'stretch',
    },
    headerLeft: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 14,
      paddingVertical: 10,
      gap: 10,
    },
    carrierLogoImage: {
      width: 26,
      height: 26,
      borderRadius: 13,
      backgroundColor: '#FFFFFF',
    },
    carrierBadge: {
      width: 26,
      height: 26,
      borderRadius: 13,
      backgroundColor: '#1E293B',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#334155',
    },
    carrierBadgeText: {
      color: '#FFFFFF',
      fontSize: 10,
      fontWeight: '800',
    },
    airlineName: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '700',
      letterSpacing: 0.2,
    },
    flightMetaSub: {
      color: '#94A3B8',
      fontSize: 11,
      fontWeight: '500',
      marginTop: 1,
    },
    badge: {
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 6,
    },
    directBadge: {
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
    },
    stopsBadge: {
      backgroundColor: 'rgba(245, 158, 11, 0.2)',
    },
    badgeText: {
      fontSize: 10,
      fontWeight: '700',
    },
    directBadgeText: {
      color: '#F8FAFC',
    },
    stopsBadgeText: {
      color: '#FCD34D',
    },
    headerNotchDivider: {
      width: 1,
      backgroundColor: 'rgba(255, 255, 255, 0.12)',
    },
    headerRight: {
      width: 108,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 6,
      backgroundColor: '#0A131F',
    },
    dateHeaderText: {
      color: '#F1F5F9',
      fontSize: 11,
      fontWeight: '800',
      letterSpacing: 0.8,
    },

    // Body Row
    bodyRow: {
      flexDirection: 'row',
      backgroundColor: cardBg,
      position: 'relative',
    },
    mainBody: {
      flex: 1,
      paddingHorizontal: 14,
      paddingTop: 14,
      paddingBottom: 10,
    },

    // Route Row
    routeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    stationCol: {
      alignItems: 'flex-start',
      minWidth: 64,
    },
    fieldLabel: {
      fontSize: 9,
      fontWeight: '800',
      color: mutedColor,
      letterSpacing: 0.8,
      textTransform: 'uppercase',
      marginBottom: 2,
    },
    airportCode: {
      fontSize: 22,
      fontWeight: '800',
      color: textColor,
      letterSpacing: 0.5,
    },
    cityName: {
      fontSize: 11,
      fontWeight: '600',
      color: mutedColor,
      marginTop: 1,
      maxWidth: 80,
    },
    timeText: {
      fontSize: 12,
      fontWeight: '700',
      color: textColor,
      marginTop: 2,
    },

    // Trajectory Arc
    trajectoryCol: {
      flex: 1,
      alignItems: 'center',
      paddingHorizontal: 6,
    },
    durationText: {
      fontSize: 11,
      fontWeight: '700',
      color: isDark ? '#94A3B8' : '#334155',
      marginBottom: 4,
    },
    arcLineContainer: {
      width: '100%',
      height: 18,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
    },
    arcSvgCurve: {
      position: 'absolute',
      width: '100%',
      height: 1,
      borderStyle: 'dashed',
      borderWidth: 1,
      borderColor: isDark ? '#475569' : '#CBD5E1',
      top: 9,
    },
    planeIconWrapper: {
      backgroundColor: cardBg,
      paddingHorizontal: 4,
      zIndex: 2,
    },
    planeIcon: {
      fontSize: 13,
      color: textColor,
    },
    stopDotsContainer: {
      position: 'absolute',
      flexDirection: 'row',
      gap: 16,
      zIndex: 1,
    },
    stopDot: {
      width: 5,
      height: 5,
      borderRadius: 2.5,
      backgroundColor: '#F59E0B',
    },
    stopsSub: {
      fontSize: 9,
      fontWeight: '600',
      color: mutedColor,
      marginTop: 3,
    },

    // Info Grid Row
    infoGridRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      borderTopWidth: 1,
      borderTopColor: borderCol,
      paddingTop: 8,
      marginTop: 2,
    },
    infoGridCol: {
      flex: 1,
    },
    infoGridVal: {
      fontSize: 12,
      fontWeight: '700',
      color: textColor,
    },

    // Baggage Row
    baggageRow: {
      marginTop: 8,
      paddingTop: 6,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: borderCol,
    },
    baggageText: {
      fontSize: 10,
      color: mutedColor,
      fontWeight: '500',
    },
    baggageTransferText: {
      fontSize: 10,
      color: '#D97706',
      fontWeight: '600',
      marginTop: 2,
    },

    // Perforation Line with Notches
    perforationWrapper: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      right: 100,
      width: 16,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 5,
    },
    perforationNotchTop: {
      position: 'absolute',
      top: -8,
      width: 16,
      height: 16,
      borderRadius: 8,
      backgroundColor: isDark ? '#121316' : '#F8FAFC',
      zIndex: 6,
    },
    perforationDashedLine: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      width: 1,
      borderStyle: 'dashed',
      borderWidth: 1,
      borderColor: isDark ? '#334155' : '#CBD5E1',
      zIndex: 5,
    },
    perforationNotchBottom: {
      position: 'absolute',
      bottom: -8,
      width: 16,
      height: 16,
      borderRadius: 8,
      backgroundColor: isDark ? '#121316' : '#F8FAFC',
      zIndex: 6,
    },

    // Right Stub Body
    stubBody: {
      width: 108,
      paddingHorizontal: 6,
      paddingTop: 14,
      paddingBottom: 10,
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: isDark ? '#18191E' : '#FAFAFA',
    },
    stubFareGroup: {
      alignItems: 'center',
      width: '100%',
    },
    stubPriceText: {
      fontSize: 18,
      fontWeight: '900',
      color: textColor,
      marginTop: 2,
      textAlign: 'center',
    },
    stubPriceTextVnd: {
      fontSize: 14,
      fontWeight: '900',
      letterSpacing: -0.3,
    },
    stubPerPersonText: {
      fontSize: 9,
      color: mutedColor,
      fontWeight: '600',
      marginBottom: 6,
      textAlign: 'center',
    },
    barcodeBox: {
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 4,
    },
    barcodeBarsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      height: 30,
      gap: 2,
    },
    barcodeBar: {
      height: 28,
      borderRadius: 0.5,
    },
  });
}
