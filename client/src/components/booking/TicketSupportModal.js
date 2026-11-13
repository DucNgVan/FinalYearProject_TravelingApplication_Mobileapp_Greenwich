import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useBookingStore } from '../../stores/booking.store';
import { useThemeStore } from '../../stores/theme.store';

export default function TicketSupportModal({
  visible,
  ticket,
  onClose,
  onSuccess,
}) {
  const { colors: themeColors, mode } = useThemeStore();
  const isDark = mode === 'dark';
  const styles = React.useMemo(() => getStyles(themeColors, isDark), [themeColors, isDark]);

  const [activeTab, setActiveTab] = useState('refund'); // 'refund' | 'change'
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionDone, setActionDone] = useState(null);

  if (!ticket) return null;

  const totalPaid = ticket.totalPrice || 2000000;
  const penalty = Math.round(totalPaid * 0.15); // 15% airline cancellation fee
  const netRefund = totalPaid - penalty;

  const handleConfirmRefund = () => {
    setIsProcessing(true);
    const complete = () => {
      useBookingStore.getState().refundTicket(ticket.id, netRefund, 'Customer initiated via Duffel API');
      setIsProcessing(false);
      setActionDone('refund');
      onSuccess?.({ type: 'refund', refundAmount: netRefund, ticketId: ticket.id });
    };

    if (process.env.NODE_ENV === 'test') {
      complete();
    } else {
      setTimeout(complete, 600);
    }
  };

  const handleConfirmChange = () => {
    setIsProcessing(true);
    const complete = () => {
      useBookingStore.getState().changeTicketFlight(ticket.id, {
        departureTime: '2026-10-18T09:30:00Z',
        flightNumber: `${ticket.airlineCode || 'VN'}-0882`,
      });
      setIsProcessing(false);
      setActionDone('change');
      onSuccess?.({ type: 'change', ticketId: ticket.id });
    };

    if (process.env.NODE_ENV === 'test') {
      complete();
    } else {
      setTimeout(complete, 600);
    }
  };

  const handleClose = () => {
    setActionDone(null);
    setIsProcessing(false);
    onClose?.();
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
            <View>
              <Text style={styles.title}>Ticket Support & Refunds</Text>
              <Text style={styles.subtitle}>Duffel Ticket Support & Refunds • PNR: {ticket.pnr || 'VN-8X2K9P'}</Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={handleClose}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Mode Switcher Tabs */}
          <View style={styles.segmentedContainer}>
            <TouchableOpacity
              style={[
                styles.segmentPill,
                activeTab === 'refund' && styles.segmentPillActive,
              ]}
              onPress={() => setActiveTab('refund')}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.segmentPillText,
                  activeTab === 'refund' ? styles.segmentPillTextActive : styles.segmentPillTextInactive,
                ]}
              >
                Cancel & Refund
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.segmentPill,
                activeTab === 'change' && styles.segmentPillActive,
              ]}
              onPress={() => setActiveTab('change')}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.segmentPillText,
                  activeTab === 'change' ? styles.segmentPillTextActive : styles.segmentPillTextInactive,
                ]}
              >
                Change Flight
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {actionDone ? (
              <View style={styles.successBox}>
                <Text style={styles.successIcon}>✓</Text>
                <Text style={styles.successTitle}>
                  {actionDone === 'refund' ? 'Refund Request Submitted Successfully!' : 'Flight Changed Successfully!'}
                </Text>
                <Text style={styles.successDesc}>
                  {actionDone === 'refund'
                    ? `Duffel API accepted refund request of ${netRefund.toLocaleString('en-US')} VND to your original payment method.`
                    : 'Your updated ticket is now active in your Nomadix account.'}
                </Text>
                <TouchableOpacity style={styles.doneBtn} onPress={handleClose}>
                  <Text style={styles.doneBtnText}>Done</Text>
                </TouchableOpacity>
              </View>
            ) : activeTab === 'refund' ? (
              <View style={styles.tabContent}>
                {/* Flight summary */}
                <View style={styles.ticketBriefCard}>
                  <Text style={styles.briefRoute}>
                    {ticket.origin} → {ticket.destination} ({ticket.airlineName || 'Vietnam Airlines'})
                  </Text>
                  <Text style={styles.briefFlightNum}>Flight: {ticket.flightNumber || 'VN-0240'}</Text>
                </View>

                {/* Refund Quote Breakdown */}
                <View style={styles.quoteCard}>
                  <Text style={styles.quoteTitle}>Refund Quote</Text>
                  <View style={styles.quoteRow}>
                    <Text style={styles.quoteLabel}>Total Fare Paid:</Text>
                    <Text style={styles.quoteVal}>{totalPaid.toLocaleString('en-US')} VND</Text>
                  </View>
                  <View style={styles.quoteRow}>
                    <Text style={styles.quoteLabel}>Airline Cancellation Fee (15%):</Text>
                    <Text style={[styles.quoteVal, { color: '#EF4444' }]}>
                      -{penalty.toLocaleString('en-US')} VND
                    </Text>
                  </View>
                  <View style={[styles.quoteRow, styles.quoteTotalRow]}>
                    <Text style={styles.quoteTotalLabel}>Net Refund Amount:</Text>
                    <Text style={styles.quoteTotalVal}>{netRefund.toLocaleString('en-US')} VND</Text>
                  </View>
                </View>

                <Text style={styles.policyNotice}>
                  ℹ️ In accordance with Duffel API & IATA policies, refunds will be credited to your original payment method within 3-5 business days.
                </Text>

                <TouchableOpacity
                  testID="btn-confirm-refund"
                  style={styles.actionBtn}
                  onPress={handleConfirmRefund}
                  disabled={isProcessing}
                  activeOpacity={0.8}
                >
                  {isProcessing ? (
                    <ActivityIndicator color={isDark ? '#111827' : '#FFFFFF'} />
                  ) : (
                    <Text style={styles.actionBtnText}>Confirm Cancellation & Refund</Text>
                  )}
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.tabContent}>
                <View style={styles.ticketBriefCard}>
                  <Text style={styles.briefRoute}>
                    {ticket.origin} → {ticket.destination}
                  </Text>
                  <Text style={styles.briefFlightNum}>Current Flight: {ticket.flightNumber} ({ticket.departureTime ? ticket.departureTime.slice(0, 10) : '2026-10-15'})</Text>
                </View>

                <View style={styles.quoteCard}>
                  <Text style={styles.quoteTitle}>Alternative Flight Proposal</Text>
                  <Text style={styles.quoteLabel}>Available replacement flight: VN-0882 (+3 days later)</Text>
                  <View style={styles.quoteRow}>
                    <Text style={styles.quoteLabel}>Fare Difference:</Text>
                    <Text style={[styles.quoteVal, { color: '#10B981' }]}>0 VND (Free 1st change)</Text>
                  </View>
                </View>

                <TouchableOpacity
                  testID="btn-confirm-change"
                  style={styles.actionBtn}
                  onPress={handleConfirmChange}
                  disabled={isProcessing}
                  activeOpacity={0.8}
                >
                  {isProcessing ? (
                    <ActivityIndicator color={isDark ? '#111827' : '#FFFFFF'} />
                  ) : (
                    <Text style={styles.actionBtnText}>Confirm Flight Change</Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const getStyles = (themeColors, isDark) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'flex-end',
    },
    backdrop: {
      flex: 1,
    },
    sheetContainer: {
      backgroundColor: isDark ? '#1C1D21' : '#FFFFFF',
      borderTopLeftRadius: 28,
      borderTopRightRadius: 28,
      paddingHorizontal: 20,
      paddingTop: 12,
      paddingBottom: 36,
      maxHeight: '85%',
    },
    handle: {
      width: 36,
      height: 4,
      borderRadius: 2,
      backgroundColor: isDark ? '#2A2D35' : '#E2E8F0',
      alignSelf: 'center',
      marginBottom: 12,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 14,
    },
    title: {
      fontSize: 16,
      fontWeight: '800',
      color: themeColors.text,
    },
    subtitle: {
      fontSize: 12,
      color: themeColors.textMuted,
      marginTop: 2,
    },
    closeBtn: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#F1F5F9',
      alignItems: 'center',
      justifyContent: 'center',
    },
    closeBtnText: {
      fontSize: 13,
      fontWeight: '700',
      color: themeColors.textMuted,
    },
    segmentedContainer: {
      flexDirection: 'row',
      backgroundColor: isDark ? '#121316' : '#EAECEF',
      borderRadius: 24,
      padding: 4,
      marginBottom: 16,
    },
    segmentPill: {
      flex: 1,
      paddingVertical: 10,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 20,
    },
    segmentPillActive: {
      backgroundColor: isDark ? '#FFFFFF' : '#111827',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    segmentPillText: {
      fontSize: 13,
      fontWeight: '700',
    },
    segmentPillTextActive: {
      color: isDark ? '#111827' : '#FFFFFF',
    },
    segmentPillTextInactive: {
      color: themeColors.textMuted,
    },
    content: {
      maxHeight: 400,
    },
    tabContent: {
      gap: 12,
    },
    ticketBriefCard: {
      backgroundColor: isDark ? '#25272C' : '#F8FAFC',
      padding: 14,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: isDark ? '#2E323B' : '#E2E8F0',
    },
    briefRoute: {
      fontSize: 15,
      fontWeight: '800',
      color: themeColors.text,
    },
    briefFlightNum: {
      fontSize: 12,
      color: themeColors.textMuted,
      marginTop: 4,
    },
    quoteCard: {
      backgroundColor: isDark ? '#25272C' : '#F8FAFC',
      padding: 14,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: isDark ? '#2E323B' : '#E2E8F0',
    },
    quoteTitle: {
      fontSize: 13,
      fontWeight: '800',
      color: themeColors.text,
      marginBottom: 10,
    },
    quoteRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    quoteLabel: {
      fontSize: 12,
      color: themeColors.textMuted,
    },
    quoteVal: {
      fontSize: 13,
      fontWeight: '700',
      color: themeColors.text,
    },
    quoteTotalRow: {
      borderTopWidth: 1,
      borderColor: isDark ? '#3A3F4D' : '#E2E8F0',
      paddingTop: 8,
      marginTop: 4,
    },
    quoteTotalLabel: {
      fontSize: 13,
      fontWeight: '800',
      color: themeColors.text,
    },
    quoteTotalVal: {
      fontSize: 15,
      fontWeight: '800',
      color: '#10B981',
    },
    policyNotice: {
      fontSize: 11,
      color: themeColors.textMuted,
      lineHeight: 16,
    },
    actionBtn: {
      backgroundColor: isDark ? '#FFFFFF' : '#111827',
      paddingVertical: 14,
      borderRadius: 16,
      alignItems: 'center',
      marginTop: 8,
      marginBottom: 16,
    },
    actionBtnText: {
      color: isDark ? '#111827' : '#FFFFFF',
      fontSize: 14,
      fontWeight: '700',
    },
    successBox: {
      alignItems: 'center',
      paddingVertical: 24,
    },
    successIcon: {
      fontSize: 36,
      color: '#10B981',
      marginBottom: 8,
    },
    successTitle: {
      fontSize: 16,
      fontWeight: '800',
      color: themeColors.text,
      marginBottom: 8,
    },
    successDesc: {
      fontSize: 13,
      color: themeColors.textMuted,
      textAlign: 'center',
      paddingHorizontal: 16,
      lineHeight: 20,
      marginBottom: 20,
    },
    doneBtn: {
      backgroundColor: isDark ? '#FFFFFF' : '#111827',
      paddingHorizontal: 32,
      paddingVertical: 12,
      borderRadius: 16,
    },
    doneBtnText: {
      color: isDark ? '#111827' : '#FFFFFF',
      fontWeight: '700',
      fontSize: 13,
    },
  });
