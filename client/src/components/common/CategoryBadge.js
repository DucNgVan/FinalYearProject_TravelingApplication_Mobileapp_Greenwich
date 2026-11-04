import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../../theme/colors';

const CATEGORY_CONFIG = {
  flights: {
    bg: colors.sky50 || '#F0F9FF',
    color: colors.sky500 || '#0EA5E9',
    glyph: '✈️',
  },
  hotels: {
    bg: colors.orange50 || '#FFF7ED',
    color: colors.orange500 || '#F97316',
    glyph: '🏨',
  },
  home: {
    bg: colors.amber50 || '#FFFBEB',
    color: colors.amber400 || '#FBBF24',
    glyph: '⚡',
  },
  plan: {
    bg: colors.planBadgeBg || '#F1F5F9',
    color: colors.planBadge || '#475569',
    glyph: '🗺️',
  },
  group: {
    bg: colors.emerald50 || '#ECFDF5',
    color: colors.emerald500 || '#2E7D5B',
    glyph: '👥',
  },
};

export default function CategoryBadge({
  category = 'flights',
  label,
  onPress,
  size = 48,
  style,
}) {
  const config = CATEGORY_CONFIG[category] || CATEGORY_CONFIG.flights;
  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={0.7}
      testID={`category-badge-${category}`}
    >
      <View
        testID={`category-badge-circle-${category}`}
        style={[
          styles.circle,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: config.bg,
          },
        ]}
      >
        <Text style={[styles.glyph, { color: config.color, fontSize: size * 0.45 }]}>
          {config.glyph}
        </Text>
      </View>
      {label ? (
        <Text style={[styles.label, { color: colors.slate800 || '#1E293B' }]}>
          {label}
        </Text>
      ) : null}
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  glyph: {
    fontWeight: 'bold',
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
});
