import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import HomeScreen from '../../src/screens/home/HomeScreen';
import { useCurrencyStore } from '../../src/stores/currency.store';
import { useItineraryStore } from '../../src/stores/itinerary.store';
import { useThemeStore } from '../../src/stores/theme.store';

describe('Component Test: HomeScreen Live Real-Time Currency Converter', () => {
  beforeEach(() => {
    useThemeStore.getState().setThemeMode('light');
    useItineraryStore.setState({ trips: [] });
    useCurrencyStore.setState({
      base: 'USD',
      rates: {
        USD: 1,
        EUR: 0.8661, // 1 EUR = 1.1546 USD
        VND: 25400,
        JPY: 154.2,
        GBP: 0.78,
      },
      lastUpdated: '2026-11-13',
      isLoading: false,
      error: null,
    });
  });

  test('RED-FE-HOME-CURR-01: HomeScreen currency widget renders formula and conversion inputs', () => {
    const { getByTestId, getByText } = render(<HomeScreen />);

    // From input and initial amounts
    const fromInput = getByTestId('currency-from-input');
    expect(fromInput.props.value).toBe('100');

    // Converted amount: 100 EUR = 115.46 USD (100 / 0.8661)
    expect(getByText('115.46')).toBeTruthy();
    expect(getByText(/1 EUR = 1.1546 USD/i)).toBeTruthy();
  });

  test('RED-FE-HOME-CURR-02: Typing new amount and pressing swap button dynamically updates converted amount', () => {
    const { getByTestId, getByText } = render(<HomeScreen />);

    const fromInput = getByTestId('currency-from-input');
    fireEvent.changeText(fromInput, '200');

    // 200 EUR = 230.92 USD
    expect(getByText('230.92')).toBeTruthy();

    // Press swap button: flips from EUR/USD to USD/EUR
    const swapBtn = getByTestId('currency-swap-btn');
    fireEvent.press(swapBtn);

    // 200 USD = 173.22 EUR (200 * 0.8661)
    expect(getByText('173.22')).toBeTruthy();
    expect(getByText(/1 USD = 0.8661 EUR/i)).toBeTruthy();
  });
});
