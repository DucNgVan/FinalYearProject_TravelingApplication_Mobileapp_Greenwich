import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import PlanScreen from '../../src/screens/plan/PlanScreen';
import { useItineraryStore } from '../../src/stores/itinerary.store';
import { useExpenseStore } from '../../src/stores/expense.store';

jest.mock('../../src/stores/itinerary.store');
jest.mock('../../src/stores/expense.store');

describe('Component Test: PlanScreen Empty State & Creation Flow', () => {
  const mockCreateTrip = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useItineraryStore.mockReturnValue({
      currentTrip: null,
      trips: [],
      isLoading: false,
      error: null,
      fetchTrips: jest.fn(),
      fetchTripDetails: jest.fn(),
      createTrip: mockCreateTrip,
    });

    useExpenseStore.mockReturnValue({
      expenses: [],
      debtSummary: null,
      isLoading: false,
      error: null,
      fetchTripExpenses: jest.fn(),
      fetchDebtSummary: jest.fn(),
    });
  });

  test('RED-EN-PLAN-01: renders clean empty state when no trips exist, and launches creation flow on press', () => {
    const { getByText, queryByText, getByTestId } = render(<PlanScreen />);

    // Empty state elements
    expect(getByTestId('saved-trips-empty-state')).toBeTruthy();
    expect(getByText(/No Travel Plans Yet/i)).toBeTruthy();

    const startBtn = getByTestId('saved-trips-empty-btn');
    expect(startBtn).toBeTruthy();

    // Tap to launch creation flow
    fireEvent.press(startBtn);

    // Now PlanMapDiscovery is rendered
    expect(getByTestId('map-bottom-bar')).toBeTruthy();
  });

  test('RED-EN-PLAN-02: creation mode contains back button to return to saved plans list', () => {
    const { getByTestId } = render(<PlanScreen />);

    // Tap create
    fireEvent.press(getByTestId('saved-trips-empty-btn'));

    // Has back button
    const backBtn = getByTestId('plan-back-to-list-btn');
    expect(backBtn).toBeTruthy();

    fireEvent.press(backBtn);

    // Returns to saved trips list
    expect(getByTestId('saved-trips-list')).toBeTruthy();
  });
});
