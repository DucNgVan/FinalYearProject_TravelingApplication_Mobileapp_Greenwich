import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { useGamificationStore } from '../../stores/gamification.store';
import { useThemeStore } from '../../stores/theme.store';

export default function CulturalBadgesModal({ visible, onClose }) {
  const { colors: themeColors, mode } = useThemeStore();
  const isDark = mode === 'dark';
  const { xp, level, levelTitle, nextLevelXp, landmarks, badges, checkInLandmark } =
    useGamificationStore();

  const progressPercent = nextLevelXp ? Math.min(Math.round((xp / nextLevelXp) * 100), 100) : 100;

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.backdrop} testID="cultural-badges-modal">
        <View
          style={[
            styles.container,
            {
              backgroundColor: isDark ? '#1C1D21' : '#FFFFFF',
              borderColor: isDark ? '#2A2D35' : '#E5E7EB',
            },
          ]}
        >
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: isDark ? '#2A2D35' : '#E5E7EB' }]}>
            <View>
              <Text style={[styles.title, { color: isDark ? '#FFFFFF' : '#111827' }]}>
                Cultural Badges & GPS
              </Text>
              <Text style={[styles.subtitle, { color: themeColors.textMuted }]}>
                Module 5 • Gamification & Geolocation
              </Text>
            </View>

            <TouchableOpacity
              onPress={onClose}
              style={[styles.closeBtn, { backgroundColor: isDark ? '#2A2D35' : '#F3F4F6' }]}
              activeOpacity={0.7}
            >
              <Text style={[styles.closeText, { color: isDark ? '#D1D5DB' : '#4B5563' }]}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
            {/* Level Card */}
            <View
              style={[
                styles.levelCard,
                {
                  backgroundColor: isDark ? '#121316' : '#0E1B2C',
                },
              ]}
            >
              <View style={styles.levelHeader}>
                <View>
                  <Text style={styles.levelEyebrow}>TRAVELER STATUS</Text>
                  <Text style={styles.levelName}>
                    Level {level}: {levelTitle}
                  </Text>
                </View>
                <View style={styles.xpBadge}>
                  <Text style={styles.xpText}>⭐ {xp} XP</Text>
                </View>
              </View>

              {/* XP Progress Bar */}
              <View testID="gamification-xp-bar" style={styles.progressBarTrack}>
                <View
                  style={[
                    styles.progressBarFill,
                    { width: `${progressPercent}%`, backgroundColor: '#38BDF8' },
                  ]}
                />
              </View>

              <Text style={styles.nextLevelText}>
                {nextLevelXp
                  ? `${nextLevelXp - xp} XP to next milestone (${progressPercent}%)`
                  : 'Maximum Level Reached 🏆'}
              </Text>
            </View>

            {/* Badges Grid */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#111827' }]}>
                Cultural Badges ({badges.filter((b) => b.unlocked).length}/{badges.length})
              </Text>
              <View style={styles.badgesRow}>
                {badges.map((b) => (
                  <View
                    key={b.id}
                    style={[
                      styles.badgeCard,
                      {
                        backgroundColor: isDark ? '#22252B' : '#F8FAFC',
                        borderColor: b.unlocked ? '#F59E0B' : isDark ? '#2A2D35' : '#E2E8F0',
                        opacity: b.unlocked ? 1 : 0.45,
                      },
                    ]}
                  >
                    <Text style={styles.badgeIcon}>{b.icon}</Text>
                    <Text
                      style={[styles.badgeName, { color: isDark ? '#FFFFFF' : '#111827' }]}
                      numberOfLines={1}
                    >
                      {b.name}
                    </Text>
                    <Text style={[styles.badgeCity, { color: themeColors.textMuted }]}>
                      {b.city}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Nearby Cultural Landmarks for Check-in */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#111827' }]}>
                Cultural Landmarks & GPS Check-in
              </Text>
              {landmarks.map((lm) => (
                <View
                  key={lm.id}
                  style={[
                    styles.landmarkCard,
                    {
                      backgroundColor: isDark ? '#22252B' : '#F8FAFC',
                      borderColor: isDark ? '#2A2D35' : '#E2E8F0',
                    },
                  ]}
                >
                  <Image source={{ uri: lm.cover_image_url }} style={styles.landmarkPhoto} />
                  <View style={styles.landmarkInfo}>
                    <Text
                      style={[styles.landmarkTitle, { color: isDark ? '#FFFFFF' : '#111827' }]}
                    >
                      {lm.name}
                    </Text>
                    <Text
                      style={[styles.landmarkDesc, { color: themeColors.textMuted }]}
                      numberOfLines={2}
                    >
                      {lm.description}
                    </Text>

                    <View style={styles.landmarkActionRow}>
                      <Text style={styles.rewardText}>+150 XP • Geofence 100m</Text>

                      <TouchableOpacity
                        testID={`btn-checkin-${lm.id}`}
                        onPress={() =>
                          checkInLandmark(lm.id, {
                            latitude: lm.latitude,
                            longitude: lm.longitude,
                          })
                        }
                        style={[
                          styles.checkinBtn,
                          {
                            backgroundColor: lm.isCheckedIn
                              ? '#10B981'
                              : isDark
                              ? '#0284C7'
                              : '#0F172A',
                          },
                        ]}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.checkinBtnText}>
                          {lm.isCheckedIn ? '✓ Checked In' : '📍 Check-in (GPS)'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    minHeight: 460,
    borderWidth: 1,
    borderBottomWidth: 0,
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontSize: 13,
    fontWeight: '700',
  },
  scrollArea: {
    paddingHorizontal: 18,
    paddingTop: 16,
  },
  levelCard: {
    padding: 16,
    borderRadius: 18,
    marginBottom: 20,
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  levelEyebrow: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  levelName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    marginTop: 2,
  },
  xpBadge: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  xpText: {
    color: '#FACC15',
    fontWeight: '700',
    fontSize: 12,
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  nextLevelText: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '500',
  },
  section: {
    marginBottom: 22,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 12,
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  badgeCard: {
    width: '48%',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  badgeIcon: {
    fontSize: 28,
    marginBottom: 6,
  },
  badgeName: {
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },
  badgeCity: {
    fontSize: 11,
    marginTop: 2,
  },
  landmarkCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 14,
  },
  landmarkPhoto: {
    width: '100%',
    height: 120,
    backgroundColor: '#334155',
  },
  landmarkInfo: {
    padding: 14,
  },
  landmarkTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  landmarkDesc: {
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 10,
  },
  landmarkActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rewardText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#10B981',
  },
  checkinBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
  },
  checkinBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
