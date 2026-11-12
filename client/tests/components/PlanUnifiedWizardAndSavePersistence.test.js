import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import PlanScreen from '../../src/screens/plan/PlanScreen';
import { useItineraryStore } from '../../src/stores/itinerary.store';
import { usePlacesStore } from '../../src/stores/places.store';
import { useExpenseStore } from '../../src/stores/expense.store';

describe('Plan Unified Wizard & Save Persistence (TDD RED Phase)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useItineraryStore.setState({
      trips: [],
      currentTrip: null,
      isLoading: false,
      error: null,
      fetchTrips: jest.fn().mockResolvedValue([]),
      fetchTripDetails: jest.fn(),
      // Simulate API failure to verify persistence fallback
      createTrip: jest.fn().mockRejectedValue(new Error('Network error or unauthenticated')),
      addStop: jest.fn(),
      reorderStops: jest.fn(),
      deleteTrip: jest.fn(),
      inviteCollaborator: jest.fn(),
      updateCollaboratorStatus: jest.fn(),
      applyAiPlan: jest.fn(),
      setCurrentTrip: jest.fn((trip) => {
        useItineraryStore.setState({ currentTrip: trip });
      }),
    });

    usePlacesStore.setState({
      places: [],
      selectedPlaceIds: [],
      selectedCity: 'Đà Nẵng',
      searchQuery: '',
      selectedCategory: 'all',
      isLoading: false,
      error: null,
      fetchPlaces: jest.fn(),
      togglePlaceSelection: jest.fn(),
      clearSelectedPlaces: jest.fn(),
      setCity: jest.fn(),
      setSearchQuery: jest.fn(),
      setCategory: jest.fn(),
      generateAiPlan: jest.fn().mockResolvedValue({ days: [] }),
    });

    useExpenseStore.setState({
      expenses: [],
      debtSummary: { balances: {}, settlements: [] },
      isLoading: false,
      error: null,
      fetchExpenses: jest.fn(),
      createExpense: jest.fn(),
      fetchDebtSummary: jest.fn(),
      settleDebt: jest.fn(),
    });
  });

  test('RED-UNIFY-01: Header "+ New Trip" button opens the Accordion Trip Wizard', () => {
    const { getByTestId, queryByTestId } = render(<PlanScreen />);

    // Initially accordion wizard is not visible
    expect(queryByTestId('accordion-wizard-inline-container')).toBeNull();

    // Tap header "+ New Trip" button
    fireEvent.press(getByTestId('saved-trips-create-new-btn'));

    // Should open Accordion Trip Wizard
    expect(getByTestId('accordion-wizard-inline-container')).toBeTruthy();
  });

  test('RED-UNIFY-02: Saving a plan in Wizard persists to trips even on API failure and displays on Travel Plan screen', async () => {
    const { getByTestId, queryByTestId, getByText } = render(<PlanScreen />);

    // Tap header "+ New Trip" button
    fireEvent.press(getByTestId('saved-trips-create-new-btn'));

    // Step 1: Destination
    fireEvent.press(getByTestId('trending-destination-danang'));
    // Step 2: When
    fireEvent.press(getByTestId('when-next-btn'));
    // Step 3: Preferences
    fireEvent.press(getByTestId('preferences-next-btn'));
    // Step 4: Spots
    fireEvent.press(getByTestId('spot-card-my-khe'));
    fireEvent.press(getByTestId('spots-continue-btn'));
    // Step 5: Stay
    fireEvent.press(getByTestId('stay-option-hotel'));
    fireEvent.press(getByTestId('stay-continue-btn'));
    // Step 6: Finish / Share and View Plan
    fireEvent.press(getByTestId('invite-share-view-plan-btn'));

    // Verify the newly created trip is NOT lost, but rendered on the Travel Plan screen
    await waitFor(() => {
      expect(queryByTestId('saved-trips-empty-state')).toBeNull();
      expect(getByText(/Đà Nẵng Expedition/i)).toBeTruthy();
    });
  });

  test('RED-UNIFY-03: Tapping the saved trip card from Travel Plan screen opens detailed itinerary view', async () => {
    // Populate store with a saved trip
    useItineraryStore.setState({
      trips: [
        {
          id: 'saved-danang-1',
          title: 'Đà Nẵng Vacation 2026',
          destinationCity: 'Đà Nẵng',
          destination: 'Đà Nẵng',
          daysCount: 3,
          days: [
            {
              dayIndex: 1,
              items: [{ id: 'stop-1', name: 'Cầu Rồng', time: '09:00' }],
            },
          ],
        },
      ],
      currentTrip: null,
    });

    const { getByText, getByTestId } = render(<PlanScreen />);

    // Trip card is visible on Travel Plan screen
    expect(getByText('Đà Nẵng Vacation 2026')).toBeTruthy();

    // Tap the trip card
    fireEvent.press(getByTestId('trip-hero-card-saved-danang-1'));

    // Itinerary details view is now opened
    expect(getByText('Optimal Route')).toBeTruthy();
    expect(getByText(/Cầu Rồng/i)).toBeTruthy();
  });
});
