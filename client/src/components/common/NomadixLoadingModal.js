import React, { useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  Animated,
  Easing,
  StyleSheet,
} from 'react-native';

export const NomadixLoadingModal = ({
  visible,
  title = 'Authenticating Nomadix Traveler...',
  subtitle = 'Nomadix Departure Terminal • Fasten Seatbelt',
  testID = 'nomadix-loading-modal',
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.92)).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const planeProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // 1. Smooth fade & spring scale entrance
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 7,
          tension: 65,
          useNativeDriver: true,
        }),
      ]).start();

      // 2. Pulse ring around brand logo N
      const pulseLoop = Animated.loop(
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1800,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        })
      );

      // 3. Gliding airplane flight progress
      const planeLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(planeProgress, {
            toValue: 1,
            duration: 1700,
            easing: Easing.inOut(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.delay(250),
          Animated.timing(planeProgress, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      );

      pulseLoop.start();
      planeLoop.start();

      return () => {
        pulseLoop.stop();
        planeLoop.stop();
      };
    } else {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.92);
      pulseAnim.setValue(0);
      planeProgress.setValue(0);
    }
  }, [visible, fadeAnim, scaleAnim, pulseAnim, planeProgress]);

  const ringScale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.55],
  });
  const ringOpacity = pulseAnim.interpolate({
    inputRange: [0, 0.7, 1],
    outputRange: [0.4, 0.12, 0],
  });

  const planeTranslateX = planeProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 156],
  });
  const planeOpacity = planeProgress.interpolate({
    inputRange: [0, 0.12, 0.88, 1],
    outputRange: [0.25, 1, 1, 0.25],
  });

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      statusBarTranslucent
    >
      <Animated.View testID={testID} style={[styles.backdrop, { opacity: fadeAnim }]}>
        <Animated.View
          style={[
            styles.card,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Logo chữ N đồng bộ góc trên màn hình + Tên app nomadix */}
          <View style={styles.brandContainer}>
            <View style={styles.logoWrapper}>
              <Animated.View
                style={[
                  styles.pulseRing,
                  {
                    transform: [{ scale: ringScale }],
                    opacity: ringOpacity,
                  },
                ]}
              />
              <View style={styles.logoBox}>
                <Text style={styles.logoLetter}>N</Text>
              </View>
            </View>

            <Text style={styles.brandName}>nomadix</Text>
          </View>

          {/* Quỹ đạo đường bay & icon máy bay */}
          <View style={styles.flightTrackContainer}>
            <View style={styles.endpointDot} />
            <View style={styles.dashedLine} />
            <View style={[styles.endpointDot, styles.endpointDotActive]} />

            <Animated.View
              style={[
                styles.planeBadge,
                {
                  opacity: planeOpacity,
                  transform: [{ translateX: planeTranslateX }],
                },
              ]}
            >
              <Text style={styles.planeIcon}>✈</Text>
            </Animated.View>
          </View>

          {/* Nội dung trạng thái */}
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

export default NomadixLoadingModal;

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.72)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    paddingVertical: 30,
    paddingHorizontal: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.22,
    shadowRadius: 24,
    elevation: 12,
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: 22,
  },
  logoWrapper: {
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  pulseRing: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: '#0F172A',
  },
  logoBox: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  logoLetter: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  brandName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: 1.2,
  },
  flightTrackContainer: {
    width: 192,
    height: 36,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
    position: 'relative',
  },
  dashedLine: {
    flex: 1,
    height: 1,
    borderWidth: 1,
    borderColor: '#94A3B8',
    borderStyle: 'dashed',
    marginHorizontal: 6,
  },
  endpointDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#CBD5E1',
  },
  endpointDotActive: {
    backgroundColor: '#0284C7',
  },
  planeBadge: {
    position: 'absolute',
    left: 0,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  planeIcon: {
    color: '#FFFFFF',
    fontSize: 16,
    includeFontPadding: false,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 12.5,
    fontWeight: '500',
    color: '#64748B',
    textAlign: 'center',
  },
});
