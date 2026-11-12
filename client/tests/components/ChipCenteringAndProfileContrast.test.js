import React from 'react';
import { StyleSheet } from 'react-native';
import { render } from '@testing-library/react-native';
import App from '../../App';
import HotelSearchScreen from '../../src/screens/booking/HotelSearchScreen';
import FlightSearchScreen from '../../src/screens/booking/FlightSearchScreen';
import ProfileScreen from '../../src/screens/account/ProfileScreen';
import { useAuthStore } from '../../src/stores/auth.store';
import { useThemeStore } from '../../src/stores/theme.store';
import { useBookingStore } from '../../src/stores/booking.store';

describe('Chip Centering, Profile Contrast & Home Logo N (RED Phase)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.setState({
      user: { id: 'usr-1', fullName: 'Duc Nguyen', email: 'duc@nomadix.app', role: 'Owner' },
      isAuthenticated: true,
      isGuest: false,
    });
    useBookingStore.setState({ bookedTickets: [], flights: [], hotels: [] });
    useThemeStore.getState().setThemeMode('light');
  });

  test('RED-LOGO-01: Dock Center Button renders Nomadix "N" Logo badge instead of lightning ⚡', () => {
    const { getByTestId, queryByText } = render(<App initialHasCompletedOnboarding={true} />);

    // Should render signature "N" logo badge
    const logoBadge = getByTestId('center-home-logo-n');
    expect(logoBadge).toBeTruthy();
    expect(logoBadge.props.children).toBeDefined();

    // The lightning bolt glyph ⚡ must be replaced
    expect(queryByText('⚡')).toBeNull();
  });

  test('RED-CHIP-01: HotelSearchScreen cityChip and FlightSearchScreen routeChip have centered text and containers', () => {
    const { getByTestId: getHotelTestId, getByText: getHotelByText } = render(<HotelSearchScreen />);
    const { getByTestId: getFlightTestId, getByText: getFlightByText } = render(<FlightSearchScreen />);

    const cityChip = getHotelTestId('city-chip-Da Nang');
    const cityFlatStyle = StyleSheet.flatten(cityChip.props.style);
    expect(cityFlatStyle.alignItems).toBe('center');
    expect(cityFlatStyle.justifyContent).toBe('center');

    const cityText = getHotelByText('Da Nang');
    const cityTextFlat = StyleSheet.flatten(cityText.props.style);
    expect(cityTextFlat.textAlign).toBe('center');
    expect(cityTextFlat.includeFontPadding).toBe(false);

    const routeChip = getFlightTestId('route-chip-SGN-DAD');
    const routeFlatStyle = StyleSheet.flatten(routeChip.props.style);
    expect(routeFlatStyle.alignItems).toBe('center');
    expect(routeFlatStyle.justifyContent).toBe('center');

    const routeText = getFlightByText('SGN ⇄ DAD');
    const routeTextFlat = StyleSheet.flatten(routeText.props.style);
    expect(routeTextFlat.textAlign).toBe('center');
    expect(routeTextFlat.includeFontPadding).toBe(false);
  });

  test('RED-PROFILE-01: ProfileScreen in light mode has high-contrast Level Badge and structured Stat Cards', () => {
    useThemeStore.getState().setThemeMode('light');
    const { getByTestId } = render(<ProfileScreen />);

    // Level Badge contrast
    const levelBadge = getByTestId('profile-level-badge');
    expect(levelBadge).toBeTruthy();
    const levelText = getByTestId('profile-level-badge-text');
    const levelTextFlat = StyleSheet.flatten(levelText.props.style);
    // Must NOT be low-contrast lemon yellow #FFD60A in light mode
    expect(levelTextFlat.color).not.toBe('#FFD60A');
    expect(levelTextFlat.color).toBe('#B45309'); // high contrast Amber-700

    // Stat Cards
    const statTrips = getByTestId('profile-stat-trips');
    expect(statTrips).toBeTruthy();
    const statTripsFlat = StyleSheet.flatten(statTrips.props.style);
    expect(statTripsFlat.borderRadius).toBeDefined();
    expect(statTripsFlat.borderWidth).toBe(1);
  });
});
