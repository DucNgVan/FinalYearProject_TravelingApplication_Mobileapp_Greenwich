import React from 'react';
import { render, fireEvent, within } from '@testing-library/react-native';
import HomeScreen from '../../src/screens/home/HomeScreen';
import { useCurrencyStore } from '../../src/stores/currency.store';
import { useItineraryStore } from '../../src/stores/itinerary.store';
import { useThemeStore } from '../../src/stores/theme.store';
import { useAuthStore } from '../../src/stores/auth.store';

describe('Component Test: HomeScreen Currency Exchange Form Modal', () => {
  beforeEach(() => {
    useThemeStore.getState().setThemeMode('light');
    useItineraryStore.setState({ trips: [] });
    useAuthStore.setState({
      user: { id: 'usr-1', fullName: 'Duc Nguyen', email: 'ducnva.wk@gmail.com' },
      isAuthenticated: true,
      isGuest: false,
    });
    useCurrencyStore.setState({
      base: 'USD',
      rates: {
        USD: 1,
        EUR: 0.8661,
        VND: 25400,
        JPY: 154.2,
        GBP: 0.78,
      },
      lastUpdated: '2026-11-13',
      isLoading: false,
      error: null,
      isLive: true,
    });
  });

  test('RED-CURR-FORM-01: Tapping the FROM box on HomeScreen opens Currency Converter Form Modal', () => {
    const { getByTestId, queryByTestId, getByText } = render(<HomeScreen />);

    // Form modal is initially closed
    expect(queryByTestId('currency-converter-form-modal')).toBeNull();

    // Tapping the FROM box triggers form modal
    const fromBox = getByTestId('currency-from-box');
    expect(fromBox).toBeTruthy();
    fireEvent.press(fromBox);

    // Modal is now open
    expect(getByTestId('currency-converter-form-modal')).toBeTruthy();
    expect(getByText(/Currency Exchange Form|Exchange Amount/i)).toBeTruthy();
    expect(getByTestId('modal-currency-amount-input')).toBeTruthy();
  });

  test('RED-CURR-FORM-02: Typing into modal input or tapping quick preset chips updates the amount', () => {
    const { getByTestId, getByText } = render(<HomeScreen />);

    // Open form modal
    fireEvent.press(getByTestId('currency-from-box'));

    const modalInput = getByTestId('modal-currency-amount-input');
    // Type 250
    fireEvent.changeText(modalInput, '250');
    expect(modalInput.props.value).toBe('250');

    // Tap quick preset chip: 500
    const preset500 = getByTestId('preset-amount-500');
    expect(preset500).toBeTruthy();
    fireEvent.press(preset500);
    expect(modalInput.props.value).toBe('500');

    // Tap quick preset chip: 1000
    const preset1000 = getByTestId('preset-amount-1000');
    expect(preset1000).toBeTruthy();
    fireEvent.press(preset1000);
    expect(modalInput.props.value).toBe('1000');
  });

  test('RED-CURR-FORM-03: Form modal shows live preview and allows swapping / changing currencies', () => {
    const { getByTestId, getByText } = render(<HomeScreen />);

    // Open form modal
    fireEvent.press(getByTestId('currency-from-box'));

    // Preset 100 EUR -> USD preview
    const preset100 = getByTestId('preset-amount-100');
    fireEvent.press(preset100);

    const previewResult = getByTestId('modal-conversion-preview');
    expect(previewResult).toBeTruthy();
    expect(within(previewResult).getByText(/115.46/)).toBeTruthy();

    // Swap currencies in modal
    const modalSwapBtn = getByTestId('modal-currency-swap-btn');
    expect(modalSwapBtn).toBeTruthy();
    fireEvent.press(modalSwapBtn);

    // 100 USD -> EUR preview (86.61)
    expect(within(previewResult).getByText(/86.61/)).toBeTruthy();
  });

  test('RED-CURR-FORM-04: Tapping Apply & Convert updates HomeScreen and closes modal', () => {
    const { getByTestId, queryByTestId, getByText } = render(<HomeScreen />);

    // Open form modal
    fireEvent.press(getByTestId('currency-from-box'));

    // Set to 500
    fireEvent.press(getByTestId('preset-amount-500'));

    // Press Apply
    const applyBtn = getByTestId('modal-apply-amount-btn');
    expect(applyBtn).toBeTruthy();
    fireEvent.press(applyBtn);

    // Modal closes
    expect(queryByTestId('currency-converter-form-modal')).toBeNull();

    // HomeScreen now reflects 500 EUR -> 577.30 USD
    expect(getByText('577.30')).toBeTruthy();
  });
});
