import React from 'react';
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

const BoardingPassModal = ({ visible, ticket, onClose, onOpenSupport }) => {
  const { colors: themeColors, mode } = useThemeStore();
  const isDark = mode === 'dark';
  const styles = React.useMemo(() => getStyles(themeColors, isDark), [themeColors, isDark]);

  if (!ticket) return null;

  const depTime = ticket.departureTime ? ticket.departureTime.slice(11, 16) : '07:00';
  const arrTime = ticket.arrivalTime ? ticket.arrivalTime.slice(11, 16) : '09:10';
  const carrierCode = (ticket.airlineCode || ticket.flightNumber?.slice(0, 2) || 'VN').toUpperCase();
  const logoUri = ticket.airlineLogo || `https://images.kiwi.com/airlines/64x64/${carrierCode}.png`;

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
        <View style={styles.cardContainer}>
          {/* Card Top: Header */}
          <View style={styles.cardHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Image source={{ uri: logoUri }} style={styles.headerLogo} resizeMode="contain" />
              <View>
                <Text style={styles.headerSubtitle}>ELECTRONIC BOARDING PASS</Text>
                <Text style={styles.airlineName}>{ticket.airlineName || 'Vietnam Airlines'}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Route Section */}
          <View style={styles.routeSection}>
            <View style={styles.airportCol}>
              <Text style={styles.cityCode}>{ticket.origin || 'SGN'}</Text>
              <Text style={styles.cityName}>Ho Chi Minh City</Text>
              <Text style={styles.flightTime}>{depTime}</Text>
            </View>

            <View style={styles.flightPathCol}>
              <Text style={styles.durationBadge}>{ticket.durationMinutes ? `${Math.floor(ticket.durationMinutes/60)}h ${ticket.durationMinutes%60}m` : '2h 10m'}</Text>
              <View style={styles.flightLine}>
                <Text style={styles.planeIcon}>✈</Text>
              </View>
              <Text style={styles.flightNumText}>{ticket.flightNumber || 'VN-0240'}</Text>
            </View>

            <View style={[styles.airportCol, { alignItems: 'flex-end' }]}>
              <Text style={styles.cityCode}>{ticket.destination || 'HAN'}</Text>
              <Text style={styles.cityName}>Hanoi</Text>
              <Text style={styles.flightTime}>{arrTime}</Text>
            </View>
          </View>

          {/* Passenger Details Grid */}
          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>PASSENGER</Text>
              <Text style={styles.detailValue}>{ticket.passenger?.fullName || 'John Doe'}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>SEAT</Text>
              <Text style={[styles.detailValue, styles.seatHighlight]}>
                {ticket.seat?.code || (ticket.seat && typeof ticket.seat === 'string' ? ticket.seat : '12A')}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>CABIN CLASS</Text>
              <Text style={styles.detailValue}>{ticket.cabinClass || 'Economy'}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>BOOKING CODE (PNR)</Text>
              <Text style={[styles.detailValue, styles.pnrHighlight]}>{ticket.pnr || 'VN-8X2K9P'}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>GATE</Text>
              <Text style={styles.detailValue}>Terminal 1 • Gate 04</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>STATUS</Text>
              <Text style={[styles.detailValue, ticket.status === 'REFUNDED' ? { color: '#EF4444' } : null]}>
                {ticket.status || 'CONFIRMED'}
              </Text>
            </View>
          </View>

          {/* Perforated Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.cutoutLeft} />
            <View style={styles.dashedLine} />
            <View style={styles.cutoutRight} />
          </View>

          {/* Barcode & E-ticket */}
          <View style={styles.barcodeSection}>
            <View style={styles.simulatedBarcode}>
              {Array.from({ length: 32 }).map((_, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.bar,
                    {
                      width: idx % 3 === 0 ? 3 : idx % 2 === 0 ? 2 : 1,
                      backgroundColor: idx % 5 === 0 ? '#FFFFFF' : '#1C1C1E',
                    },
                  ]}
                />
              ))}
            </View>
            <Text style={styles.eTicketText}>E-TICKET NUMBER: {ticket.ticketNumber || '738-2491048291'}</Text>
          </View>

          {/* Support / Change & Refund Link */}
          <TouchableOpacity
            testID="boarding-pass-support-btn"
            style={styles.supportBtn}
            onPress={() => onOpenSupport?.(ticket)}
            activeOpacity={0.8}
          >
            <Text style={styles.supportBtnText}>Need support?</Text>
          </TouchableOpacity>

          {/* Close Action */}
          <TouchableOpacity style={styles.doneBtn} onPress={onClose}>
            <Text style={styles.doneBtnText}>Close Boarding Pass</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const getStyles = (colors) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  cardContainer: {
    width: '100%',
    backgroundColor: colors.card,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  cardHeader: {
    backgroundColor: '#007AFF',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLogo: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 10,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.8)',
    letterSpacing: 1,
  },
  airlineName: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 2,
  },
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  routeSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.card,
  },
  airportCol: {
    flex: 1,
  },
  cityCode: {
    fontSize: 26,
    fontWeight: '900',
    color: colors.text,
  },
  cityName: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '600',
    marginTop: 2,
  },
  flightTime: {
    fontSize: 14,
    fontWeight: '800',
    color: '#007AFF',
    marginTop: 4,
  },
  flightPathCol: {
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  durationBadge: {
    fontSize: 10,
    color: colors.textMuted,
    fontWeight: '700',
    marginBottom: 4,
  },
  flightLine: {
    width: 60,
    height: 1,
    backgroundColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  planeIcon: {
    fontSize: 11,
    color: '#007AFF',
    backgroundColor: colors.card,
    paddingHorizontal: 2,
  },
  flightNumText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.text,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 12,
  },
  detailItem: {
    width: '46%',
  },
  detailLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 0.5,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    marginTop: 2,
  },
  pnrHighlight: {
    color: '#007AFF',
    fontWeight: '900',
  },
  seatHighlight: {
    color: '#10B981',
    fontWeight: '900',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    marginVertical: 4,
  },
  cutoutLeft: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    marginLeft: -10,
  },
  cutoutRight: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    marginRight: -10,
  },
  dashedLine: {
    flex: 1,
    height: 1,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderStyle: 'dashed',
  },
  barcodeSection: {
    alignItems: 'center',
    padding: 20,
  },
  simulatedBarcode: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    gap: 2,
    marginBottom: 8,
  },
  bar: {
    height: '100%',
  },
  eTicketText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#8E8E93',
    letterSpacing: 0.5,
  },
  supportBtn: {
    marginHorizontal: 16,
    marginBottom: 8,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(10, 132, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  supportBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#007AFF',
  },
  doneBtn: {
    margin: 16,
    backgroundColor: '#F2F2F7',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
  },
  doneBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1C1C1E',
  },
});

export default BoardingPassModal;
