import React from 'react';
import { render } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';
import SandboxBookingModal from '../../src/components/booking/SandboxBookingModal';
import { useThemeStore } from '../../src/stores/theme.store';

describe('Frontend Test: Flight Booking Full-Page View & Black-and-White Theme Harmonization', () => {
  const mockFlight = {
    id: 'off_duffel_bw_001',
    provider: 'DUFFEL',
    airlineCode: 'VN',
    airlineName: 'Vietnam Airlines',
    flightNumber: 'VN-0240',
    origin: 'SGN',
    destination: 'HAN',
    price: { currency: 'VND', amount: 2000000 },
  };

  beforeEach(() => {
    useThemeStore.getState().setThemeMode('light');
  });

  it('RED-FLT-FULL-01: renders SandboxBookingModal as a full-page view covering 100% of the screen', () => {
    const { getByTestId, queryByTestId } = render(
      <SandboxBookingModal
        visible={true}
        flight={mockFlight}
        onClose={jest.fn()}
      />
    );

    const fullPage = getByTestId('flight-booking-full-page');
    expect(fullPage).toBeTruthy();
    const flatStyle = StyleSheet.flatten(fullPage.props.style);
    expect(flatStyle.flex).toBe(1);

    // Should NOT have a dim half-sheet modal backdrop
    expect(queryByTestId('booking-sheet-backdrop')).toBeNull();
  });

  it('RED-FLT-THEME-02: adheres strictly to Black-and-White (Đen - Trắng) theme tokens without blue/cyan', () => {
    const { getByTestId } = render(
      <SandboxBookingModal
        visible={true}
        flight={mockFlight}
        onClose={jest.fn()}
      />
    );

    // Stepper active indicator line uses black/slate-900 in light mode
    const indicatorLine = getByTestId('stepper-indicator-line');
    const flatIndicator = StyleSheet.flatten(indicatorLine.props.style);
    expect(['#0E1B2C', '#0F172A', '#111827']).toContain(flatIndicator.backgroundColor);

    // Continue button uses solid black/slate-900
    const continueBtn = getByTestId('btn-continue-fare');
    const flatBtn = StyleSheet.flatten(continueBtn.props.style);
    expect(['#0E1B2C', '#0F172A', '#111827']).toContain(flatBtn.backgroundColor);

    // Classic selected card border uses black/slate-900
    const classicCard = getByTestId('fare-tier-classic');
    const flatCard = StyleSheet.flatten(classicCard.props.style);
    expect(['#0E1B2C', '#0F172A', '#111827']).toContain(flatCard.borderColor);

    // Most popular badge uses black/slate-900
    const popularBadge = getByTestId('fare-tier-popular-badge');
    const flatBadge = StyleSheet.flatten(popularBadge.props.style);
    expect(['#0E1B2C', '#0F172A', '#111827']).toContain(flatBadge.backgroundColor);
  });
});
