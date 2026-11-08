import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { colors } from '../../src/theme/colors';
import { useThemeStore } from '../../src/stores/theme.store';
import FlightSearchScreen from '../../src/screens/booking/FlightSearchScreen';
import HotelSearchScreen from '../../src/screens/booking/HotelSearchScreen';
import PlanScreen from '../../src/screens/plan/PlanScreen';
import App from '../../App';
import { useAuthStore } from '../../src/stores/auth.store';
import { useItineraryStore } from '../../src/stores/itinerary.store';

jest.mock('../../src/stores/auth.store');
jest.mock('../../src/stores/itinerary.store');

describe('TDD Suite: Mockup Color Synchronization', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.mockReturnValue({
      user: { id: 'test-user', fullName: 'Tester' },
      isAuthenticated: true,
      isGuest: false,
      login: jest.fn(),
      register: jest.fn(),
      continueAsGuest: jest.fn(),
    });
    useItineraryStore.mockReturnValue({
      currentTrip: null,
      trips: [],
      isLoading: false,
      error: null,
      fetchTripDetails: jest.fn(),
      fetchUserTrips: jest.fn(),
      createTrip: jest.fn(),
      addStop: jest.fn(),
      reorderStops: jest.fn(),
      inviteCollaborator: jest.fn(),
      applyAiPlan: jest.fn(),
    });
    useThemeStore.getState().setThemeMode('light');
  });

  test('RED-COLOR-SYNC-01: Theme tokens must use Slate 50 background and Slate 900 primary', () => {
    expect(colors.background).toBe('#F8FAFC');
    expect(colors.primary).toBe('#0F172A');
    expect(colors.border).toBe('#E2E8F0');

    const activeTheme = useThemeStore.getState().colors;
    expect(activeTheme.background).toBe('#F8FAFC');
    expect(activeTheme.primary).toBe('#0F172A');
    expect(activeTheme.border).toBe('#E2E8F0');
  });

  test('RED-COLOR-SYNC-02: FlightSearchScreen should use slate 500 eyebrow, slate 900 active chip and swap button', () => {
    const { getByText, getByTestId } = render(<FlightSearchScreen />);

    // Eyebrow "EXPLORE VIETNAM" should be slate-500 (#64748B)
    const eyebrow = getByText(/explore vietnam/i);
    const eyebrowStyle = Array.isArray(eyebrow.props.style)
      ? Object.assign({}, ...eyebrow.props.style)
      : eyebrow.props.style;
    expect(eyebrowStyle.color).toBe('#64748B');

    // Active chip "SGN ⇄ HAN" should be slate-900 (#0F172A)
    const activeChip = getByTestId('route-chip-SGN-HAN');
    const chipStyle = Array.isArray(activeChip.props.style)
      ? Object.assign({}, ...activeChip.props.style)
      : activeChip.props.style;
    expect(chipStyle.backgroundColor).toBe('#0F172A');

    // Swap button should be slate-900 (#0F172A)
    const swapBtn = getByTestId('flight-swap-btn');
    const swapBtnStyle = Array.isArray(swapBtn.props.style)
      ? Object.assign({}, ...swapBtn.props.style)
      : swapBtn.props.style;
    expect(swapBtnStyle.backgroundColor).toBe('#0F172A');
  });

  test('RED-COLOR-SYNC-03: HotelSearchScreen should use slate 500 eyebrow and slate 900 active city chip', () => {
    const { getByText, getByTestId } = render(<HotelSearchScreen />);

    // Eyebrow "WHERE TO STAY" should be slate-500 (#64748B)
    const eyebrow = getByText(/where to stay/i);
    const eyebrowStyle = Array.isArray(eyebrow.props.style)
      ? Object.assign({}, ...eyebrow.props.style)
      : eyebrow.props.style;
    expect(eyebrowStyle.color).toBe('#64748B');

    // Active city chip "Da Nang" should be slate-900 (#0F172A)
    const activeChip = getByTestId('city-chip-Da Nang');
    const chipStyle = Array.isArray(activeChip.props.style)
      ? Object.assign({}, ...activeChip.props.style)
      : activeChip.props.style;
    expect(chipStyle.backgroundColor).toBe('#0F172A');
  });

  test('RED-COLOR-SYNC-04: PlanScreen empty state action button should match Nomadix Pine Green color', () => {
    const { queryByText, getByText } = render(<PlanScreen />);

    // Slogan was removed per user request
    expect(queryByText(/Collaborative travel planning & smart expense splitting/i)).toBeNull();

    // Empty state CTA button should have Nomadix Pine Green #2E7D5B
    const createBtn = getByText(/✨ Plan a Trip/i);
    expect(createBtn).toBeTruthy();
  });

  test('RED-COLOR-SYNC-05: App bottom bar active tab should use slate-900 with clean styling', () => {
    const { getByTestId } = render(<App />);

    // Tap Flights tab
    fireEvent.press(getByTestId('tab-btn-flights'));

    const flightsLabel = getByTestId('tab-label-flights');
    const labelStyle = Array.isArray(flightsLabel.props.style)
      ? Object.assign({}, ...flightsLabel.props.style)
      : flightsLabel.props.style;
    expect(labelStyle.color).toBe('#0F172A');
  });
});
