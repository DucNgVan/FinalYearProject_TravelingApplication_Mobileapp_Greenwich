import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Linking,
  Platform,
} from 'react-native';
import { useThemeStore } from '../../stores/theme.store';
import LucideIcon from '../common/LucideIcon';
import { colors } from '../../theme/colors';

export default function GetDirectionsModal({ visible, place, onClose }) {
  const { colors: themeColors, mode } = useThemeStore();
  const isDark = mode === 'dark';

  if (!place) return null;

  const lat = place.lat || 16.061;
  const lng = place.lng || 108.2272;
  const placeName = place.name || 'Destination';

  const handleOpenAppleMaps = () => {
    const url = `maps://?daddr=${lat},${lng}&q=${encodeURIComponent(placeName)}`;
    Linking.openURL(url).catch(() => {
      // Fallback to web maps if Apple Maps not available
      const webUrl = `https://maps.apple.com/?daddr=${lat},${lng}`;
      Linking.openURL(webUrl).catch(() => {});
    });
    onClose?.();
  };

  const handleOpenGoogleMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${encodeURIComponent(placeName)}`;
    Linking.openURL(url).catch(() => {});
    onClose?.();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          style={[
            styles.sheetContainer,
            { backgroundColor: isDark ? '#1C1D21' : '#FFFFFF' },
          ]}
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Sheet Handle */}
          <View style={styles.handleBar} />

          {/* Header Row */}
          <View style={styles.headerRow}>
            <View style={styles.headerTitleWrap}>
              <View style={styles.eyebrowRow}>
                <View style={styles.compassIconWrap}>
                  <LucideIcon name="navigation" size={14} color="#2E7D5B" />
                </View>
                <Text style={styles.eyebrowText}>GET DIRECTIONS</Text>
              </View>
              <Text
                style={[
                  styles.placeTitle,
                  { color: isDark ? '#FFFFFF' : '#0F172A' },
                ]}
                numberOfLines={1}
              >
                {placeName}
              </Text>
            </View>

            <TouchableOpacity
              testID="directions-modal-close-btn"
              style={[
                styles.closeBtn,
                { backgroundColor: isDark ? '#2A2D35' : '#F1F5F9' },
              ]}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <LucideIcon
                name="x"
                size={18}
                color={isDark ? '#9CA3AF' : '#64748B'}
              />
            </TouchableOpacity>
          </View>

          {/* Navigation Options */}
          <View style={styles.optionsList}>
            {/* Apple Maps Option */}
            <TouchableOpacity
              testID="directions-apple-maps-btn"
              style={[
                styles.optionCard,
                {
                  backgroundColor: isDark ? '#121316' : '#F8FAFC',
                  borderColor: isDark ? '#2A2D35' : '#E2E8F0',
                },
              ]}
              onPress={handleOpenAppleMaps}
              activeOpacity={0.75}
            >
              <View style={[styles.appIconWrap, { backgroundColor: '#FFFFFF' }]}>
                <LucideIcon name="map" size={24} color="#0A84FF" />
              </View>

              <View style={styles.optionTextWrap}>
                <Text
                  style={[
                    styles.optionTitle,
                    { color: isDark ? '#FFFFFF' : '#0F172A' },
                  ]}
                >
                  Apple Maps
                </Text>
                <Text style={styles.optionSubtitle}>Open in Apple Maps</Text>
              </View>

              <View
                style={[
                  styles.arrowCircle,
                  { backgroundColor: isDark ? '#2A2D35' : '#E2E8F0' },
                ]}
              >
                <LucideIcon
                  name="arrow-right"
                  size={16}
                  color={isDark ? '#FFFFFF' : '#0F172A'}
                />
              </View>
            </TouchableOpacity>

            {/* Google Maps Option */}
            <TouchableOpacity
              testID="directions-google-maps-btn"
              style={[
                styles.optionCard,
                {
                  backgroundColor: isDark ? '#121316' : '#F8FAFC',
                  borderColor: isDark ? '#2A2D35' : '#E2E8F0',
                },
              ]}
              onPress={handleOpenGoogleMaps}
              activeOpacity={0.75}
            >
              <View style={[styles.appIconWrap, { backgroundColor: '#FFFFFF' }]}>
                <LucideIcon name="navigation" size={24} color="#2E7D5B" />
              </View>

              <View style={styles.optionTextWrap}>
                <Text
                  style={[
                    styles.optionTitle,
                    { color: isDark ? '#FFFFFF' : '#0F172A' },
                  ]}
                >
                  Google Maps
                </Text>
                <Text style={styles.optionSubtitle}>Open in Google Maps</Text>
              </View>

              <View
                style={[
                  styles.arrowCircle,
                  { backgroundColor: isDark ? '#2A2D35' : '#E2E8F0' },
                ]}
              >
                <LucideIcon
                  name="arrow-right"
                  size={16}
                  color={isDark ? '#FFFFFF' : '#0F172A'}
                />
              </View>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 12,
    paddingHorizontal: 20,
    paddingBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 20,
  },
  handleBar: {
    width: 44,
    height: 5,
    backgroundColor: 'rgba(156, 163, 175, 0.4)',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  headerTitleWrap: {
    flex: 1,
    marginRight: 12,
  },
  eyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  compassIconWrap: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: 'rgba(46, 125, 91, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  eyebrowText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2E7D5B',
    letterSpacing: 1,
  },
  placeTitle: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionsList: {
    gap: 12,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
  },
  appIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  optionTextWrap: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  optionSubtitle: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  arrowCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
});
