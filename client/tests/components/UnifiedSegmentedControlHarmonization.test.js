import React from 'react';
import { StyleSheet } from 'react-native';
import { render } from '@testing-library/react-native';
import FlightSearchScreen from '../../src/screens/booking/FlightSearchScreen';
import PlanScreen from '../../src/screens/plan/PlanScreen';
import ProfileScreen from '../../src/screens/account/ProfileScreen';
import { useBookingStore } from '../../src/stores/booking.store';
import { useAuthStore } from '../../src/stores/auth.store';
import { useItineraryStore } from '../../src/stores/itinerary.store';

jest.mock('../../src/stores/booking.store');
jest.mock('../../src/stores/auth.store');

describe('Unified Segmented Control Capsule Harmonization (TDD RED)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useBookingStore.mockReturnValue({
      flights: [],
      isLoadingFlights: false,
      flightError: null,
      searchFlights: jest.fn(),
      bookedTickets: [],
    });
    useAuthStore.mockReturnValue({
      user: { id: 'u-1', fullName: 'John Doe', email: 'traveler@nomadix.vn' },
      logout: jest.fn(),
    });
    useItineraryStore.setState({
      currentTrip: {
        id: 'trip-1',
        title: 'Danang Vacation 2026',
        destinationCity: 'Da Nang',
        startDate: '2026-11-14',
        endDate: '2026-11-17',
        collaborators: [{ userId: 'u-1', name: 'John Doe', role: 'OWNER' }],
        days: [{ dayNumber: 1, items: [] }],
      },
      trips: [],
    });
  });

  test('RED-SEG-01: FlightSearchScreen tripTypeRow uses canonical capsule segmented styling (borderRadius: 24, track #EAECEF / #1C1D21, pills borderRadius: 20)', () => {
    const { getByTestId } = render(<FlightSearchScreen />);
    const tripTypeRow = getByTestId('flight-trip-type-segmented');
    expect(tripTypeRow).toBeTruthy();

    const flatContainerStyle = StyleSheet.flatten(tripTypeRow.props.style);
    expect(flatContainerStyle.borderRadius).toBe(24);
    expect(flatContainerStyle.padding).toBe(4);
    expect(['#EAECEF', '#1C1D21']).toContain(flatContainerStyle.backgroundColor);

    const activePill = getByTestId('flight-triptype-pill-oneway');
    const flatActiveStyle = StyleSheet.flatten(activePill.props.style);
    expect(flatActiveStyle.borderRadius).toBe(20);
    expect(['#111827', '#FFFFFF']).toContain(flatActiveStyle.backgroundColor);
  });

  test('RED-SEG-02: PlanScreen subTabBar uses canonical capsule segmented styling (borderRadius: 24, border: 0, pills borderRadius: 20)', () => {
    const { getByTestId } = render(<PlanScreen />);
    const subTabBar = getByTestId('plan-subtabs-segmented');
    expect(subTabBar).toBeTruthy();

    const flatContainerStyle = StyleSheet.flatten(subTabBar.props.style);
    expect(flatContainerStyle.borderRadius).toBe(24);
    expect(flatContainerStyle.padding).toBe(4);
    expect(flatContainerStyle.borderWidth === 0 || !flatContainerStyle.borderWidth).toBe(true);
    expect(['#EAECEF', '#1C1D21']).toContain(flatContainerStyle.backgroundColor);

    const activeSubTab = getByTestId('plan-subtab-itinerary');
    const flatActiveStyle = StyleSheet.flatten(activeSubTab.props.style);
    expect(flatActiveStyle.borderRadius).toBe(20);
    expect(['#111827', '#FFFFFF']).toContain(flatActiveStyle.backgroundColor);
  });

  test('RED-SEG-03: ProfileScreen themePillsRow uses canonical capsule segmented container (borderRadius: 24, borderless pills borderRadius: 20)', () => {
    const { getByTestId } = render(<ProfileScreen />);
    const themeRow = getByTestId('app-theme-segmented');
    expect(themeRow).toBeTruthy();

    const flatContainerStyle = StyleSheet.flatten(themeRow.props.style);
    expect(flatContainerStyle.borderRadius).toBe(24);
    expect(flatContainerStyle.padding).toBe(4);
    expect(['#EAECEF', '#1C1D21']).toContain(flatContainerStyle.backgroundColor);

    const lightPill = getByTestId('theme-pill-light');
    const flatPillStyle = StyleSheet.flatten(lightPill.props.style);
    expect(flatPillStyle.borderRadius).toBe(20);
    expect(flatPillStyle.borderWidth === 0 || !flatPillStyle.borderWidth).toBe(true);
  });
});
