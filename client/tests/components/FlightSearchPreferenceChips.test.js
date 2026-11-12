import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import FlightSearchScreen from '../../src/screens/booking/FlightSearchScreen';
import { useBookingStore } from '../../src/stores/booking.store';
import { StyleSheet } from 'react-native';

jest.mock('../../src/stores/booking.store');

describe('Component Test: Flight Search Preference Chips Layout & Styling (RED Phase)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useBookingStore.mockReturnValue({
      flights: [],
      isLoadingFlights: false,
      flightError: null,
      searchFlights: jest.fn(),
      selectFlight: jest.fn(),
    });
  });

  test('RED-CHIP-FIX-01: prefChip must have flexBasis: 0 and flex: 1 for equal width distribution', () => {
    const { getByText, getAllByTestId } = render(<FlightSearchScreen />);
    // Open edit mode to reveal active searchBox preferences row
    fireEvent.press(getByText('Edit'));

    const directChips = getAllByTestId('pref-checkbox-direct');
    const transitChips = getAllByTestId('pref-checkbox-transit');
    const baggageChips = getAllByTestId('pref-checkbox-baggage');

    const directChip = directChips[directChips.length - 1];
    const transitChip = transitChips[transitChips.length - 1];
    const baggageChip = baggageChips[baggageChips.length - 1];

    const directStyle = StyleSheet.flatten(directChip.props.style);
    const transitStyle = StyleSheet.flatten(transitChip.props.style);
    const baggageStyle = StyleSheet.flatten(baggageChip.props.style);

    expect(directStyle.flex).toBe(1);
    expect(directStyle.flexBasis).toBe(0);

    expect(transitStyle.flex).toBe(1);
    expect(transitStyle.flexBasis).toBe(0);

    expect(baggageStyle.flex).toBe(1);
    expect(baggageStyle.flexBasis).toBe(0);
  });

  test('RED-CHIP-FIX-02: prefChip must have paddingHorizontal >= 8 to eliminate corner collision', () => {
    const { getByText, getAllByTestId } = render(<FlightSearchScreen />);
    fireEvent.press(getByText('Edit'));

    const transitChips = getAllByTestId('pref-checkbox-transit');
    const transitChip = transitChips[transitChips.length - 1];
    const transitStyle = StyleSheet.flatten(transitChip.props.style);

    expect(transitStyle.paddingHorizontal).toBeGreaterThanOrEqual(8);
  });

  test('RED-CHIP-FIX-03: preference chips render concise balanced labels (Direct, Connecting, Baggage)', () => {
    const { getByText, getAllByTestId } = render(<FlightSearchScreen />);
    fireEvent.press(getByText('Edit'));

    const directChips = getAllByTestId('pref-checkbox-direct');
    const transitChips = getAllByTestId('pref-checkbox-transit');
    const baggageChips = getAllByTestId('pref-checkbox-baggage');

    expect(directChips.length).toBeGreaterThan(0);
    expect(transitChips.length).toBeGreaterThan(0);
    expect(baggageChips.length).toBeGreaterThan(0);

    // Labels are concise and clear
    expect(getByText(/Direct/i)).toBeTruthy();
    expect(getByText(/Connecting/i)).toBeTruthy();
    expect(getByText(/Baggage/i)).toBeTruthy();
  });
});
