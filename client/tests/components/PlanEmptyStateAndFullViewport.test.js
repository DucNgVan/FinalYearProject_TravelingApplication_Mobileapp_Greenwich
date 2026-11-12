import React from 'react';
import { render } from '@testing-library/react-native';
import PlanScreen from '../../src/screens/plan/PlanScreen';
import App from '../../App';
import { useItineraryStore } from '../../src/stores/itinerary.store';
import { useExpenseStore } from '../../src/stores/expense.store';
import { usePlacesStore } from '../../src/stores/places.store';
import { useAuthStore } from '../../src/stores/auth.store';
import { lightColors } from '../../src/stores/theme.store';

jest.mock('../../src/stores/itinerary.store');
jest.mock('../../src/stores/expense.store');
jest.mock('../../src/stores/places.store');
jest.mock('../../src/stores/auth.store');

describe('Component & Viewport Test: Plan Empty State, Remove Duplicate Sub-bar & Full Screen Background', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useAuthStore.mockReturnValue({
      user: { fullName: 'Alex Rivera', email: 'alex@nomadix.com' },
      isAuthenticated: true,
      isGuest: false,
      logout: jest.fn(),
    });

    useItineraryStore.mockReturnValue({
      currentTrip: null,
      trips: [],
      isLoading: false,
      error: null,
      fetchTrips: jest.fn(),
      fetchTripDetails: jest.fn(),
      createTrip: jest.fn().mockResolvedValue({ id: 'trip-ev-1' }),
      addStop: jest.fn(),
      inviteCompanion: jest.fn(),
      applyAiPlan: jest.fn(),
    });

    useExpenseStore.mockReturnValue({
      expenses: [],
      debtSummary: null,
      isLoading: false,
      error: null,
      fetchTripExpenses: jest.fn(),
      fetchDebtSummary: jest.fn(),
    });

    usePlacesStore.mockReturnValue({
      places: [],
      selectedPlaceIds: new Set(),
      searchQuery: '',
      activeCategory: 'all',
      isLoading: false,
      fetchPlaces: jest.fn(),
      generateAiPlan: jest.fn().mockResolvedValue({ days: [] }),
    });
  });

  test('RED-FE-PLAN-EV-01: Removed duplicate savedTripsHeaderRow (My Saved Trips (0) bar) leaving clean empty state', () => {
    const { queryByText, getByText } = render(<PlanScreen />);

    // Main 3-tier header should be present
    expect(getByText(/ITINERARY & SQUAD/i)).toBeTruthy();
    expect(getByText(/^Travel Plan$/i)).toBeTruthy();

    // The redundant duplicate "My Saved Trips (0)" bar that was cropped in the screenshot should NOT exist
    expect(queryByText(/^My Saved Trips/i)).toBeNull();
  });

  test('RED-FE-PLAN-EV-02: Empty state scroll view has flexGrow 1 and justifyContent center to fill full viewport height', () => {
    const { getByTestId } = render(<PlanScreen />);

    const scrollView = getByTestId('saved-trips-scroll-view');

    expect(scrollView.props.contentContainerStyle).toEqual(
      expect.objectContaining({
        flexGrow: 1,
        justifyContent: 'center',
      })
    );
  });

  test('RED-FE-PLAN-EV-03: App.js SafeAreaProvider has flex: 1 and matches themeColors.background', () => {
    const { getByTestId } = render(<App initialTab="plan" />);

    const safeAreaProvider = getByTestId('app-root-safe-area-provider');

    expect(safeAreaProvider.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          flex: 1,
        }),
        expect.objectContaining({
          backgroundColor: lightColors.background,
        }),
      ])
    );
  });
});
