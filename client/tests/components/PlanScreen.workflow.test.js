import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import PlanScreen from '../../src/screens/plan/PlanScreen';
import { useItineraryStore } from '../../src/stores/itinerary.store';
import { usePlacesStore } from '../../src/stores/places.store';

// Mock dependencies
jest.mock('../../src/stores/itinerary.store');
jest.mock('../../src/stores/places.store');

describe('PlanScreen Enhanced Workflow (RED Phase)', () => {
  const mockFetchTrips = jest.fn().mockResolvedValue([]);
  const mockFetchTripDetails = jest.fn().mockResolvedValue({});
  const mockCreateTrip = jest.fn();
  const mockApplyAiPlan = jest.fn();
  const mockGenerateAiPlan = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    usePlacesStore.mockReturnValue({
      places: [
        { id: 'p-1', name: 'Tuileries Garden', city: 'Paris', category: 'nature', categoryName: 'Nature', lat: 48.8635, lng: 2.3275 },
        { id: 'p-2', name: 'Louvre Museum', city: 'Paris', category: 'art', categoryName: 'Art', lat: 48.8606, lng: 2.3376 },
      ],
      selectedPlaceIds: new Set(['p-1']),
      togglePlaceSelection: jest.fn(),
      generateAiPlan: mockGenerateAiPlan,
    });
  });

  test('RED-PLAN-WF-01: Displays photographic TripCardHero in My Trips dashboard', async () => {
    const mockTripList = [
      {
        id: 'trip-paris-1',
        title: 'Paris',
        destinationCity: 'Paris',
        country: 'France',
        startDate: '2026-11-15',
        endDate: '2026-11-20',
        daysCount: 5,
        status: 'LIVE',
        currentDay: 1,
        progressPercentage: 20,
        collaborators: [{ userId: 'u1', role: 'OWNER' }],
        days: [],
      },
    ];

    useItineraryStore.mockReturnValue({
      currentTrip: null,
      trips: mockTripList,
      fetchTrips: mockFetchTrips,
      fetchTripDetails: mockFetchTripDetails,
      createTrip: mockCreateTrip,
      applyAiPlan: mockApplyAiPlan,
    });

    const { getByTestId, getByText } = render(<PlanScreen />);

    expect(getByText(/My Trips/i)).toBeTruthy();
    expect(getByTestId('trip-hero-card-trip-paris-1')).toBeTruthy();
    expect(getByText(/France/i)).toBeTruthy();
    expect(getByText('Paris')).toBeTruthy();
    expect(getByTestId('trip-hero-badge-live')).toBeTruthy();
  });

  test('RED-PLAN-WF-02: Displays Pre-AI Draft workspace with places list, instructions input, and Generate with AI CTA', async () => {
    const draftTrip = {
      id: 'trip-draft-1',
      title: 'Paris',
      destinationCity: 'Paris',
      country: 'France',
      startDate: '2026-11-15',
      endDate: '2026-11-20',
      status: 'Draft',
      stayAddress: 'Khai Tri',
      days: [],
      selectedPlaces: [
        { id: 'p-1', name: 'Tuileries Garden', categoryName: 'Nature', durationMinutes: 60 },
      ],
      collaborators: [],
    };

    useItineraryStore.mockReturnValue({
      currentTrip: draftTrip,
      trips: [draftTrip],
      fetchTrips: mockFetchTrips,
      fetchTripDetails: mockFetchTripDetails,
      createTrip: mockCreateTrip,
      applyAiPlan: mockApplyAiPlan,
    });

    const { getByTestId, getByText, getByPlaceholderText } = render(<PlanScreen />);

    // Header Draft status and accommodation
    expect(getByTestId('trip-status-badge-draft')).toBeTruthy();
    expect(getByText(/Khai Tri/i)).toBeTruthy();

    // Draft workspace items
    expect(getByText('Tuileries Garden')).toBeTruthy();
    expect(getByText(/~60 min/i)).toBeTruthy();
    expect(getByPlaceholderText(/Add instructions/i)).toBeTruthy();
    expect(getByTestId('draft-generate-ai-btn')).toBeTruthy();
  });

  test('RED-PLAN-WF-03: Displays generated timeline with total distance banner, walking transit indicators, lunch card, and Start Trip button', async () => {
    const readyTrip = {
      id: 'trip-ready-1',
      title: 'Paris',
      destinationCity: 'Paris',
      country: 'France',
      startDate: '2026-11-15',
      endDate: '2026-11-20',
      status: 'Ready',
      stayAddress: 'Khai Tri',
      totalDistanceKm: 57.8,
      days: [
        {
          dayIndex: 1,
          distanceKm: 10.2,
          items: [
            { id: 'item-1', name: 'Tuileries Garden', categoryName: 'Nature', durationMinutes: 90, rating: 4.6, priceLevel: '$', openHours: '07:00 – 21:00', transitToNext: { distanceKm: 0.8, durationMinutes: 11, mode: 'walk' } },
            { id: 'item-lunch', isMeal: true, name: 'Lunch', durationMinutes: 60 },
            { id: 'item-2', name: 'Louvre Museum', categoryName: 'Art', durationMinutes: 180, rating: 4.7, priceLevel: '$$$', openHours: '09:00 – 18:00' },
          ],
        },
      ],
      collaborators: [],
    };

    useItineraryStore.mockReturnValue({
      currentTrip: readyTrip,
      trips: [readyTrip],
      fetchTrips: mockFetchTrips,
      fetchTripDetails: mockFetchTripDetails,
      createTrip: mockCreateTrip,
      applyAiPlan: mockApplyAiPlan,
    });

    const { getByTestId, getByText } = render(<PlanScreen />);

    // Status Ready
    expect(getByTestId('trip-status-badge-ready')).toBeTruthy();

    // Total distance banner & Day chip with km
    expect(getByText(/57.8 km total/i)).toBeTruthy();
    expect(getByText(/10.2 km/i)).toBeTruthy();

    // Stops and transit walking indicator
    expect(getByText('Tuileries Garden')).toBeTruthy();
    expect(getByText(/0.8 km · 11 min walk/i)).toBeTruthy();
    expect(getByText(/Lunch · 60 min/i)).toBeTruthy();

    // Start Trip CTA
    expect(getByTestId('itinerary-start-trip-btn')).toBeTruthy();
  });
});
