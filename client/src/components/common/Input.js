import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useThemeStore } from '../../stores/theme.store';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

export default function Input({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  error,
  keyboardType = 'default',
  autoCapitalize = 'none',
  style,
  testID,
}) {
  const { colors: themeColors } = useThemeStore();

  return (
    <View style={[styles.container, style]}>
      {label ? (
        <Text style={[styles.label, { color: themeColors.textMuted }]} numberOfLines={1}>
          {label}
        </Text>
      ) : null}
      <TextInput
        testID={testID}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={themeColors.textMuted}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        style={[
          styles.input,
          {
            backgroundColor: themeColors.card,
            borderColor: error ? themeColors.error : themeColors.border,
            color: themeColors.text,
          },
          error && styles.inputError,
        ]}
      />
      {error ? <Text style={[styles.errorText, { color: themeColors.error }]}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
    width: '100%',
  },
  label: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: 6,
    minHeight: 18,
  },
  input: {
    height: 50,
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    color: colors.text,
    fontSize: 15,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    ...typography.caption,
    color: colors.error,
    marginTop: 4,
  },
});
