import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import PlanScreen from '../../src/screens/plan/PlanScreen';
import { useItineraryStore } from '../../src/stores/itinerary.store';
import { useExpenseStore } from '../../src/stores/expense.store';
import { usePlacesStore } from '../../src/stores/places.store';

jest.mock('../../src/stores/itinerary.store');
jest.mock('../../src/stores/expense.store');
jest.mock('../../src/stores/places.store');

describe('Component Test: PlanScreen Multi-City Wizard Integration', () => {
  const mockCreateTrip = jest.fn();
  const mockApplyAiPlan = jest.fn();
  const mockGenerateAiPlan = jest.fn();

  const mockPlaces = [
    {
      id: 'plc-1',
      name: 'Bán đảo Sơn Trà',
      city: 'Đà Nẵng',
      category: 'nature',
      rating: 4.8,
      lat: 16.102,
      lng: 108.263,
      priceVnd: 0,
    },
    {
      id: 'plc-2',
      name: 'Chùa Cầu Hội An',
      city: 'Hội An',
      category: 'historic',
      rating: 4.7,
      lat: 15.877,
      lng: 108.326,
      priceVnd: 50000,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    mockCreateTrip.mockResolvedValue({
      id: 'trip-wizard-1',
      title: 'Hành trình: Đà Nẵng - Hội An',
      destination: 'Đà Nẵng - Hội An',
      startDate: '2026-11-01',
      endDate: '2026-11-03',
      days: [],
    });

    mockGenerateAiPlan.mockResolvedValue({
      days: [
        {
          dayIndex: 1,
          date: '2026-11-01',
          items: [{ name: 'Bán đảo Sơn Trà', arrivalTime: '09:00', durationMinutes: 90 }],
        },
      ],
    });

    useItineraryStore.mockReturnValue({
      currentTrip: null,
      trips: [],
      isLoading: false,
      error: null,
      fetchTrips: jest.fn(),
      fetchTripDetails: jest.fn(),
      createTrip: mockCreateTrip,
      applyAiPlan: mockApplyAiPlan,
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
      places: mockPlaces,
      selectedPlaceIds: new Set(),
      togglePlaceSelection: jest.fn(),
      generateAiPlan: mockGenerateAiPlan,
    });
  });

  test('RED-FE-PLAN-WIZ-01: enters creation mode from empty state with "✨ AI Itinerary Planning" button', () => {
    const { getByText, getByTestId } = render(<PlanScreen />);

    // Tap CTA to enter creation mode
    fireEvent.press(getByText(/✨ Plan a Trip/i));

    const aiBtn = getByText(/✨ AI Itinerary Planning/i);
    expect(aiBtn).toBeTruthy();

    // Journey route bar elements should appear
    expect(getByTestId('journey-route-bar')).toBeTruthy();
  });

  test('RED-FE-PLAN-WIZ-02: allows switching between Create Plan and My Saved Plans list smoothly', () => {
    const { getByTestId, queryByTestId, getByText } = render(<PlanScreen />);

    // Starts on Saved Plans list
    expect(getByTestId('saved-trips-list')).toBeTruthy();

    // Enter creation mode
    fireEvent.press(getByText(/✨ Plan a Trip/i));
    expect(getByTestId('journey-route-bar')).toBeTruthy();

    // Return to Saved Plans list via back button
    fireEvent.press(getByTestId('plan-back-to-list-btn'));
    expect(getByTestId('saved-trips-list')).toBeTruthy();
  });

  test('RED-FE-PLAN-WIZ-03: completes unified flow, calls createTrip, generates AI plan, applies clustered days, and lands on itinerary', async () => {
    const { getByText, getByTestId } = render(<PlanScreen />);

    // Enter creation mode
    fireEvent.press(getByText(/✨ Plan a Trip/i));

    // Tap AI Itinerary Planning
    fireEvent.press(getByText(/✨ AI Itinerary Planning/i));

    await waitFor(() => {
      expect(mockCreateTrip).toHaveBeenCalledWith(
        expect.objectContaining({
          title: expect.stringMatching(/Journey|Hành trình/i),
          destination: expect.any(String),
        })
      );
      expect(mockApplyAiPlan).toHaveBeenCalled();
    });
  });

  test('RED-FE-PLAN-WIZ-04: allows launching wizard from Map sub-tab when viewing an existing trip', () => {
    const existingTrip = {
      id: 'trip-202',
      title: 'Current Trip',
      destination: 'Đà Nẵng',
      startDate: '2026-11-01',
      endDate: '2026-11-03',
      collaborators: [],
      days: [],
    };

    useItineraryStore.mockReturnValue({
      currentTrip: existingTrip,
      trips: [existingTrip],
      isLoading: false,
      error: null,
      fetchTrips: jest.fn(),
      fetchTripDetails: jest.fn(),
      createTrip: mockCreateTrip,
      applyAiPlan: mockApplyAiPlan,
    });

    const { getByText } = render(<PlanScreen />);

    // Switch to Map sub-tab
    fireEvent.press(getByText(/Map & Places|Map & Discovery/i));

    // Should see shortcut to launch multi-city wizard
    const launchWizardBtn = getByText(/✨ Smart Wizard|Journey Wizard/i);
    expect(launchWizardBtn).toBeTruthy();

    fireEvent.press(launchWizardBtn);

    // Wizard should now be open
    expect(getByText(/1\. Select your destinations/i)).toBeTruthy();
  });
});
