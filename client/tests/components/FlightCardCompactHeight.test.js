import React from 'react';
import { StyleSheet } from 'react-native';
import { render, act } from '@testing-library/react-native';
import FlightCard from '../../src/components/booking/FlightCard';
import { useThemeStore } from '../../src/stores/theme.store';

describe('TDD RED: FlightCard Compact Boarding Pass & Absolute Perforation Layout', () => {
  const sampleFlight = {
    id: 'flt-vj-1513',
    airline: 'VietJet Air',
    airlineCode: 'VJ',
    flightNumber: 'VJ-1513',
    aircraft: 'Airbus A321',
    origin: 'HAN',
    originCity: 'Hà Nội',
    destination: 'DAD',
    destinationCity: 'Đà Nẵng',
    departureTime: '2026-11-14T22:25:00Z',
    arrivalTime: '2026-11-14T23:45:00Z',
    durationMinutes: 80,
    stops: 0,
    price: { amount: 1168290, currency: 'VND' },
    cabinClass: 'ECONOMY',
    availableSeats: 30,
    baggageSummary: '1 kiện ký gửi (20kg) • 1 kiện xách tay (7kg)',
  };

  beforeEach(() => {
    useThemeStore.getState().setThemeMode('light');
  });

  test('RED-CARD-HEIGHT-01: perforationWrapper must be absolutely positioned to prevent Yoga height stretch', () => {
    const { getByTestId } = render(<FlightCard flight={sampleFlight} />);

    const perforationLine = getByTestId('ticket-perforation-line');
    const flatWrapperStyle = StyleSheet.flatten(perforationLine.props.style);

    // Must be position: absolute, not in-flow relative stretching the card
    expect(flatWrapperStyle.position).toBe('absolute');
    expect(flatWrapperStyle.top).toBe(0);
    expect(flatWrapperStyle.bottom).toBe(0);
  });

  test('RED-CARD-NOTCH-02: perforation notches use theme background color (#F8FAFC in light, #121316 in dark)', () => {
    // Light mode test
    useThemeStore.getState().setThemeMode('light');
    const { getByTestId, rerender } = render(<FlightCard flight={sampleFlight} />);

    const perforationLine = getByTestId('ticket-perforation-line');
    const notchTop = perforationLine.props.children[0];
    const flatNotchStyle = StyleSheet.flatten(notchTop.props.style);

    expect(flatNotchStyle.backgroundColor).toBe('#F8FAFC');

    // Dark mode test
    act(() => {
      useThemeStore.getState().setThemeMode('dark');
    });
    rerender(<FlightCard flight={sampleFlight} />);

    const darkPerforationLine = getByTestId('ticket-perforation-line');
    const darkNotchTop = darkPerforationLine.props.children[0];
    const darkNotchStyle = StyleSheet.flatten(darkNotchTop.props.style);

    expect(darkNotchStyle.backgroundColor).toBe('#121316');
  });

  test('RED-CARD-ALIGN-03: card marginHorizontal must be 0 to align with search container and maxHeight <= 240', () => {
    const { getByTestId } = render(<FlightCard flight={sampleFlight} testID="test-flight-card" />);

    const card = getByTestId('test-flight-card');
    const flatCardStyle = StyleSheet.flatten(card.props.style);

    // Must NOT have marginHorizontal: 16 causing double inset with FlatList container
    expect(flatCardStyle.marginHorizontal).toBe(0);
    expect(flatCardStyle.maxHeight).toBeDefined();
    expect(flatCardStyle.maxHeight).toBeLessThanOrEqual(240);
  });
});
