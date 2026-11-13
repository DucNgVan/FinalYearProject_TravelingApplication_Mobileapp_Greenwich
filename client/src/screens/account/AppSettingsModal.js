import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Switch,
  Alert,
} from 'react-native';
import { useThemeStore } from '../../stores/theme.store';
import { ChevronLeftIcon, CheckIcon } from '../../components/common/NomadixIcons';
import { REDESIGN_THEME } from '../../theme/designTokens';

export default function AppSettingsModal({ visible, onClose }) {
  const { mode, setThemeMode } = useThemeStore();
  const isDark = mode === 'dark';

  const [selectedCurrency, setSelectedCurrency] = useState('VND');
  const [selectedLanguage, setSelectedLanguage] = useState('vi');
  const [flightAlerts, setFlightAlerts] = useState(true);
  const [priceAlerts, setPriceAlerts] = useState(true);
  const [squadAlerts, setSquadAlerts] = useState(true);
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);

  if (!visible) return null;

  const bg = isDark ? '#121316' : '#F8FAFC';
  const cardBg = isDark ? '#1C1D21' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : (REDESIGN_THEME.dark || '#0E1B2C');
  const textMuted = isDark ? '#94A3B8' : (REDESIGN_THEME.textMuted || '#5B6776');
  const borderColor = isDark ? '#2A2D35' : (REDESIGN_THEME.border || '#E3E6E0');
  const pillBg = isDark ? '#22252C' : '#F1F3F0';
  const primaryActive = isDark ? '#FFFFFF' : '#0E1B2C';

  const currencies = [
    { code: 'VND', label: 'VND (₫)', symbol: '₫' },
    { code: 'USD', label: 'USD ($)', symbol: '$' },
    { code: 'EUR', label: 'EUR (€)', symbol: '€' },
  ];

  const languages = [
    { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
  ];

  return (
    <View testID="subscreen-preferences" style={[styles.container, { backgroundColor: bg }]}>
      <View testID="app-settings-modal" style={{ position: 'absolute', width: 0, height: 0, opacity: 0 }} />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          testID="btn-close-app-settings"
          onPress={onClose}
          style={[styles.backBtn, { backgroundColor: isDark ? '#1C1D21' : '#FFFFFF', borderColor }]}
          activeOpacity={0.7}
        >
          <ChevronLeftIcon size={20} color={textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: textColor }]}>Preferences & Settings</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Section: Appearance */}
        <Text style={[styles.sectionTitle, { color: textMuted }]}>APPEARANCE & THEME</Text>
        <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
          <View style={[styles.segmentedWrapper, { backgroundColor: isDark ? '#1C1D21' : '#EAECEF' }]}>
            <TouchableOpacity
              testID="settings-theme-light"
              style={[
                styles.segmentTab,
                mode === 'light' && [styles.segmentTabActive, { backgroundColor: isDark ? '#FFFFFF' : '#111827' }],
              ]}
              onPress={() => setThemeMode('light')}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.segmentText,
                  { color: mode === 'light' ? (isDark ? '#111827' : '#FFFFFF') : (isDark ? '#94A3B8' : '#64748B') },
                  mode === 'light' && styles.segmentTextActive,
                ]}
              >
                Light Mode
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              testID="settings-theme-dark"
              style={[
                styles.segmentTab,
                mode === 'dark' && [styles.segmentTabActive, { backgroundColor: isDark ? '#FFFFFF' : '#111827' }],
              ]}
              onPress={() => setThemeMode('dark')}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.segmentText,
                  { color: mode === 'dark' ? (isDark ? '#111827' : '#FFFFFF') : (isDark ? '#94A3B8' : '#64748B') },
                  mode === 'dark' && styles.segmentTextActive,
                ]}
              >
                Dark Mode
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Section: Currency */}
        <Text style={[styles.sectionTitle, { color: textMuted }]}>DISPLAY CURRENCY</Text>
        <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
          {currencies.map((curr) => {
            const isSelected = selectedCurrency === curr.code;
            return (
              <TouchableOpacity
                key={curr.code}
                testID={`settings-currency-${curr.code}`}
                style={styles.optionRow}
                onPress={() => setSelectedCurrency(curr.code)}
                activeOpacity={0.7}
              >
                <View style={styles.optionLeft}>
                  <View style={[styles.symbolBadge, { backgroundColor: pillBg }]}>
                    <Text style={[styles.symbolText, { color: primaryActive }]}>{curr.symbol}</Text>
                  </View>
                  <Text style={[styles.optionLabel, { color: textColor }]}>{curr.label}</Text>
                </View>
                {isSelected && (
                  <View style={[styles.checkCircle, { backgroundColor: primaryActive }]}>
                    <CheckIcon size={12} color={isDark ? '#0E1B2C' : '#FFFFFF'} />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Section: Language */}
        <Text style={[styles.sectionTitle, { color: textMuted }]}>APPLICATION LANGUAGE</Text>
        <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
          {languages.map((lang) => {
            const isSelected = selectedLanguage === lang.code;
            return (
              <TouchableOpacity
                key={lang.code}
                testID={`settings-lang-${lang.code}`}
                style={styles.optionRow}
                onPress={() => setSelectedLanguage(lang.code)}
                activeOpacity={0.7}
              >
                <View style={styles.optionLeft}>
                  <Text style={styles.flagText}>{lang.flag}</Text>
                  <Text style={[styles.optionLabel, { color: textColor }]}>{lang.label}</Text>
                </View>
                {isSelected && (
                  <View style={[styles.checkCircle, { backgroundColor: primaryActive }]}>
                    <CheckIcon size={12} color={isDark ? '#0E1B2C' : '#FFFFFF'} />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Section: Notifications */}
        <Text style={[styles.sectionTitle, { color: textMuted }]}>NOTIFICATIONS & ALERTS</Text>
        <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
          <View style={styles.switchRow}>
            <View style={{ flex: 1, paddingRight: 12 }}>
              <Text style={[styles.switchTitle, { color: textColor }]}>Flight & hotel updates</Text>
              <Text style={[styles.switchSub, { color: textMuted }]}>Schedule changes, boarding gates & check-in alerts</Text>
            </View>
            <Switch
              testID="settings-switch-flight"
              value={flightAlerts}
              onValueChange={setFlightAlerts}
              trackColor={{ false: isDark ? '#2A2D35' : '#E2E8F0', true: isDark ? '#FFFFFF' : '#0E1B2C' }}
              thumbColor={isDark ? '#0E1B2C' : '#FFFFFF'}
            />
          </View>

          <View style={styles.switchRow}>
            <View style={{ flex: 1, paddingRight: 12 }}>
              <Text style={[styles.switchTitle, { color: textColor }]}>Price drop alerts</Text>
              <Text style={[styles.switchSub, { color: textMuted }]}>Instant notifications for your watched flight routes</Text>
            </View>
            <Switch
              testID="settings-switch-price"
              value={priceAlerts}
              onValueChange={setPriceAlerts}
              trackColor={{ false: isDark ? '#2A2D35' : '#E2E8F0', true: isDark ? '#FFFFFF' : '#0E1B2C' }}
              thumbColor={isDark ? '#0E1B2C' : '#FFFFFF'}
            />
          </View>

          <View style={styles.switchRow}>
            <View style={{ flex: 1, paddingRight: 12 }}>
              <Text style={[styles.switchTitle, { color: textColor }]}>Squad expense alerts</Text>
              <Text style={[styles.switchSub, { color: textMuted }]}>Real-time updates when friends add bills or settle debts</Text>
            </View>
            <Switch
              testID="settings-switch-squad"
              value={squadAlerts}
              onValueChange={setSquadAlerts}
              trackColor={{ false: isDark ? '#2A2D35' : '#E2E8F0', true: isDark ? '#FFFFFF' : '#0E1B2C' }}
              thumbColor={isDark ? '#0E1B2C' : '#FFFFFF'}
            />
          </View>
        </View>

        {/* Section: Biometrics */}
        <Text style={[styles.sectionTitle, { color: textMuted }]}>BIOMETRIC SECURITY</Text>
        <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
          <View style={styles.switchRow}>
            <View style={{ flex: 1, paddingRight: 12 }}>
              <Text style={[styles.switchTitle, { color: textColor }]}>Face ID / Biometric login</Text>
              <Text style={[styles.switchSub, { color: textMuted }]}>Fast, secure authentication when opening app or paying</Text>
            </View>
            <Switch
              value={biometricsEnabled}
              onValueChange={setBiometricsEnabled}
              trackColor={{ false: isDark ? '#2A2D35' : '#E2E8F0', true: isDark ? '#FFFFFF' : '#0E1B2C' }}
              thumbColor={isDark ? '#0E1B2C' : '#FFFFFF'}
            />
          </View>
        </View>

        {/* Save confirmation button */}
        <TouchableOpacity
          testID="btn-save-settings"
          style={[styles.saveBtn, { backgroundColor: primaryActive }]}
          onPress={() => {
            Alert.alert('Success', 'Nomadix preferences saved successfully.');
            onClose();
          }}
          activeOpacity={0.8}
        >
          <Text style={[styles.saveBtnText, { color: isDark ? '#0E1B2C' : '#FFFFFF' }]}>Save Changes</Text>
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
    paddingBottom: 80,
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
    padding: 14,
    borderWidth: 1,
  },
  segmentedWrapper: {
    flexDirection: 'row',
    borderRadius: 24,
    padding: 4,
  },
  segmentTab: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentTabActive: {
    elevation: 0,
    shadowOpacity: 0,
  },
  segmentText: {
    fontSize: 13,
    fontWeight: '700',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  symbolBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  symbolText: {
    fontSize: 14,
    fontWeight: '800',
  },
  flagText: {
    fontSize: 20,
  },
  optionLabel: {
    fontSize: 15,
    fontWeight: '700',
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  switchTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  switchSub: {
    fontSize: 12,
    marginTop: 2,
  },
  saveBtn: {
    height: 54,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 26,
    marginBottom: 20,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
});
