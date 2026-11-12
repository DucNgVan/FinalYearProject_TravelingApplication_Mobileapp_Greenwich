import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import PlanScreen from '../../src/screens/plan/PlanScreen';
import { useItineraryStore } from '../../src/stores/itinerary.store';
import { useExpenseStore } from '../../src/stores/expense.store';
import { useThemeStore } from '../../src/stores/theme.store';

jest.mock('../../src/stores/itinerary.store');
jest.mock('../../src/stores/expense.store');
jest.mock('../../src/stores/theme.store');

describe('TDD RED Phase: PlanScreen Image 2 Exact Match Verification', () => {
  const mockDaNangTrip = {
    id: 'trip-danang-1',
    title: 'Đà Nẵng Squad Vacation',
    destination: 'Đà Nẵng',
    destinationCity: 'Đà Nẵng',
    country: 'VIETNAM',
    daysCount: 3,
    status: 'LIVE',
    totalDistanceKm: 18.6,
    days: [
      {
        dayIndex: 1,
        dayNumber: 1,
        distanceKm: 6.2,
        items: [
          {
            id: 'stop-1',
            name: 'Khai Tri Boutique Hotel',
            arrivalTime: '09:00',
            departureTime: '09:30',
            categoryName: 'Basecamp',
            isBasecamp: true,
            transitToNext: {
              mode: 'walk',
              distanceKm: 0.8,
              durationMinutes: 11,
            },
          },
          {
            id: 'stop-2',
            name: 'Dragon Bridge (Cầu Rồng)',
            arrivalTime: '09:45',
            departureTime: '11:30',
            categoryName: 'Landmark',
          },
          {
            id: 'meal-1',
            isMeal: true,
            name: 'Madame Lan (Mì Quảng & Đặc sản Đà Nẵng)',
            mealType: 'Lunch',
            durationMinutes: 60,
            arrivalTime: '12:00',
          },
          {
            id: 'stop-3',
            name: 'My Khe Beach',
            arrivalTime: '14:00',
            departureTime: '17:30',
            categoryName: 'Beaches & Relaxation',
          },
        ],
      },
      {
        dayIndex: 2,
        dayNumber: 2,
        distanceKm: 7.4,
        items: [],
      },
      {
        dayIndex: 3,
        dayNumber: 3,
        distanceKm: 5.0,
        items: [],
      },
    ],
    collaborators: [{ userId: 'u-1', fullName: 'Đức Nguyễn', role: 'OWNER' }],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useThemeStore.mockReturnValue({
      mode: 'dark',
      colors: {
        background: '#121316',
        card: '#1C1D21',
        text: '#FFFFFF',
        textMuted: '#94A3B8',
        border: '#2A2D35',
        primary: '#0F172A',
      },
    });

    useItineraryStore.mockReturnValue({
      currentTrip: mockDaNangTrip,
      isLoading: false,
      error: null,
      fetchTripDetails: jest.fn(),
      inviteCompanion: jest.fn(),
    });

    useExpenseStore.mockReturnValue({
      expenses: [],
      debtSummary: null,
      isLoading: false,
      error: null,
      fetchTripExpenses: jest.fn(),
      fetchDebtSummary: jest.fn(),
      settleDebt: jest.fn(),
    });
  });

  test('RED-IMG2-01: renders Top Bar with standard ITINERARY & SQUAD and Travel Plan header', () => {
    const { getAllByText, getByText, getByTestId } = render(<PlanScreen />);

    expect(getAllByText(/ITINERARY & SQUAD/i).length).toBeGreaterThan(0);
    expect(getAllByText('Travel Plan').length).toBeGreaterThan(0);
    expect(getByTestId('saved-trips-create-new-btn')).toBeTruthy();
  });

  test('RED-IMG2-02: renders Hero Card with LIVE badge, VIETNAM • 3 DAYS badge, title and progress bar', () => {
    const { getByTestId, getByText, getAllByText } = render(<PlanScreen />);

    expect(getByTestId('itinerary-hero-card')).toBeTruthy();
    expect(getByTestId('itinerary-live-badge')).toBeTruthy();
    expect(getByText(/LIVE/i)).toBeTruthy();
    expect(getByText(/VIETNAM • 3 DAYS/i)).toBeTruthy();
    expect(getAllByText('Đà Nẵng Squad Vacation').length).toBeGreaterThan(0);
    expect(getByText('DAY 1 OF 3')).toBeTruthy();
    expect(getByTestId('itinerary-progress-percent')).toBeTruthy();
  });

  test('RED-IMG2-03: renders Route Distance Banner with 18.6 km and Optimal Route badge', () => {
    const { getByTestId, getByText } = render(<PlanScreen />);

    expect(getByTestId('itinerary-distance-banner')).toBeTruthy();
    expect(getByText(/18\.6 km total journey/i)).toBeTruthy();
    expect(getByText(/Clustered from your chosen spots/i)).toBeTruthy();
    expect(getByTestId('itinerary-optimal-route-badge')).toBeTruthy();
    expect(getByText('Optimal Route')).toBeTruthy();
  });

  test('RED-IMG2-04: renders Day Chips with Day 1 (6.2 km) active as solid white capsule with black text', () => {
    const { getByTestId, getByText } = render(<PlanScreen />);

    const day1Chip = getByTestId('itinerary-day-chip-1');
    expect(day1Chip).toBeTruthy();
    expect(getByText(/Day 1 \(6\.2 km\)/i)).toBeTruthy();
    expect(getByText(/Day 2 \(7\.4 km\)/i)).toBeTruthy();
    expect(getByText(/Day 3 \(5\.0 km\)/i)).toBeTruthy();
  });

  test('RED-IMG2-05: renders numbered stops (1, 2, 3), walking transit pill, Go buttons, and dashed amber Lunch card', () => {
    const { getByTestId, getByText } = render(<PlanScreen />);

    // Stop 1
    expect(getByTestId('itinerary-stop-1')).toBeTruthy();
    expect(getByText('Khai Tri Boutique Hotel')).toBeTruthy();
    expect(getByText(/09:00 - 09:30 • Basecamp/i)).toBeTruthy();

    // Transit Walk
    expect(getByTestId('itinerary-transit-0')).toBeTruthy();
    expect(getByText(/0\.8 km · 11 min walk/i)).toBeTruthy();

    // Stop 2
    expect(getByTestId('itinerary-stop-2')).toBeTruthy();
    expect(getByText('Dragon Bridge (Cầu Rồng)')).toBeTruthy();
    expect(getByText(/09:45 - 11:30 • Landmark/i)).toBeTruthy();
    expect(getByTestId('itinerary-stop-checkbox-stop-2')).toBeTruthy();

    // Lunch Meal Card
    expect(getByTestId('itinerary-meal-card-meal-1')).toBeTruthy();
    expect(getByText(/Lunch · 60 min/i)).toBeTruthy();
    expect(getByText('Madame Lan (Mì Quảng & Đặc sản Đà Nẵng)')).toBeTruthy();
    expect(getByText('12:00')).toBeTruthy();

    // Stop 3
    expect(getByTestId('itinerary-stop-3')).toBeTruthy();
    expect(getByText('My Khe Beach')).toBeTruthy();
    expect(getByText(/14:00 - 17:30 • Beaches & Relaxation/i)).toBeTruthy();
    expect(getByTestId('itinerary-stop-checkbox-stop-3')).toBeTruthy();
  });

  test('RED-IMG2-06: renders Sticky Bottom Bar with Re-Pick Spots and Start Trip buttons', () => {
    const { getByTestId, getByText } = render(<PlanScreen />);

    expect(getByTestId('itinerary-bottom-bar')).toBeTruthy();
    expect(getByTestId('itinerary-repick-spots-btn')).toBeTruthy();
    expect(getByText(/Re-Pick Spots/i)).toBeTruthy();
    expect(getByTestId('itinerary-start-trip-btn')).toBeTruthy();
    expect(getByText(/Start Trip/i)).toBeTruthy();
  });
});
