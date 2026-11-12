import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import PlanScreen from '../../src/screens/plan/PlanScreen';
import { useItineraryStore } from '../../src/stores/itinerary.store';
import { usePlacesStore } from '../../src/stores/places.store';
import { useExpenseStore } from '../../src/stores/expense.store';

describe('PlanScreen Header & Saved Trips Image Match (TDD RED Phase)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useItineraryStore.setState({
      trips: [],
      currentTrip: null,
      isLoading: false,
      error: null,
      fetchUserTrips: jest.fn().mockResolvedValue([]),
      fetchTripDetails: jest.fn(),
      createTrip: jest.fn().mockImplementation((payload) => {
        const newTrip = { id: 'new-trip-123', ...payload };
        useItineraryStore.setState((state) => ({
          trips: [newTrip, ...state.trips],
          currentTrip: null, // Remains on Travel Plan screen
        }));
        return Promise.resolve(newTrip);
      }),
      addStop: jest.fn(),
      reorderStops: jest.fn(),
      deleteTrip: jest.fn(),
      inviteCollaborator: jest.fn(),
      updateCollaboratorStatus: jest.fn(),
      applyAiPlan: jest.fn(),
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

  test('RED-PLN-HDR-01: Removes subtitle "Manage squad itineraries & multi-city routes • My Trips"', () => {
    const { queryByText } = render(<PlanScreen />);

    expect(
      queryByText(/Manage squad itineraries & multi-city routes/i)
    ).toBeNull();
  });

  test('RED-PLN-HDR-02: Removes the "< Your Itinerary ✕" header bar', () => {
    // When a trip exists or is active
    useItineraryStore.setState({
      currentTrip: {
        id: 'trip-1',
        title: 'Đà Nẵng Squad Vacation',
        destinationCity: 'Đà Nẵng',
        daysCount: 3,
        days: [{ dayIndex: 1, items: [] }],
      },
    });

    const { queryByText, queryByTestId } = render(<PlanScreen />);

    expect(queryByText('Your Itinerary')).toBeNull();
    expect(queryByTestId('itinerary-header-title')).toBeNull();
  });

  test('RED-PLN-HDR-03: Header always displays ITINERARY & SQUAD, Travel Plan, and + New Trip button', () => {
    const { getByText, getByTestId } = render(<PlanScreen />);

    expect(getByText(/ITINERARY & SQUAD/i)).toBeTruthy();
    expect(getByText('Travel Plan')).toBeTruthy();
    expect(getByTestId('saved-trips-create-new-btn')).toBeTruthy();
    expect(getByText('+ New Trip')).toBeTruthy();
  });

  test('RED-PLN-HDR-04: Newly created trip appears directly in Travel Plan screen replacing empty state', async () => {
    const { getByTestId, queryByTestId, getByText } = render(<PlanScreen />);

    // Initially empty
    expect(getByTestId('saved-trips-empty-state')).toBeTruthy();

    // Open wizard
    fireEvent.press(getByTestId('plan-open-accordion-wizard-btn'));

    // Select destination in wizard: Da Nang
    fireEvent.press(getByTestId('trending-destination-danang'));
    fireEvent.press(getByTestId('when-next-btn'));
    fireEvent.press(getByTestId('preferences-next-btn'));
    fireEvent.press(getByTestId('spot-card-my-khe'));
    fireEvent.press(getByTestId('spots-continue-btn'));
    fireEvent.press(getByTestId('stay-option-hotel'));
    fireEvent.press(getByTestId('stay-continue-btn'));
    fireEvent.press(getByTestId('invite-share-view-plan-btn'));

    // Should return to Travel Plan screen and show newly created trip in list
    await waitFor(() => {
      expect(queryByTestId('saved-trips-empty-state')).toBeNull();
      expect(getByText(/Đà Nẵng Expedition/i)).toBeTruthy();
    });
  });
});
