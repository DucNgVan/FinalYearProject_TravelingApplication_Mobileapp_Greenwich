import React from 'react';
import { StyleSheet } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import FlightCard from '../../src/components/booking/FlightCard';
import { useThemeStore } from '../../src/stores/theme.store';

describe('Component Test: FlightCard', () => {
  const mockFlight = {
    id: 'flight-vn-101',
    airlineCode: 'VN',
    airlineName: 'Vietnam Airlines',
    flightNumber: 'VN-101',
    origin: 'SGN',
    destination: 'HAN',
    departureTime: '2026-10-15T08:00:00Z',
    arrivalTime: '2026-10-15T10:15:00Z',
    durationMinutes: 135,
    stops: 0,
    cabinClass: 'ECONOMY',
    price: { currency: 'VND', amount: 1550000 },
  };

  test('RED-FE-BK-06: FlightCard should render airline name, flight number, route, and formatted price', () => {
    const { getByText } = render(<FlightCard flight={mockFlight} />);

    expect(getByText(/Vietnam Airlines/i)).toBeTruthy();
    expect(getByText(/VN-101/i)).toBeTruthy();
    expect(getByText(/SGN/i)).toBeTruthy();
    expect(getByText(/HAN/i)).toBeTruthy();
    expect(getByText(/2h 15m/i)).toBeTruthy();
    expect(getByText(/1.550.000|1,550,000/i)).toBeTruthy();
  });

  test('RED-FE-BK-07: FlightCard should display Direct badge when stops is 0, or transit stops count when > 0', () => {
    const { getByText, rerender } = render(<FlightCard flight={mockFlight} />);
    expect(getByText(/bay thẳng|direct/i)).toBeTruthy();

    const transitFlight = { ...mockFlight, stops: 1 };
    rerender(<FlightCard flight={transitFlight} />);
    expect(getByText(/1 điểm dừng|1 stop/i)).toBeTruthy();
  });

  test('RED-FE-BK-08: FlightCard should trigger onSelect callback with flight payload when pressed', () => {
    const onSelectMock = jest.fn();
    const { getByTestId, getByText } = render(
      <FlightCard flight={mockFlight} onSelect={onSelectMock} testID="flight-card-vn-101" />
    );

    const card = getByTestId('flight-card-vn-101');
    fireEvent.press(card);

    expect(onSelectMock).toHaveBeenCalledWith(mockFlight);
  });

  test('RED-FE-BK-09: FlightCard should render airline logo Image and baggage info', () => {
    const flightWithLogo = {
      ...mockFlight,
      airlineLogo: 'https://images.kiwi.com/airlines/64x64/VN.png',
      aircraft: 'Boeing 787-9 Dreamliner',
      baggageSummary: '1 x 20kg ký gửi • 1 x 7kg xách tay',
    };
    const { getByTestId, getByText } = render(<FlightCard flight={flightWithLogo} />);

    const logoImg = getByTestId('airline-logo-image');
    expect(logoImg).toBeTruthy();
    expect(logoImg.props.source).toEqual({ uri: 'https://images.kiwi.com/airlines/64x64/VN.png' });
    expect(getByText(/Boeing 787-9/i)).toBeTruthy();
    expect(getByText(/20kg ký gửi/i)).toBeTruthy();
  });

  test('handles airline logo image error by falling back to text badge', () => {
    const flightWithLogo = {
      ...mockFlight,
      airlineLogo: 'https://invalid-url.com/logo.png',
    };
    const { getByTestId, queryByTestId } = render(<FlightCard flight={flightWithLogo} />);
    const logoImg = getByTestId('airline-logo-image');
    fireEvent(logoImg, 'error');
    expect(queryByTestId('airline-logo-image')).toBeNull();
  });

  test('should return null when flight prop is null or undefined', () => {
    const { toJSON } = render(<FlightCard flight={null} />);
    expect(toJSON()).toBeNull();
  });

  test('should safely handle flight with missing timestamps and price amount', () => {
    const minimalFlight = {
      airlineName: 'Vietjet Air',
      flightNumber: 'VJ-123',
      origin: 'DAD',
      destination: 'SGN',
      stops: 0,
      durationMinutes: null,
      price: null,
    };

    const { getByText, getByTestId } = render(
      <FlightCard flight={minimalFlight} testID="minimal-flight" />
    );

    expect(getByText('0h 0m')).toBeTruthy();
    expect(getByText(/0 [đ₫]/)).toBeTruthy();

    // Verify pressing without onSelect does not crash
    fireEvent.press(getByTestId('minimal-flight'));
  });

  test('RED-FE-TH-01: FlightCard dynamically renders dark card background (#1C1D21) and border (#2A2D35) in Dark Mode', () => {
    useThemeStore.getState().setThemeMode('dark');
    const { getByTestId } = render(<FlightCard flight={mockFlight} testID="flight-card-theme" />);
    const card = getByTestId('flight-card-theme');
    const flatStyle = StyleSheet.flatten(card.props.style);
    expect(flatStyle.backgroundColor).toBe('#1C1D21');
    expect(flatStyle.borderColor).toBe('#2A2D35');

    // Switch back to light
    useThemeStore.getState().setThemeMode('light');
  });

  test('RED-FE-FC-01: FlightCard plane icon has no hardcoded white background in dark mode', () => {
    useThemeStore.getState().setThemeMode('dark');
    const { getByTestId } = render(<FlightCard flight={mockFlight} testID="flight-card-dark" />);
    const planeIcon = getByTestId('route-plane-icon');
    const flatStyle = StyleSheet.flatten(planeIcon.props.style);
    expect(flatStyle.backgroundColor).not.toBe('#FFFFFF');
    useThemeStore.getState().setThemeMode('light');
  });

  test('RED-FE-FC-02: FlightCard renders exactly N stop dots along timeline for connecting flights', () => {
    const twoStopFlight = {
      ...mockFlight,
      stops: 2,
    };
    const { getByTestId } = render(<FlightCard flight={twoStopFlight} />);
    expect(getByTestId('stop-dot-0')).toBeTruthy();
    expect(getByTestId('stop-dot-1')).toBeTruthy();
  });

  test('RED-FE-FC-03: FlightCard renders baggage transfer indicator for connecting flights', () => {
    const transitFlight = {
      ...mockFlight,
      stops: 1,
      baggageTransfer: 'Chuyển hành lý tự động',
    };
    const { getByText } = render(<FlightCard flight={transitFlight} />);
    expect(getByText(/Chuyển hành lý tự động/i)).toBeTruthy();
  });
});

