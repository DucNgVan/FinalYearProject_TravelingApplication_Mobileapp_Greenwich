import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

export default function Button({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  textStyle,
  testID,
}) {
  const isPrimary = variant === 'primary';
  const isOutline = variant === 'outline';

  const containerStyles = [
    styles.baseButton,
    isPrimary && styles.primaryButton,
    isOutline && styles.outlineButton,
    (disabled || loading) && styles.disabledButton,
    style,
  ];

  const titleStyles = [
    styles.baseText,
    isPrimary ? styles.primaryText : styles.outlineText,
    disabled && styles.disabledText,
    textStyle,
  ];

  return (
    <TouchableOpacity
      testID={testID}
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || loading}
      style={containerStyles}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? '#FFFFFF' : colors.primary} size="small" />
      ) : (
        <Text style={titleStyles}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  baseButton: {
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginVertical: 8,
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  disabledButton: {
    opacity: 0.6,
  },
  baseText: {
    ...typography.button,
  },
  primaryText: {
    color: '#FFFFFF',
  },
  outlineText: {
    color: colors.primary,
  },
  disabledText: {
    color: colors.textMuted,
  },
});
