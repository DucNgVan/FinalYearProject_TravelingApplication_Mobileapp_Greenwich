import React from 'react';
import { StyleSheet } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import Input from '../../src/components/common/Input';
import { useThemeStore } from '../../src/stores/theme.store';

describe('Component Test: Input', () => {
  test('should render label, placeholder, and handle text changes', () => {
    const handleChangeText = jest.fn();
    const { getByText, getByPlaceholderText } = render(
      <Input
        label="Username"
        placeholder="Enter username"
        value="duc"
        onChangeText={handleChangeText}
      />
    );

    expect(getByText('Username')).toBeTruthy();
    const input = getByPlaceholderText('Enter username');
    fireEvent.changeText(input, 'duc-new');
    expect(handleChangeText).toHaveBeenCalledWith('duc-new');
  });

  test('should render error message when error prop is provided', () => {
    const { getByText } = render(
      <Input placeholder="Enter email" error="Invalid email address" />
    );

    expect(getByText('Invalid email address')).toBeTruthy();
  });

  test('RED-FE-TH-02: Input dynamically renders dark background (#1C1D21), border (#2A2D35), and white text in Dark Mode', () => {
    useThemeStore.getState().setThemeMode('dark');
    const { getByTestId } = render(
      <Input placeholder="Enter email" testID="test-themed-input" />
    );
    const input = getByTestId('test-themed-input');
    const flatStyle = StyleSheet.flatten(input.props.style);
    expect(flatStyle.backgroundColor).toBe('#1C1D21');
    expect(flatStyle.borderColor).toBe('#2A2D35');
    expect(flatStyle.color).toBe('#FFFFFF');
    expect(input.props.placeholderTextColor).toBe('#9CA3AF');

    useThemeStore.getState().setThemeMode('light');
  });
});
