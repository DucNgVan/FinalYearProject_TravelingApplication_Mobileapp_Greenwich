import React, { useState, useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useThemeStore } from '../../stores/theme.store';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

export default function OtpVerificationModal({
  visible,
  identifier = '',
  onClose,
  onVerify,
  onResend,
  isLoading = false,
  error = '',
  devOtp = '123456',
  initialCooldown = 60,
  channel = 'email',
  onChannelChange,
}) {
  const effectiveDevOtp = devOtp || '123456';
  const { colors: themeColors } = useThemeStore();
  const styles = React.useMemo(() => getStyles(themeColors), [themeColors]);

  const [otp, setOtp] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [cooldown, setCooldown] = useState(initialCooldown);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!visible) return;

    setOtp('');
    setTimeLeft(300);
    setCooldown(initialCooldown);

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [visible, initialCooldown]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVerify = () => {
    if (otp.length === 6 && onVerify) {
      onVerify(otp);
    }
  };

  const handleResend = () => {
    if (cooldown === 0 && onResend) {
      setCooldown(60);
      setTimeLeft(300);
      onResend();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      testID="otp-verification-modal"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconCircle}>
              <Text style={styles.iconText}>🔐</Text>
            </View>
            <Text style={styles.title}>Account Verification</Text>
            <Text style={styles.subtitle}>
              A 6-digit verification code has been sent to:
            </Text>
            <Text style={styles.identifierText}>{identifier}</Text>

            {/* Verification Channel Switcher in Modal */}
            <View style={styles.modalChannelGroup}>
              <TouchableOpacity
                testID="channel-email-btn"
                style={[
                  styles.modalChannelBtn,
                  channel === 'email' && styles.modalChannelBtnActive,
                ]}
                onPress={() => onChannelChange && onChannelChange('email')}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.modalChannelBtnText,
                    channel === 'email' && styles.modalChannelBtnTextActive,
                  ]}
                >
                  ✉️ Email
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                testID="channel-phone-btn"
                style={[
                  styles.modalChannelBtn,
                  channel === 'phone' && styles.modalChannelBtnActive,
                ]}
                onPress={() => onChannelChange && onChannelChange('phone')}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.modalChannelBtnText,
                    channel === 'phone' && styles.modalChannelBtnTextActive,
                  ]}
                >
                  📱 SMS
                </Text>
              </TouchableOpacity>
            </View>

            {effectiveDevOtp ? (
              <TouchableOpacity
                testID="otp-autofill-banner"
                style={styles.devBanner}
                onPress={() => setOtp(effectiveDevOtp)}
                activeOpacity={0.8}
              >
                <Text style={styles.devBannerText}>⚡ [DEMO OTP]: {effectiveDevOtp} (Tap to auto-fill)</Text>
              </TouchableOpacity>
            ) : null}
          </View>

          {/* Hidden text input overlayed with 6 visual cells */}
          <View style={styles.otpContainer}>
            <TextInput
              ref={inputRef}
              testID="otp-input"
              value={otp}
              onChangeText={(val) => {
                const clean = val.replace(/\D/g, '').slice(0, 6);
                setOtp(clean);
                if (clean.length === 6) {
                  // Auto submit on 6th digit
                }
              }}
              keyboardType="number-pad"
              maxLength={6}
              style={styles.hiddenInput}
              autoFocus
            />

            <View style={styles.cellRow}>
              {[0, 1, 2, 3, 4, 5].map((index) => {
                const digit = otp[index] || '';
                const isFocused = otp.length === index;
                return (
                  <TouchableOpacity
                    key={index}
                    activeOpacity={1}
                    onPress={() => inputRef.current?.focus()}
                    style={[
                      styles.cell,
                      isFocused && styles.cellFocused,
                      digit && styles.cellFilled,
                    ]}
                  >
                    <Text style={styles.cellText}>{digit}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Error Message */}
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {/* Timer & Cooldown */}
          <View style={styles.timerRow}>
            <Text style={styles.timerText}>
              ⏱️ Expires in: {formatTime(timeLeft)}
            </Text>
            <TouchableOpacity
              testID="otp-resend-btn"
              onPress={handleResend}
              disabled={cooldown > 0}
              style={styles.resendBtn}
            >
              <Text
                style={[
                  styles.resendText,
                  cooldown > 0 && styles.resendDisabledText,
                ]}
              >
                {cooldown > 0 ? `Resend in (${cooldown}s)` : 'Resend Code'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Action Buttons */}
          <View style={styles.btnRow}>
            <TouchableOpacity
              testID="otp-close-btn"
              style={styles.cancelBtn}
              onPress={onClose}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              testID="otp-submit-btn"
              style={[
                styles.submitBtn,
                (otp.length !== 6 || isLoading) && styles.submitBtnDisabled,
              ]}
              onPress={handleVerify}
              disabled={otp.length !== 6 || isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.submitBtnText}>Confirm</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function getStyles(themeColors) {
  return StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    card: {
      width: '100%',
      maxWidth: 380,
      backgroundColor: themeColors.card || '#FFFFFF',
      borderRadius: 24,
      padding: 24,
      borderWidth: 1,
      borderColor: themeColors.border || '#E2E8F0',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.3,
      shadowRadius: 20,
      elevation: 10,
    },
    header: {
      alignItems: 'center',
      marginBottom: 20,
    },
    iconCircle: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: themeColors.primaryLight || '#F0FDF4',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
    },
    iconText: {
      fontSize: 26,
    },
    title: {
      fontSize: 20,
      fontWeight: '700',
      color: themeColors.text || '#0F172A',
      marginBottom: 6,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 13,
      color: themeColors.textMuted || '#64748B',
      textAlign: 'center',
    },
    identifierText: {
      fontSize: 14,
      fontWeight: '600',
      color: themeColors.primary || '#2E7D5B',
      marginTop: 2,
      textAlign: 'center',
    },
    modalChannelGroup: {
      flexDirection: 'row',
      gap: 8,
      marginTop: 8,
      marginBottom: 4,
    },
    modalChannelBtn: {
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: themeColors.border || '#E2E8F0',
      backgroundColor: themeColors.background || '#F8FAFC',
    },
    modalChannelBtnActive: {
      backgroundColor: themeColors.primary || '#2E7D5B',
      borderColor: themeColors.primary || '#2E7D5B',
    },
    modalChannelBtnText: {
      fontSize: 11,
      fontWeight: '600',
      color: themeColors.textMuted || '#64748B',
    },
    modalChannelBtnTextActive: {
      color: '#FFFFFF',
      fontWeight: '700',
    },
    devBanner: {
      marginTop: 8,
      backgroundColor: '#FEF3C7',
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#F59E0B',
    },
    devBannerText: {
      fontSize: 12,
      fontWeight: '700',
      color: '#92400E',
    },
    otpContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 14,
    },
    hiddenInput: {
      position: 'absolute',
      width: 1,
      height: 1,
      opacity: 0,
    },
    cellRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      gap: 8,
    },
    cell: {
      flex: 1,
      height: 52,
      borderRadius: 14,
      borderWidth: 1.5,
      borderColor: themeColors.border || '#CBD5E1',
      backgroundColor: themeColors.background || '#F8FAFC',
      justifyContent: 'center',
      alignItems: 'center',
    },
    cellFocused: {
      borderColor: themeColors.primary || '#2E7D5B',
      backgroundColor: themeColors.card || '#FFFFFF',
      borderWidth: 2,
    },
    cellFilled: {
      borderColor: themeColors.primary || '#2E7D5B',
    },
    cellText: {
      fontSize: 22,
      fontWeight: '700',
      color: themeColors.text || '#0F172A',
    },
    errorText: {
      fontSize: 13,
      color: colors.error || '#EF4444',
      textAlign: 'center',
      marginBottom: 10,
    },
    timerRow: {
      alignItems: 'center',
      marginBottom: 20,
    },
    timerText: {
      fontSize: 12,
      color: themeColors.textMuted || '#64748B',
      marginBottom: 6,
    },
    resendBtn: {
      paddingVertical: 4,
    },
    resendText: {
      fontSize: 13,
      fontWeight: '600',
      color: themeColors.primary || '#2E7D5B',
    },
    resendDisabledText: {
      color: themeColors.textMuted || '#94A3B8',
    },
    btnRow: {
      flexDirection: 'row',
      gap: 12,
    },
    cancelBtn: {
      flex: 1,
      height: 48,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: themeColors.border || '#CBD5E1',
      justifyContent: 'center',
      alignItems: 'center',
    },
    cancelBtnText: {
      fontSize: 15,
      fontWeight: '600',
      color: themeColors.textMuted || '#64748B',
    },
    submitBtn: {
      flex: 2,
      height: 48,
      borderRadius: 16,
      backgroundColor: themeColors.primary || '#2E7D5B',
      justifyContent: 'center',
      alignItems: 'center',
    },
    submitBtnDisabled: {
      opacity: 0.5,
    },
    submitBtnText: {
      fontSize: 15,
      fontWeight: '700',
      color: '#FFFFFF',
    },
  });
}
