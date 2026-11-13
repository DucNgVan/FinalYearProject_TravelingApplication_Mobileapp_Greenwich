import React from 'react';
import { StyleSheet } from 'react-native';
import { render } from '@testing-library/react-native';
import PlanScreen from '../../src/screens/plan/PlanScreen';
import LoginScreen from '../../src/screens/auth/LoginScreen';
import ProfileScreen from '../../src/screens/account/ProfileScreen';
import HotelSearchScreen from '../../src/screens/booking/HotelSearchScreen';
import FlightSearchScreen from '../../src/screens/booking/FlightSearchScreen';
import { useThemeStore } from '../../src/stores/theme.store';
import { useAuthStore } from '../../src/stores/auth.store';
import { useItineraryStore } from '../../src/stores/itinerary.store';
import { useBookingStore } from '../../src/stores/booking.store';

jest.mock('../../src/stores/auth.store');

describe('UI Deletions & Dark Mode Contrast Fixes (RED Phase)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.mockReturnValue({
      user: { id: 'usr-1', fullName: 'Duc Nguyen', email: 'duc@nomadix.app' },
      logout: jest.fn(),
      login: jest.fn(),
    });
    useBookingStore.setState({ bookedTickets: [], flights: [], hotels: [] });
  });

  test('RED-DEL-01: PlanScreen should NOT contain "Collaborative travel planning & smart expense splitting"', () => {
    useItineraryStore.setState({
      currentTrip: {
        id: 'trip-1',
        title: 'Trip to Da Nang',
        days: [{ dayNumber: 1, stops: [] }],
        collaborators: [{ userId: 'usr-1', role: 'VIEWER', status: 'ACCEPTED' }],
      },
    });

    const { queryByText } = render(<PlanScreen />);
    expect(queryByText('Collaborative travel planning & smart expense splitting')).toBeNull();
  });

  test('RED-DEL-02: LoginScreen should NOT contain "1-Tap: Vào ngay Demo"', () => {
    const { queryByText } = render(<LoginScreen navigation={{ navigate: jest.fn() }} />);
    expect(queryByText(/1-Tap: Vào ngay Demo/i)).toBeNull();
  });

  test('RED-CONTRAST-01: PlanScreen VIEWER badge in dark mode has readable light text (#FFFFFF)', () => {
    useThemeStore.getState().setThemeMode('dark');
    useItineraryStore.setState({
      currentTrip: {
        id: 'trip-1',
        title: 'Trip to Da Nang',
        days: [{ dayNumber: 1, stops: [] }],
        collaborators: [{ userId: 'usr-1', fullName: 'Viewer User', role: 'VIEWER', status: 'ACCEPTED' }],
      },
    });

    const { getByText } = render(<PlanScreen />);
    const roleText = getByText('VIEWER');
    const flatStyle = StyleSheet.flatten(roleText.props.style);
    expect(flatStyle.color).toBe('#FFFFFF');

    useThemeStore.getState().setThemeMode('light');
  });

  test('RED-CONTRAST-02: ProfileScreen action menu items in dark mode have bright white text color (#FFFFFF)', () => {
    useThemeStore.getState().setThemeMode('dark');
    const { getByText } = render(<ProfileScreen />);
    const menuTitle = getByText('My Tickets');
    const flatStyle = StyleSheet.flatten(menuTitle.props.style);
    expect(flatStyle.color).toBe('#FFFFFF');

    useThemeStore.getState().setThemeMode('light');
  });

  test('RED-CONTRAST-03: HotelSearchScreen and FlightSearchScreen selected chip text is NOT white on white in dark mode', () => {
    useThemeStore.getState().setThemeMode('dark');
    const { getByTestId } = render(<HotelSearchScreen />);
    const selectedChip = getByTestId('city-chip-Da Nang');
    const flatChipStyle = StyleSheet.flatten(selectedChip.props.style);

    const chipText = selectedChip.findByType('Text');
    const flatTextStyle = StyleSheet.flatten(chipText.props.style);

    // If background is white (#FFFFFF), text MUST NOT be white (#FFFFFF)
    if (flatChipStyle.backgroundColor === '#FFFFFF') {
      expect(flatTextStyle.color).not.toBe('#FFFFFF');
    }

    useThemeStore.getState().setThemeMode('light');
  });
});
