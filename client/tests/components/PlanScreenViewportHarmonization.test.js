import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
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

describe('Component & Viewport Test: PlanScreen & Create Trip Viewport Harmonization', () => {
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
      createTrip: jest.fn().mockResolvedValue({ id: 'trip-vp-1' }),
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
      places: [
        { id: 'p-1', name: 'Dragon Bridge', city: 'Da Nang', category: 'landmark', rating: 4.8 },
      ],
      selectedPlaceIds: new Set(),
      searchQuery: '',
      activeCategory: 'all',
      isLoading: false,
      fetchPlaces: jest.fn(),
      generateAiPlan: jest.fn().mockResolvedValue({ days: [] }),
    });
  });

  test('RED-FE-PLAN-VP-01: PlanScreen displays standard 3-tier header (ITINERARY & SQUAD, Travel Plan, subtitle) with container paddingTop 16', () => {
    const { getByText, getByTestId } = render(<PlanScreen />);

    // Expect standard header elements matching other tabs
    expect(getByText(/ITINERARY & SQUAD/i)).toBeTruthy();
    expect(getByText(/^Travel Plan$/i)).toBeTruthy();

    // Verify container padding is 16 matching other screens
    const container = getByTestId('plan-screen-container');
    expect(container.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          paddingTop: 16,
          paddingHorizontal: 16,
        }),
      ])
    );
  });

  test('RED-FE-PLAN-VP-02: Pressing + New Trip opens the unified Trip Wizard', () => {
    const { getByTestId } = render(<PlanScreen />);

    // Press + New Trip to open unified Trip Wizard
    const createBtn = getByTestId('saved-trips-create-new-btn');
    fireEvent.press(createBtn);

    expect(getByTestId('accordion-wizard-inline-container')).toBeTruthy();
  });

  test('RED-FE-PLAN-VP-03: App.js root SafeAreaView uses themeColors.background instead of hardcoded #F5F6F8 to eliminate status bar gap', () => {
    const { getByTestId } = render(<App initialTab="plan" />);

    // App root SafeAreaView should use lightColors.background (#F8FAFC)
    const appContainer = getByTestId('app-root-safe-area');
    expect(appContainer.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          backgroundColor: lightColors.background,
        }),
      ])
    );
  });
});
