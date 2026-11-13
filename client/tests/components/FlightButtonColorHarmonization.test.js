import React from 'react';
import { StyleSheet } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import FlightSearchScreen from '../../src/screens/booking/FlightSearchScreen';
import { useBookingStore } from '../../src/stores/booking.store';
import { useThemeStore } from '../../src/stores/theme.store';

describe('Component Test: Flight Search Button & Filter Color Harmonization', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useBookingStore.setState({
      flights: [],
      isLoadingFlights: false,
      flightError: null,
      searchFlights: jest.fn(),
    });
    useThemeStore.getState().setThemeMode('light');
  });

  test('RED-FLT-BTN-01: active preference chips (Direct, Transit, Baggage) use harmonized midnight navy (#0E1B2C / #111827) and not bright royal blue (#007AFF)', () => {
    const { getByTestId, queryByText } = render(<FlightSearchScreen />);
    const editBtn = queryByText('Edit');
    if (editBtn) fireEvent.press(editBtn);

    // Direct chip is active by default
    const directChip = getByTestId('pref-checkbox-direct');
    const directFlat = StyleSheet.flatten(directChip.props.style);
    expect(directFlat.borderColor).not.toBe('#007AFF');
    expect(directFlat.borderColor).toBe('#0E1B2C');

    // The checkbox inside Direct chip has midnight navy background
    const checkFlat = StyleSheet.flatten(getByTestId('pref-check-direct').props.style);
    expect(checkFlat.backgroundColor).not.toBe('#007AFF');
    expect(checkFlat.backgroundColor).toBe('#0E1B2C');
    expect(checkFlat.borderColor).toBe('#0E1B2C');

    // Toggle Baggage to active
    const baggageChip = getByTestId('pref-checkbox-baggage');
    fireEvent.press(baggageChip);
    const baggageFlat = StyleSheet.flatten(baggageChip.props.style);
    expect(baggageFlat.borderColor).toBe('#0E1B2C');
  });

  test('RED-FLT-BTN-02: active quick filter chips use harmonized midnight navy (#0E1B2C) border and text, not bright blue', () => {
    useBookingStore.setState({
      flights: [
        {
          id: 'flt-1',
          airlineCode: 'VN',
          airlineName: 'Vietnam Airlines',
          flightNumber: 'VN-101',
          origin: 'SGN',
          destination: 'HAN',
          departureTime: '2026-10-15T08:00:00Z',
          arrivalTime: '2026-10-15T10:15:00Z',
          stops: 0,
          price: { currency: 'VND', amount: 1550000 },
        },
      ],
    });

    const { getByTestId } = render(<FlightSearchScreen />);

    // Click direct filter chip
    const directFilterBtn = getByTestId('quick-filter-direct');
    fireEvent.press(directFilterBtn);

    const flatStyle = StyleSheet.flatten(directFilterBtn.props.style);
    expect(flatStyle.borderColor).not.toBe('#007AFF');
    expect(flatStyle.borderColor).toBe('#0E1B2C');
  });

  test('RED-FLT-BTN-03: in dark mode, active chips switch to clean high-contrast dark theme (#FFFFFF / #38BDF8) without royal blue', () => {
    useThemeStore.getState().setThemeMode('dark');
    const { getByTestId, queryByText } = render(<FlightSearchScreen />);
    const editBtn = queryByText('Edit');
    if (editBtn) fireEvent.press(editBtn);

    const directChip = getByTestId('pref-checkbox-direct');
    const directFlat = StyleSheet.flatten(directChip.props.style);
    expect(directFlat.borderColor).not.toBe('#007AFF');
    expect(directFlat.borderColor).toBe('#FFFFFF');

    const checkFlat = StyleSheet.flatten(getByTestId('pref-check-direct').props.style);
    expect(checkFlat.backgroundColor).not.toBe('#007AFF');
    expect(checkFlat.backgroundColor).toBe('#FFFFFF');
  });
});
