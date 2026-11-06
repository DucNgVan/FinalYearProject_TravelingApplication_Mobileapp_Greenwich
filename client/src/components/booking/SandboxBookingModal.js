import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useBookingStore } from '../../stores/booking.store';
import { useThemeStore } from '../../stores/theme.store';
import SeatMapSelector from './SeatMapSelector';

const ANCILLARY_OPTIONS = [
  { id: 'baggage-20kg', name: '+20kg Ký gửi', desc: 'Duffel checked bag', price: 250000, icon: '🧳' },
  { id: 'meal-chicken', name: 'Suất ăn nóng', desc: 'Cơm gà dầu hào', price: 95000, icon: '🍱' },
  { id: 'priority-checkin', name: 'Ưu tiên', desc: 'Priority check-in', price: 120000, icon: '⚡' },
];

const SandboxBookingModal = ({ visible, flight, onClose, onBookingSuccess }) => {
  const { colors: themeColors, mode } = useThemeStore();
  const isDark = mode === 'dark';
  const styles = React.useMemo(() => getStyles(themeColors, isDark), [themeColors, isDark]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [successResult, setSuccessResult] = useState(null);

  // Flight Add-ons & Seat selection
  const [selectedSeat, setSelectedSeat] = useState({ code: '12A', type: 'Window', surcharge: 0 });
  const [selectedAncillaries, setSelectedAncillaries] = useState([]);
  const [isSeatMapVisible, setIsSeatMapVisible] = useState(false);

  if (!flight) return null;

  const basePrice = flight.price?.amount || 0;
  const ancillariesTotal = selectedAncillaries.reduce((sum, item) => sum + item.price, 0);
  const seatSurcharge = selectedSeat?.surcharge || 0;
  const totalAmount = basePrice + ancillariesTotal + seatSurcharge;
  const formattedPrice = Number(totalAmount).toLocaleString('vi-VN') + '₫';

  const carrierCode = (flight.airlineCode || flight.flightNumber?.slice(0, 2) || 'VN').toUpperCase();
  const logoUri = flight.airlineLogo || `https://images.kiwi.com/airlines/64x64/${carrierCode}.png`;

  const toggleAncillary = (item) => {
    if (selectedAncillaries.find((a) => a.id === item.id)) {
      setSelectedAncillaries((prev) => prev.filter((a) => a.id !== item.id));
    } else {
      setSelectedAncillaries((prev) => [...prev, item]);
    }
  };

  const handleConfirm = () => {
    setIsProcessing(true);

    const completeBooking = () => {
      const passenger = {
        fullName: 'John Doe',
        documentId: 'C01928491',
        email: 'traveler@example.com',
      };

      const result = useBookingStore.getState().bookFlightSandbox(
        flight,
        passenger,
        selectedSeat,
        selectedAncillaries,
        totalAmount
      );
      setIsProcessing(false);
      setSuccessResult(result);
      if (onBookingSuccess) {
        onBookingSuccess(result);
      }
    };

    if (process.env.NODE_ENV === 'test') {
      completeBooking();
    } else {
      setTimeout(completeBooking, 800);
    }
  };

  const handleClose = () => {
    setSuccessResult(null);
    setIsProcessing(false);
    setSelectedAncillaries([]);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={handleClose} />
        <View style={styles.sheetContainer}>
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <View style={styles.iconCircle}>
                <Text style={styles.iconFlask}>🧪</Text>
              </View>
              <View>
                <Text style={styles.headerTitle}>Duffel API Sandbox Payment</Text>
                <Text style={styles.headerSub}>Automatically saved to your account</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={handleClose}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Body: Form or Success */}
          {!successResult ? (
            <View style={styles.content}>
              {/* Flight Summary Card with Logo */}
              <View style={styles.flightBriefCard}>
                <Image source={{ uri: logoUri }} style={styles.briefLogo} resizeMode="contain" />
                <View style={{ flex: 1 }}>
                  <Text style={styles.briefAirline}>{flight.airlineName} • {flight.flightNumber}</Text>
                  <Text style={styles.briefRoute}>
                    {flight.origin} → {flight.destination} • {flight.aircraft || 'Airbus A321'}
                  </Text>
                </View>
              </View>

              {/* Passenger Confirmation Card */}
              <View style={styles.passengerCard}>
                <Text style={styles.cardLabel}>CONFIRMED PASSENGER</Text>
                <View style={styles.passengerRow}>
                  <Text style={styles.passengerName}>John Doe (Mr)</Text>
                  <Text style={styles.passengerDob}>15/10/2002</Text>
                </View>
                <Text style={styles.passengerSub}>ID: C01928491 • Email: traveler@example.com</Text>
              </View>

              {/* Add-on Ancillaries & Seat Selection */}
              <View style={styles.ancillaryCard}>
                <View style={styles.ancillaryHeader}>
                  <Text style={styles.ancillaryTitle}>Dịch vụ mua thêm (Add-on Services)</Text>
                  <TouchableOpacity
                    testID="btn-open-seatmap"
                    style={styles.seatPillSmall}
                    onPress={() => setIsSeatMapVisible(true)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.seatPillSmallText}>💺 Ghế: {selectedSeat.code}</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.ancillariesList}>
                  {ANCILLARY_OPTIONS.map((item) => {
                    const isSelected = !!selectedAncillaries.find((a) => a.id === item.id);
                    return (
                      <TouchableOpacity
                        key={item.id}
                        testID={`ancillary-${item.id}`}
                        style={[styles.ancillaryOption, isSelected && styles.ancillaryOptionActive]}
                        onPress={() => toggleAncillary(item)}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.ancillaryIcon}>{item.icon}</Text>
                        <View style={{ flex: 1 }}>
                          <Text style={[styles.ancillaryName, isSelected && styles.ancillaryNameActive]}>
                            {item.name}
                          </Text>
                          <Text style={styles.ancillaryDesc}>{item.desc}</Text>
                        </View>
                        <Text style={[styles.ancillaryPrice, isSelected && styles.ancillaryPriceActive]}>
                          +{item.price.toLocaleString('vi-VN')}₫
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Duffel Balance Indicator */}
              <View style={styles.balanceCard}>
                <View style={styles.balanceHeader}>
                  <Text style={styles.balanceTitle}>Duffel Sandbox Test Balance</Text>
                  <View style={styles.readyBadge}>
                    <Text style={styles.readyBadgeText}>Ready</Text>
                  </View>
                </View>
                <Text style={styles.balanceAmount}>Available balance: 50,000,000₫ (100% Free Sandbox)</Text>
              </View>

              {/* Price summary */}
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Total payment amount:</Text>
                <Text style={styles.priceTotal}>{formattedPrice}</Text>
              </View>

              {/* Action Button */}
              <TouchableOpacity
                style={[styles.payBtn, isProcessing && styles.payBtnDisabled]}
                disabled={isProcessing}
                onPress={handleConfirm}
              >
                {isProcessing ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.payBtnText}>Confirm Booking & Save to Account</Text>
                )}
              </TouchableOpacity>
            </View>
          ) : (
            /* Success Screen */
            <View style={styles.successContent}>
              <View style={styles.successCheckCircle}>
                <Text style={styles.successCheckIcon}>✓</Text>
              </View>
              <Text style={styles.successHeading}>Booking Confirmed Successfully!</Text>
              <Text style={styles.successSub}>
                Ticket has been saved directly to your <Text style={{ fontWeight: '800' }}>Profile</Text>
              </Text>

              <View style={styles.ticketResultCard}>
                <View style={styles.ticketResultHeader}>
                  <View>
                    <Text style={styles.pnrLabel}>BOOKING REFERENCE (PNR)</Text>
                    <Text style={styles.pnrValue}>{successResult.pnr}</Text>
                  </View>
                  <View style={styles.savedBadge}>
                    <Text style={styles.savedBadgeText}>Saved to Profile</Text>
                  </View>
                </View>

                <View style={styles.ticketResultBody}>
                  <View style={styles.ticketRow}>
                    <Text style={styles.ticketSubLabel}>E-Ticket Number:</Text>
                    <Text style={styles.ticketSubValue}>{successResult.ticketNumber}</Text>
                  </View>
                  <View style={styles.ticketRow}>
                    <Text style={styles.ticketSubLabel}>Flight:</Text>
                    <Text style={styles.ticketSubValue}>{flight.airlineName} ({flight.flightNumber})</Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity style={styles.doneBtn} onPress={handleClose}>
                <Text style={styles.doneBtnText}>Done</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      <SeatMapSelector
        visible={isSeatMapVisible}
        selectedSeatCode={selectedSeat?.code}
        onSelectSeat={(st) => setSelectedSeat(st)}
        onClose={() => setIsSeatMapVisible(false)}
        aircraft={flight.aircraft}
      />
    </Modal>
  );
};

const getStyles = (colors, isDark) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
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
    maxHeight: '90%',
  },
  ancillaryCard: {
    backgroundColor: isDark ? '#1C1D21' : '#F8FAFC',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: isDark ? '#2A2D35' : '#E2E8F0',
    marginBottom: 10,
  },
  ancillaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  ancillaryTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.text,
  },
  seatPillSmall: {
    backgroundColor: isDark ? '#FFFFFF' : '#111827',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  seatPillSmallText: {
    fontSize: 11,
    fontWeight: '700',
    color: isDark ? '#111827' : '#FFFFFF',
  },
  ancillariesList: {
    gap: 6,
  },
  ancillaryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: isDark ? '#25272C' : '#FFFFFF',
    borderWidth: 1,
    borderColor: isDark ? '#323640' : '#E2E8F0',
    gap: 8,
  },
  ancillaryOptionActive: {
    borderColor: isDark ? '#FFFFFF' : '#111827',
    backgroundColor: isDark ? '#2E323B' : '#F1F5F9',
  },
  ancillaryIcon: {
    fontSize: 16,
  },
  ancillaryName: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
  },
  ancillaryNameActive: {
    fontWeight: '800',
  },
  ancillaryDesc: {
    fontSize: 10,
    color: colors.textMuted,
  },
  ancillaryPrice: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textMuted,
  },
  ancillaryPriceActive: {
    color: isDark ? '#FFFFFF' : '#111827',
    fontWeight: '800',
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
    alignItems: 'center',
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconFlask: {
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
  },
  headerSub: {
    fontSize: 11,
    color: '#2E7D5B',
    fontWeight: '700',
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
    paddingVertical: 14,
  },
  flightBriefCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  briefLogo: {
    width: 36,
    height: 36,
    borderRadius: 8,
  },
  briefAirline: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.text,
  },
  briefRoute: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '600',
    marginTop: 2,
  },
  passengerCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  cardLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  passengerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  passengerName: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.text,
  },
  passengerDob: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '600',
  },
  passengerSub: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  balanceCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#2E7D5B',
    marginBottom: 14,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  balanceTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#2E7D5B',
  },
  readyBadge: {
    backgroundColor: '#2E7D5B',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  readyBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  balanceAmount: {
    fontSize: 11,
    color: '#4B5563',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    marginBottom: 14,
  },
  priceLabel: {
    fontSize: 13,
    color: '#495057',
  },
  priceTotal: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1C1C1E',
  },
  payBtn: {
    backgroundColor: '#2E7D5B',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#2E7D5B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  payBtnDisabled: {
    opacity: 0.7,
  },
  payBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  successContent: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  successCheckCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  successCheckIcon: {
    fontSize: 28,
    fontWeight: '900',
    color: '#2E7D5B',
  },
  successHeading: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.text,
  },
  successSub: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
    marginBottom: 16,
  },
  ticketResultCard: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  ticketResultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  pnrLabel: {
    fontSize: 10,
    color: colors.textMuted,
    fontWeight: '800',
  },
  pnrValue: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.primary,
    letterSpacing: 1,
  },
  savedBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  savedBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#2E7D5B',
  },
  ticketResultBody: {
    paddingTop: 8,
    gap: 4,
  },
  ticketRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ticketSubLabel: {
    fontSize: 11,
    color: colors.textMuted,
  },
  ticketSubValue: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.text,
  },
  doneBtn: {
    width: '100%',
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
  },
  doneBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});

export default SandboxBookingModal;
