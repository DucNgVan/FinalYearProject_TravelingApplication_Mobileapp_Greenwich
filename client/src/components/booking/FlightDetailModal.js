import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { useThemeStore } from '../../stores/theme.store';
import colors from '../../theme/colors';

const FlightDetailModal = ({ visible, flight, onClose, onBookSandbox, onBook }) => {
  const { colors: themeColors } = useThemeStore();
  const styles = React.useMemo(() => getStyles(themeColors), [themeColors]);
  const [imgErr, setImgErr] = useState(false);

  if (!flight) return null;

  const isDirect = flight.stops === 0;
  const priceAmount = flight.price?.amount || 0;
  const formattedPrice = Number(priceAmount).toLocaleString('vi-VN') + '₫';
  const aircraft = flight.aircraft || (flight.flightNumber?.includes('VN-0240') ? 'Airbus A350-900' : 'Airbus A321');
  const cabinClass = flight.cabinMarketingName || flight.cabinClass || 'Economy';
  const carrierCode = (flight.airlineCode || flight.flightNumber?.slice(0, 2) || 'VN').toUpperCase();
  const logoUri = flight.airlineLogo || `https://images.kiwi.com/airlines/64x64/${carrierCode}.png`;
  const originAirport = flight.originAirportName || `${flight.origin} - International Airport`;
  const destAirport = flight.destinationAirportName || `${flight.destination} - International Airport`;
  const baggageSummary = flight.baggageSummary || (carrierCode === 'VN' ? '1 checked bag (23kg) • 1 carry-on (12kg)' : '1 carry-on (7kg)');

  // Format times
  const depTime = flight.departureTime ? flight.departureTime.slice(11, 16) : '07:00';
  const arrTime = flight.arrivalTime ? flight.arrivalTime.slice(11, 16) : '09:10';

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
        <View style={styles.sheetContainer}>
          {/* Grab Handle */}
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              {logoUri && !imgErr ? (
                <Image
                  source={{ uri: logoUri }}
                  style={styles.headerLogo}
                  resizeMode="contain"
                  onError={() => setImgErr(true)}
                />
              ) : null}
              <View style={{ flex: 1 }}>
                <View style={[styles.typeBadge, isDirect ? styles.directBadge : styles.transitBadge]}>
                  <Text style={[styles.typeBadgeText, isDirect ? styles.directText : styles.transitText]}>
                    {isDirect ? 'Direct' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''} (Connecting)`}
                  </Text>
                </View>
                <Text style={styles.airlineTitle}>{flight.airlineName} • {flight.flightNumber}</Text>
                <Text style={styles.aircraftSub}>{aircraft} • {cabinClass}</Text>
              </View>
            </View>
            <TouchableOpacity
              testID="close-flight-detail-btn"
              style={styles.closeBtn}
              onPress={onClose}
            >
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Timeline Route Card */}
            <View style={styles.timelineCard}>
              <View style={styles.timelineRow}>
                <View style={styles.dotBlue} />
                <View style={styles.timelineInfo}>
                  <View style={styles.timeRow}>
                    <Text style={styles.timeMain}>{depTime}</Text>
                    <Text style={styles.dateSub}>15 Th10, 2026</Text>
                  </View>
                  <Text style={styles.airportName}>{originAirport} ({flight.origin})</Text>
                </View>
              </View>

              {/* Transit alert if stops > 0 */}
              {!isDirect && (
                <View style={styles.transitBox}>
                  <Text style={styles.transitTitle}>⚠️ Layover {flight.stops} stop{flight.stops > 1 ? 's' : ''} ({flight.durationMinutes || 275}m)</Text>
                  <Text style={styles.transitSub}>
                    {flight.baggageTransfer || (flight.baggageTransferType === 'manual' ? '⚠️ Passengers must self-transfer baggage at layover' : '🔄 Checked baggage transferred automatically')}
                  </Text>
                </View>
              )}

              <View style={styles.timelineRow}>
                <View style={styles.dotBlack} />
                <View style={styles.timelineInfo}>
                  <View style={styles.timeRow}>
                    <Text style={styles.timeMain}>{arrTime}</Text>
                    <Text style={styles.dateSub}>15 Oct, 2026</Text>
                  </View>
                  <Text style={styles.airportName}>{destAirport} ({flight.destination})</Text>
                </View>
              </View>
            </View>

            {/* Rich Metadata: Baggage allowance and CO2 emissions */}
            <View style={styles.metaCard}>
              <Text style={styles.metaCardTitle}>Baggage & Included Services</Text>
              <Text style={styles.metaCardSub}>🧳 {baggageSummary}</Text>
              {flight.emissionsKg && (
                <Text style={styles.emissionsText}>🌱 Estimated emissions: {flight.emissionsKg} kg CO₂ / passenger</Text>
              )}
            </View>
          </ScrollView>

          {/* Footer with Price and Book Button */}
          <View style={styles.footer}>
            <View>
              <Text style={styles.priceLabel}>Sandbox Fare</Text>
              <Text style={styles.priceValue}>{formattedPrice}</Text>
            </View>
            <TouchableOpacity
              style={styles.bookBtn}
              activeOpacity={0.8}
              onPress={() => (onBookSandbox || onBook)?.(flight)}
            >
              <Text style={styles.bookBtnText}>Book Sandbox Ticket</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const getStyles = (colors) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
  },
  sheetContainer: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 20,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  headerLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerLogo: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  metaCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 14,
    marginTop: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  metaCardTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  metaCardSub: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '600',
  },
  emissionsText: {
    fontSize: 11,
    color: '#2E7D5B',
    fontWeight: '600',
    marginTop: 6,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  directBadge: {
    backgroundColor: '#ECFDF5',
  },
  transitBadge: {
    backgroundColor: '#FFFBEB',
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  directText: {
    color: '#2E7D5B',
  },
  transitText: {
    color: '#D97706',
  },
  airlineTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  aircraftSub: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textMuted,
  },
  content: {
    marginBottom: 16,
  },
  timelineCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  dotBlue: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
    marginTop: 4,
    marginRight: 12,
  },
  dotBlack: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.text,
    marginTop: 4,
    marginRight: 12,
  },
  timelineInfo: {
    flex: 1,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  timeMain: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
  },
  dateSub: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '600',
  },
  airportName: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
    fontWeight: '500',
  },
  transitBox: {
    marginVertical: 12,
    paddingLeft: 22,
    borderLeftWidth: 2,
    borderLeftColor: '#F59E0B',
    borderStyle: 'dashed',
  },
  transitTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#B45309',
  },
  transitSub: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  baggageGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  baggageBox: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  baggageLabel: {
    fontSize: 10,
    color: colors.textMuted,
    fontWeight: '600',
    marginBottom: 2,
  },
  baggageValue: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  priceLabel: {
    fontSize: 10,
    color: colors.textMuted,
    fontWeight: '600',
  },
  priceValue: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.primary,
  },
  bookBtn: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  bookBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
});

export default FlightDetailModal;
