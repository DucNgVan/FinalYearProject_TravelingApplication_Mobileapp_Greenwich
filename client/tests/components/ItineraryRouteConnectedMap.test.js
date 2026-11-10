import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import PlanScreen from '../../src/screens/plan/PlanScreen';
import { useItineraryStore } from '../../src/stores/itinerary.store';
import { useExpenseStore } from '../../src/stores/expense.store';
import { usePlacesStore } from '../../src/stores/places.store';

jest.mock('../../src/stores/itinerary.store');
jest.mock('../../src/stores/expense.store');
jest.mock('../../src/stores/places.store');

describe('Itinerary Connected Route Map on Map & Places Tab (TDD RED Phase)', () => {
  const mockTrip = {
    id: 'trip-danang-1',
    title: 'Da Nang Squad Vacation',
    destinationCity: 'Đà Nẵng',
    startDate: '2026-11-20',
    endDate: '2026-11-23',
    daysCount: 3,
    status: 'Ready',
    days: [
      {
        dayIndex: 1,
        date: '2026-11-20',
        totalDistanceKm: 6.2,
        items: [
          {
            id: 'stop-1',
            title: 'Dragon Bridge (Cầu Rồng)',
            category: 'landmark',
            lat: 16.061,
            lng: 108.227,
            startTime: '09:00',
            duration: 90,
            transitToNext: { mode: 'walking', distanceKm: 0.8, durationMin: 11 },
          },
          {
            id: 'stop-2',
            title: 'My Khe Beach',
            category: 'beach',
            lat: 16.059,
            lng: 108.243,
            startTime: '10:45',
            duration: 120,
            transitToNext: { mode: 'driving', distanceKm: 4.5, durationMin: 15 },
          },
          {
            id: 'stop-3',
            title: 'Museum of Cham Sculpture',
            category: 'culture',
            lat: 16.060,
            lng: 108.223,
            startTime: '13:30',
            duration: 90,
          },
        ],
      },
      {
        dayIndex: 2,
        date: '2026-11-21',
        totalDistanceKm: 18.5,
        items: [
          {
            id: 'stop-4',
            title: 'Ba Na Hills & Golden Bridge',
            category: 'landmark',
            lat: 15.998,
            lng: 108.016,
            startTime: '08:30',
            duration: 240,
          },
        ],
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();

    useItineraryStore.mockReturnValue({
      currentTrip: mockTrip,
      trips: [mockTrip],
      isLoading: false,
      error: null,
      fetchTrips: jest.fn(),
      fetchTripDetails: jest.fn().mockResolvedValue(mockTrip),
      createTrip: jest.fn(),
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
        { id: 'p-1', name: 'Dragon Bridge', city: 'Đà Nẵng', category: 'landmark', rating: 4.9 },
      ],
      selectedPlaceIds: new Set(),
      searchQuery: '',
      activeCategory: 'all',
      isLoading: false,
      fetchPlaces: jest.fn(),
      generateAiPlan: jest.fn().mockResolvedValue({ days: [] }),
    });
  });

  test('RED-ROUTEMAP-01: Displays connected itinerary route map when Map & Places tab is active', () => {
    const { getByTestId, getByText } = render(<PlanScreen />);

    // Switch to Map & Places sub-tab
    const mapSubtab = getByTestId('plan-subtab-map');
    fireEvent.press(mapSubtab);

    // Itinerary connected route container must be visible
    expect(getByTestId('itinerary-route-map-container')).toBeTruthy();
    expect(getByText(/Connected Itinerary Route/i)).toBeTruthy();
  });

  test('RED-ROUTEMAP-02: Renders connected stops sequence with route transit links and distances on Itinerary tab', () => {
    const { getByTestId } = render(<PlanScreen />);

    // Verify sequenced stop nodes on main itinerary tab (moved from map tab as per spec)
    const stop1 = getByTestId('itinerary-stop-1');
    expect(stop1).toBeTruthy();

    const stop2 = getByTestId('itinerary-stop-2');
    expect(stop2).toBeTruthy();

    // Verify connecting transit line / segment
    const transit0 = getByTestId('itinerary-transit-0');
    expect(transit0).toBeTruthy();
  });

  test('RED-ROUTEMAP-03: Allows filtering connected route by day using day filter pills on Map tab', () => {
    const { getByTestId } = render(<PlanScreen />);

    // Switch to Map & Places sub-tab
    fireEvent.press(getByTestId('plan-subtab-map'));

    // Verify day filter pills exist on Map tab
    const allDaysPill = getByTestId('route-day-pill-all');
    expect(allDaysPill).toBeTruthy();

    const day2Pill = getByTestId('route-day-pill-2');
    expect(day2Pill).toBeTruthy();
    fireEvent.press(day2Pill);
    expect(day2Pill).toBeTruthy();
  });
});
