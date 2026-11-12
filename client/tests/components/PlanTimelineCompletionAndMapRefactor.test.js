import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import PlanScreen from '../../src/screens/plan/PlanScreen';
import { useItineraryStore } from '../../src/stores/itinerary.store';
import { useExpenseStore } from '../../src/stores/expense.store';
import { useThemeStore } from '../../src/stores/theme.store';

jest.mock('../../src/stores/itinerary.store');
jest.mock('../../src/stores/expense.store');
jest.mock('../../src/stores/theme.store');

describe('TDD RED Phase: Plan Timeline Completion & Map Clean Refactor', () => {
  const mockDaNangTrip = {
    id: 'trip-danang-refactor-1',
    title: 'Đà Nẵng Squad Vacation',
    destination: 'Đà Nẵng',
    destinationCity: 'Đà Nẵng',
    country: 'VIETNAM',
    daysCount: 3,
    status: 'Ready',
    totalDistanceKm: 18.6,
    days: [
      {
        dayIndex: 1,
        dayNumber: 1,
        distanceKm: 6.2,
        items: [
          {
            id: 'stop-hotel-1',
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
            id: 'stop-bridge-2',
            name: 'Dragon Bridge (Cầu Rồng)',
            arrivalTime: '09:45',
            departureTime: '11:30',
            categoryName: 'Landmark',
            duration: 105,
            transitToNext: {
              mode: 'walk',
              distanceKm: 1.2,
              durationMinutes: 15,
            },
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
            id: 'stop-beach-3',
            name: 'My Khe Beach',
            arrivalTime: '14:00',
            departureTime: '17:30',
            categoryName: 'Beaches & Relaxation',
            duration: 120,
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
      mode: 'light',
      colors: {
        background: '#FFFFFF',
        surface: '#FFFFFF',
        card: '#F8FAFC',
        text: '#0F172A',
        textMuted: '#64748B',
        border: '#E2E8F0',
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

  test('RED-TIMELINE-01: renders clean timeline stop card with index badge, title, subtitle duration, and transit connector', () => {
    const { getByTestId, getByText, getAllByText } = render(<PlanScreen />);

    // Stop 1 & Stop 2 stop cards
    expect(getByTestId('itinerary-stop-1')).toBeTruthy();
    expect(getByTestId('itinerary-stop-2')).toBeTruthy();
    expect(getByText('Dragon Bridge (Cầu Rồng)')).toBeTruthy();

    // Duration badge or text in stop card matching image 3 (⏱ 105 min)
    expect(getAllByText(/⏱.*105 min/i).length).toBeGreaterThan(0);

    // Connecting transit segment between stops
    expect(getByTestId('itinerary-transit-0')).toBeTruthy();
    expect(getByText(/0\.8 km · 11 min/i)).toBeTruthy();
  });

  test('RED-TIMELINE-02: stop card replaces Go button with interactive completion checkbox', () => {
    const { getByTestId, queryByTestId } = render(<PlanScreen />);

    // Checkbox exists for actionable stops
    expect(getByTestId('itinerary-stop-checkbox-stop-bridge-2')).toBeTruthy();
    expect(getByTestId('itinerary-stop-checkbox-stop-beach-3')).toBeTruthy();

    // Old 'Go' button should not be rendered
    expect(queryByTestId('itinerary-go-btn-stop-bridge-2')).toBeNull();
  });

  test('RED-TIMELINE-03: tapping completion checkbox marks stop completed and dynamically updates hero % Completed based on actual stops', () => {
    const { getByTestId } = render(<PlanScreen />);

    const progressPercentText = getByTestId('itinerary-progress-percent');
    // Initially 0% completed because no stops are completed yet
    expect(progressPercentText.props.children).toContain('0% Completed');

    // Tap first stop checkbox
    const bridgeCheckbox = getByTestId('itinerary-stop-checkbox-stop-bridge-2');
    fireEvent.press(bridgeCheckbox);

    // 1 of 2 actionable stops completed => 50% Completed
    expect(getByTestId('itinerary-stop-checkbox-checked-stop-bridge-2')).toBeTruthy();
    expect(getByTestId('itinerary-progress-percent').props.children).toContain('50% Completed');

    // Tap second stop checkbox
    const beachCheckbox = getByTestId('itinerary-stop-checkbox-stop-beach-3');
    fireEvent.press(beachCheckbox);

    // 2 of 2 actionable stops completed => 100% Completed
    expect(getByTestId('itinerary-stop-checkbox-checked-stop-beach-3')).toBeTruthy();
    expect(getByTestId('itinerary-progress-percent').props.children).toContain('100% Completed');

    // Unchecking reverts back to 50%
    fireEvent.press(beachCheckbox);
    expect(getByTestId('itinerary-progress-percent').props.children).toContain('50% Completed');
  });

  test('RED-TIMELINE-04: Map & Places tab does not render redundant stops timeline list below map', () => {
    const { getByTestId, queryByTestId } = render(<PlanScreen />);

    // Switch to Map & Places tab
    const mapTab = getByTestId('plan-subtab-map');
    fireEvent.press(mapTab);

    // Map container exists
    expect(getByTestId('itinerary-route-mapbox-canvas')).toBeTruthy();

    // Redundant chronological stop nodes sequence below map should be removed
    expect(queryByTestId('route-stop-node-1')).toBeNull();
  });
});
