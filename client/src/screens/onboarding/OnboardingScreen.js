import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { useThemeStore } from '../../stores/theme.store';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const ONBOARDING_SLIDES = [
  {
    step: '1 Book',
    title: 'Flights & stays, in one swipe',
    subtitle:
      'Compare fares, pick your seat and lock in a hotel — all inside a single beautiful flow.',
    imageUri:
      'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?q=80&w=800&auto=format&fit=crop', // Da Nang Golden Bridge
    bgColor: '#DDE9FC',
    chips: [
      { text: '🛫 SGN → DAD', position: 'topRight' },
      { text: '🏨 3 nights · 4.9★', position: 'bottomLeft' },
    ],
    buttonText: 'Next →',
    graphicType: 'book',
  },
  {
    step: '2 Plan',
    title: 'Plan the trip, together',
    subtitle:
      'Everyone edits one live itinerary. Invite friends as editors or viewers and watch the plan come alive.',
    imageUri:
      'https://images.unsplash.com/photo-1555921015-5532091f6026?q=80&w=800&auto=format&fit=crop', // Hoi An Lanterns
    bgColor: '#FFEADC',
    chips: [
      { text: '📍 My Khe Beach', position: 'bottomLeft' },
      { text: '+ Invite friend', position: 'bottomRight' },
    ],
    buttonText: 'Next →',
    graphicType: 'plan',
  },
  {
    step: '3 Split',
    title: 'Smart group expense split',
    subtitle:
      'Log a bill once. Nomadix untangles who owes whom into the fewest possible repayments.',
    imageUri:
      'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=800&auto=format&fit=crop', // Vietnam Landscape
    bgColor: '#DBEEFD',
    chips: [
      { text: '✨ 2 payments, not 6', position: 'topLeft' },
      { text: 'An pays Duc · 800k đ', position: 'bottomRight' },
    ],
    buttonText: "Let's go →",
    graphicType: 'split',
  },
];

export default function OnboardingScreen({ onComplete, onSkip, onLogin }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { mode, colors: themeColors } = useThemeStore();
  const currentSlide = ONBOARDING_SLIDES[currentIndex];

  const handleNext = () => {
    if (currentIndex < ONBOARDING_SLIDES.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      if (onComplete) onComplete();
    }
  };

  const handleSkip = () => {
    if (onLogin) {
      onLogin();
    } else if (onSkip) {
      onSkip();
    } else if (onComplete) {
      onComplete();
    }
  };

  return (
    <View
      testID={`onboarding-slide-${currentIndex}`}
      style={[
        styles.container,
        {
          backgroundColor: mode === 'dark' ? '#07122B' : '#F8FAFC',
        },
      ]}
    >
      {/* Top Header: Step Badge & Skip/Login Button */}
      <View style={styles.topHeader}>
        <View
          style={[
            styles.stepBadge,
            {
              backgroundColor: mode === 'dark' ? '#0F2149' : '#FFFFFF',
              borderColor: mode === 'dark' ? '#1E3566' : '#E2E8F0',
            },
          ]}
        >
          <Text
            style={[
              styles.stepBadgeText,
              { color: mode === 'dark' ? '#FFFFFF' : '#0F172A' },
            ]}
          >
            {currentSlide.step}
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleSkip}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={[styles.skipButtonText, { color: mode === 'dark' ? '#FFFFFF' : '#0F172A' }]}>
            Log In
          </Text>
        </TouchableOpacity>
      </View>

      {/* Main Photographic Illustration Card */}
      <View style={styles.cardWrapper}>
        <ImageBackground
          testID={`onboarding-hero-image-${currentIndex}`}
          source={{ uri: currentSlide.imageUri }}
          style={styles.heroCard}
          imageStyle={styles.heroImageBorder}
          resizeMode="cover"
        >
          <View style={styles.heroOverlay} />

          {/* Floating contextual chips */}
          {currentSlide.chips.map((chip, idx) => {
            let posStyle = {};
            if (chip.position === 'topRight') {
              posStyle = { top: 14, right: 14 };
            } else if (chip.position === 'bottomLeft') {
              posStyle = { bottom: 14, left: 14 };
            } else if (chip.position === 'topLeft') {
              posStyle = { top: 14, left: 14 };
            } else if (chip.position === 'bottomRight') {
              posStyle = { bottom: 14, right: 14 };
            }

            return (
              <View
                key={idx}
                style={[
                  styles.floatingChip,
                  posStyle,
                  {
                    backgroundColor: 'rgba(255, 255, 255, 0.92)',
                  },
                ]}
              >
                {chip.hasAvatars && (
                  <View style={styles.avatarRow}>
                    <View style={[styles.avatarDot, { backgroundColor: '#2E7D5B' }]}>
                      <Text style={styles.avatarLetter}>D</Text>
                    </View>
                    <View style={[styles.avatarDot, { backgroundColor: '#3B82F6' }]}>
                      <Text style={styles.avatarLetter}>L</Text>
                    </View>
                    <View style={[styles.avatarDot, { backgroundColor: '#F97316' }]}>
                      <Text style={styles.avatarLetter}>A</Text>
                    </View>
                  </View>
                )}
                <Text style={styles.chipText}>{chip.text}</Text>
              </View>
            );
          })}

          {/* Central Graphic Composition */}
          <View style={styles.graphicCenter}>
            {/* Slide 1: Plane & Hotel cards tilted */}
            {currentSlide.graphicType === 'book' && (
              <View style={styles.bookIllustration}>
                <View style={[styles.tiltedCard, styles.planeTiltedCard]}>
                  <Text style={styles.cardEmoji}>✈️</Text>
                </View>
                <View style={[styles.tiltedCard, styles.hotelTiltedCard]}>
                  <Text style={styles.cardEmoji}>🏨</Text>
                </View>
              </View>
            )}

            {/* Slide 2: Squad of 3 frosted card */}
            {currentSlide.graphicType === 'plan' && (
              <View style={styles.planIllustration}>
                <View style={styles.squadBadgeBox}>
                  <View style={styles.squadAvatarRow}>
                    <View style={[styles.squadAvatar, { backgroundColor: '#2E7D5B' }]}>
                      <Text style={styles.avatarLetter}>D</Text>
                    </View>
                    <View
                      style={[
                        styles.squadAvatar,
                        { backgroundColor: '#3B82F6', marginLeft: -8 },
                      ]}
                    >
                      <Text style={styles.avatarLetter}>L</Text>
                    </View>
                    <View
                      style={[
                        styles.squadAvatar,
                        { backgroundColor: '#F97316', marginLeft: -8 },
                      ]}
                    >
                      <Text style={styles.avatarLetter}>A</Text>
                    </View>
                  </View>
                  <Text style={styles.squadLabel}>Squad of 3</Text>
                </View>
              </View>
            )}

            {/* Slide 3: Smart Expense Split Pie & Coin */}
            {currentSlide.graphicType === 'split' && (
              <View style={styles.splitIllustration}>
                <View style={styles.emeraldCircle}>
                  <View style={styles.orangeInnerCircle}>
                    <Text style={styles.pieCenterText}>÷3</Text>
                  </View>
                  <View style={styles.coinBadge}>
                    <Text style={styles.coinBadgeText}>₫</Text>
                  </View>
                </View>
              </View>
            )}
          </View>
        </ImageBackground>
      </View>

      {/* Copy / Text Content Area */}
      <View style={styles.textContainer}>
        <Text
          style={[
            styles.title,
            { color: mode === 'dark' ? '#F8FAFC' : '#0F172A' },
          ]}
        >
          {currentSlide.title}
        </Text>
        <Text
          style={[
            styles.subtitle,
            { color: mode === 'dark' ? '#94A3B8' : '#64748B' },
          ]}
        >
          {currentSlide.subtitle}
        </Text>
      </View>

      {/* Bottom Controls Row: Pill Dots + Next / Let's go button */}
      <View style={styles.bottomControls}>
        <View style={styles.dotsRow}>
          {ONBOARDING_SLIDES.map((_, i) => {
            const isActive = i === currentIndex;
            return (
              <TouchableOpacity
                key={i}
                onPress={() => setCurrentIndex(i)}
                style={[
                  isActive ? styles.dotActive : styles.dotInactive,
                  {
                    backgroundColor: isActive
                      ? mode === 'dark'
                        ? '#FFFFFF'
                        : '#0F172A'
                      : mode === 'dark'
                      ? '#334155'
                      : '#CBD5E1',
                  },
                ]}
              />
            );
          })}
        </View>

        <TouchableOpacity
          onPress={handleNext}
          style={[
            styles.nextButton,
            {
              backgroundColor: mode === 'dark' ? '#0F172A' : '#0F172A',
            },
          ]}
          activeOpacity={0.85}
        >
          <Text style={styles.nextButtonText}>{currentSlide.buttonText}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  stepBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  skipButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },
  cardWrapper: {
    flex: 1,
    minHeight: 240,
    maxHeight: 380,
    marginVertical: 12,
    borderRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 6,
  },
  heroCard: {
    flex: 1,
    borderRadius: 32,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroImageBorder: {
    borderRadius: 32,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.22)',
  },
  floatingChip: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 10,
  },
  chipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F172A',
  },
  avatarRow: {
    flexDirection: 'row',
    marginRight: 6,
  },
  avatarDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    marginLeft: -4,
  },
  avatarLetter: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  graphicCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },
  bookIllustration: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
  },
  tiltedCard: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  planeTiltedCard: {
    transform: [{ rotate: '-10deg' }],
  },
  hotelTiltedCard: {
    transform: [{ rotate: '5deg' }],
  },
  cardEmoji: {
    fontSize: 28,
  },
  planIllustration: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  squadBadgeBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    borderRadius: 22,
    paddingVertical: 14,
    paddingHorizontal: 22,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  squadAvatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  squadAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  squadLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },
  splitIllustration: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emeraldCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(16, 185, 129, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  orangeInnerCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#F97316',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pieCenterText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
  },
  coinBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FBBF24',
    borderWidth: 2,
    borderColor: '#2E7D5B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coinBadgeText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },
  textContainer: {
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.6,
    lineHeight: 34,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dotActive: {
    width: 24,
    height: 6,
    borderRadius: 3,
  },
  dotInactive: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  nextButton: {
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
