import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
import { useAuthStore } from '../../stores/auth.store';
import { useThemeStore } from '../../stores/theme.store';
import { ChevronLeftIcon, CheckIcon } from '../../components/common/NomadixIcons';
import { REDESIGN_THEME } from '../../theme/designTokens';

export default function AccountSettingsModal({ visible, onClose }) {
  const { user, updateProfile, changePassword } = useAuthStore();
  const { colors: themeColors, mode } = useThemeStore();
  const isDark = mode === 'dark';

  const [fullName, setFullName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setDateOfBirth(user.dateOfBirth || '');
      setPhone(user.phone || user.phoneNumber || '');
      setEmail(user.email || '');
    }
  }, [user, visible]);

  if (!visible) return null;

  const handleSave = async () => {
    if (newPassword && newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }

    if (updateProfile) {
      updateProfile({
        fullName,
        dateOfBirth,
        phone,
        phoneNumber: phone,
        email,
      });
    }

    if (newPassword && changePassword) {
      await changePassword(currentPassword, newPassword);
    }

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      if (onClose) onClose();
    }, 600);
  };

  const bg = isDark ? '#121316' : '#F8FAFC';
  const cardBg = isDark ? '#1C1D21' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : (REDESIGN_THEME.dark || '#0E1B2C');
  const textMuted = isDark ? '#94A3B8' : (REDESIGN_THEME.textMuted || '#5B6776');
  const borderColor = isDark ? '#2A2D35' : (REDESIGN_THEME.border || '#E3E6E0');
  const inputBg = isDark ? '#121316' : '#FAFAFA';

  return (
    <View testID="subscreen-account" style={[styles.container, { backgroundColor: bg }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          testID="btn-close-account-settings"
          onPress={onClose}
          style={[styles.backBtn, { backgroundColor: isDark ? '#1C1D21' : '#FFFFFF', borderColor }]}
          activeOpacity={0.7}
        >
          <ChevronLeftIcon size={20} color={textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: textColor }]}>Account Settings</Text>
        <View style={{ width: 44 }} />
      </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {user?.avatarUrl ? (
            <View testID="account-settings-avatar-row" style={[styles.avatarHeaderCard, { backgroundColor: cardBg, borderColor }]}>
              <Image testID="account-settings-avatar-img" source={{ uri: user.avatarUrl }} style={styles.avatarImgPreview} resizeMode="cover" />
              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={[styles.avatarNameText, { color: textColor }]}>{fullName || user.fullName}</Text>
                <Text style={[styles.avatarBadgeText, { color: '#0B7A75' }]}>✓ Google Account Verified</Text>
              </View>
            </View>
          ) : null}

          {/* Section: Profile Information */}
          <Text style={[styles.sectionTitle, { color: textMuted }]}>PROFILE INFORMATION</Text>
          <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: textMuted }]}>Full Name</Text>
              <TextInput
                style={[styles.input, { backgroundColor: inputBg, color: textColor, borderColor }]}
                value={fullName}
                onChangeText={setFullName}
                placeholder="Enter your full name"
                placeholderTextColor={textMuted}
              />
            </View>

            <View style={[styles.inputGroup, { marginTop: 14 }]}>
              <Text style={[styles.label, { color: textMuted }]}>Date of Birth</Text>
              <TextInput
                style={[styles.input, { backgroundColor: inputBg, color: textColor, borderColor }]}
                value={dateOfBirth}
                onChangeText={setDateOfBirth}
                placeholder="DD/MM/YYYY"
                placeholderTextColor={textMuted}
              />
            </View>
          </View>

          {/* Section: Contact Details */}
          <Text style={[styles.sectionTitle, { color: textMuted }]}>CONTACT DETAILS</Text>
          <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: textMuted }]}>Phone Number</Text>
              <TextInput
                style={[styles.input, { backgroundColor: inputBg, color: textColor, borderColor }]}
                value={phone}
                onChangeText={setPhone}
                placeholder="Enter phone number"
                keyboardType="phone-pad"
                placeholderTextColor={textMuted}
              />
            </View>

            <View style={[styles.inputGroup, { marginTop: 14 }]}>
              <Text style={[styles.label, { color: textMuted }]}>Email Address</Text>
              <TextInput
                style={[styles.input, { backgroundColor: inputBg, color: textColor, borderColor }]}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor={textMuted}
              />
            </View>
          </View>

          {/* Section: Security */}
          <Text style={[styles.sectionTitle, { color: textMuted }]}>SECURITY</Text>
          <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: textMuted }]}>Current Password</Text>
              <TextInput
                style={[styles.input, { backgroundColor: inputBg, color: textColor, borderColor }]}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder="Current password"
                secureTextEntry
                placeholderTextColor={textMuted}
              />
            </View>

            <View style={[styles.inputGroup, { marginTop: 14 }]}>
              <Text style={[styles.label, { color: textMuted }]}>New Password</Text>
              <TextInput
                style={[styles.input, { backgroundColor: inputBg, color: textColor, borderColor }]}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="New password (min 8 characters)"
                secureTextEntry
                placeholderTextColor={textMuted}
              />
            </View>

            <View style={[styles.inputGroup, { marginTop: 14 }]}>
              <Text style={[styles.label, { color: textMuted }]}>Confirm New Password</Text>
              <TextInput
                style={[styles.input, { backgroundColor: inputBg, color: textColor, borderColor }]}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm new password"
                secureTextEntry
                placeholderTextColor={textMuted}
              />
            </View>
          </View>

          {/* Save Button */}
          <TouchableOpacity
            testID="btn-save-account-settings"
            style={[
              styles.saveBtn,
              { backgroundColor: savedSuccess ? '#059669' : (REDESIGN_THEME.teal || '#0B7A75') },
            ]}
            onPress={handleSave}
            activeOpacity={0.8}
          >
            {savedSuccess ? (
              <View style={styles.btnRow}>
                <CheckIcon size={20} color="#FFFFFF" />
                <Text style={styles.saveBtnText}>Changes Saved</Text>
              </View>
            ) : (
              <Text style={styles.saveBtnText}>Save Changes</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  header: {
    height: 56,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  avatarHeaderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginTop: 12,
    marginBottom: 4,
  },
  avatarImgPreview: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  avatarNameText: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  avatarBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginTop: 22,
    marginBottom: 8,
    paddingLeft: 4,
  },
  card: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
  },
  inputGroup: {
    width: '100%',
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
  },
  input: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 14,
    fontWeight: '500',
  },
  saveBtn: {
    height: 54,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 28,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  btnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
