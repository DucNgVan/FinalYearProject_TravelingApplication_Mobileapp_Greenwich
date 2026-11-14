import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { useThemeStore } from '../../stores/theme.store';

export default function AirplaneLoader({
  visible = true,
  message = 'Preparing your departure...',
  inline = false,
}) {
  const { mode } = useThemeStore();
  const isDark = mode === 'dark';

  const flightAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (!visible) return;

    // Gliding flight loop
    const flightLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(flightAnim, {
          toValue: 1,
          duration: 1800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(flightAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );

    // Subtle cloud pulse
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.8,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    flightLoop.start();
    pulseLoop.start();

    return () => {
      flightLoop.stop();
      pulseLoop.stop();
    };
  }, [visible, flightAnim, pulseAnim]);

  if (!visible) return null;

  const translateX = flightAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [-60, 0, 70],
  });

  const translateY = flightAnim.interpolate({
    inputRange: [0, 0.3, 0.7, 1],
    outputRange: [6, -8, -6, 4],
  });

  const rotate = flightAnim.interpolate({
    inputRange: [0, 0.3, 0.7, 1],
    outputRange: ['-8deg', '4deg', '6deg', '-2deg'],
  });

  return (
    <View
      testID="airplane-loading-animation"
      style={[
        styles.container,
        !inline && styles.fullOverlay,
        { backgroundColor: isDark ? 'rgba(18, 19, 22, 0.88)' : 'rgba(15, 23, 42, 0.82)' },
      ]}
    >
      <View style={[styles.card, { backgroundColor: isDark ? '#1C1D21' : '#FFFFFF' }]}>
        {/* Animated Sky Canvas */}
        <View style={styles.skyCanvas}>
          {/* Flight Path Contrail Line */}
          <View style={[styles.flightPathDotted, { borderColor: isDark ? '#334155' : '#E2E8F0' }]} />

          {/* Animated Clouds */}
          <Animated.View style={[styles.cloudPill, { opacity: pulseAnim, transform: [{ scale: pulseAnim }] }]}>
            <Text style={{ fontSize: 13, opacity: 0.6 }}>☁️</Text>
          </Animated.View>

          {/* Gliding Airplane */}
          <Animated.View
            testID="airplane-loading-glyph"
            style={[
              styles.airplaneBox,
              {
                backgroundColor: isDark ? '#FFFFFF' : '#0F172A',
                transform: [{ translateX }, { translateY }, { rotate }],
              },
            ]}
          >
            <Text style={[styles.airplaneIcon, { color: isDark ? '#0F172A' : '#FFFFFF' }]}>✈</Text>
          </Animated.View>
        </View>

        {/* Departure Status Text */}
        <Text style={[styles.statusTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
          {message}
        </Text>
        <Text style={styles.statusSub}>
          Nomadix Departure Terminal • Fasten Seatbelt
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  fullOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
  },
  card: {
    borderRadius: 24,
    paddingVertical: 24,
    paddingHorizontal: 28,
    alignItems: 'center',
    minWidth: 260,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
  },
  skyCanvas: {
    width: 160,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 12,
  },
  flightPathDotted: {
    position: 'absolute',
    width: 140,
    height: 2,
    borderWidth: 1,
    borderStyle: 'dashed',
    top: 34,
  },
  cloudPill: {
    position: 'absolute',
    right: 18,
    top: 10,
  },
  airplaneBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
  },
  airplaneIcon: {
    fontSize: 22,
    fontWeight: '900',
  },
  statusTitle: {
    fontSize: 15,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  statusSub: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 4,
    textAlign: 'center',
  },
});
