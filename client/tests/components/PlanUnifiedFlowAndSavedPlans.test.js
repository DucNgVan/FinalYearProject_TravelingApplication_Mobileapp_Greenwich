import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import PlanScreen from '../../src/screens/plan/PlanScreen';
import PlanMapDiscovery from '../../src/components/plan/PlanMapDiscovery';
import { useItineraryStore } from '../../src/stores/itinerary.store';
import { useExpenseStore } from '../../src/stores/expense.store';
import { usePlacesStore } from '../../src/stores/places.store';

jest.mock('../../src/stores/itinerary.store');
jest.mock('../../src/stores/expense.store');
jest.mock('../../src/stores/places.store');

describe('Component Test: Plan Unified Flow & My Saved Plans Tab (TDD RED Phase)', () => {
  const mockSavedTrips = [
    {
      id: 'trip-saved-1',
      title: 'Hành trình Đà Lạt - Nha Trang 4N3Đ',
      destination: 'Đà Lạt - Nha Trang',
      startDate: '2026-11-10',
      endDate: '2026-11-14',
      budget: 15000000,
      collaborators: [{ userId: 'u1', fullName: 'Đức Nguyễn', role: 'OWNER' }],
      days: [
        {
          dayIndex: 1,
          date: '2026-11-10',
          items: [{ id: 'st-1', name: 'Hồ Tuyền Lâm', arrivalTime: '08:30', durationMinutes: 90 }],
        },
      ],
    },
    {
      id: 'trip-saved-2',
      title: 'Khám phá Tokyo & Kyoto Mùa Thu',
      destination: 'Tokyo - Kyoto',
      startDate: '2026-12-01',
      endDate: '2026-12-07',
      budget: 45000000,
      collaborators: [{ userId: 'u1', fullName: 'Đức Nguyễn', role: 'OWNER' }],
      days: [],
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    useItineraryStore.mockReturnValue({
      currentTrip: null,
      trips: mockSavedTrips,
      isLoading: false,
      error: null,
      fetchTrips: jest.fn(),
      fetchTripDetails: jest.fn(),
      createTrip: jest.fn().mockResolvedValue({ id: 'trip-saved-1', ...mockSavedTrips[0] }),
      addStop: jest.fn(),
      inviteCompanion: jest.fn(),
      applyAiPlan: jest.fn(),
    });

    useExpenseStore.mockReturnValue({
      expenses: [],
      debtSummary: { totalExpense: 0, memberBalances: [], simplifiedSettlements: [] },
      isLoading: false,
      error: null,
      fetchTripExpenses: jest.fn(),
      fetchDebtSummary: jest.fn(),
      settleDebt: jest.fn(),
    });

    usePlacesStore.mockReturnValue({
      places: [
        { id: 'p1', name: 'Place 1', city: 'Đà Lạt', category: 'nature', rating: 4.8 },
      ],
      selectedPlaceIds: new Set(),
      searchQuery: '',
      activeCategory: 'all',
      isLoading: false,
      fetchPlaces: jest.fn(),
      generateAiPlan: jest.fn().mockResolvedValue({ days: [] }),
    });
  });

  it('RED-FE-PLAN-UNIFIED-01: removes duplicate Smart Journey Wizard button from header, keeping single unified flow', () => {
    const { queryByTestId, queryByText } = render(<PlanScreen />);

    // Must NOT have the duplicate header wizard button
    expect(queryByTestId('plan-wizard-trigger-btn')).toBeNull();
    expect(queryByText(/✨ Smart Journey Wizard/i)).toBeNull();
  });

  it('RED-FE-PLAN-UNIFIED-02: does not render Top Mode Switcher tabs, using clean primary landing view', () => {
    const { queryByTestId, getByText } = render(<PlanScreen />);

    expect(queryByTestId('plan-mode-create-btn')).toBeNull();
    expect(queryByTestId('plan-mode-saved-btn')).toBeNull();
    expect(getByText(/My Saved Trips/i)).toBeTruthy();
  });

  it('RED-FE-PLAN-UNIFIED-03: directly renders saved trip cards on root screen without manual tab switching', () => {
    const { getByTestId, getByText } = render(<PlanScreen />);

    // Should display the saved trips container and trip titles directly
    expect(getByTestId('saved-trips-list')).toBeTruthy();
    expect(getByText('Hành trình Đà Lạt - Nha Trang 4N3Đ')).toBeTruthy();
    expect(getByText('Khám phá Tokyo & Kyoto Mùa Thu')).toBeTruthy();
  });

  it('RED-FE-PLAN-UNIFIED-04: PlanMapDiscovery expands map canvas and does NOT render glitchy Stop pills', () => {
    const mockPlaces = [
      { id: 'dn-01', name: 'Dragon Bridge', city: 'Da Nang', category: 'landmark', rating: 4.8 },
    ];
    const { queryByText, queryByTestId, getByTestId } = render(
      <PlanMapDiscovery places={mockPlaces} onGenerateAiPlan={jest.fn()} />
    );

    // Map canvas must be present
    const mapCanvas = getByTestId('mapbox-canvas-image');
    expect(mapCanvas).toBeTruthy();

    // Glitchy red/green Stop pills must NOT exist
    expect(queryByText(/Stop 1/i)).toBeNull();
    expect(queryByTestId('map-pin-marker-dn-01')).toBeNull();
  });

  it('RED-FE-PLAN-UNIFIED-05: journey destinations are dynamic and can be removed via remove button', () => {
    const { getByTestId, queryByTestId } = render(
      <PlanMapDiscovery places={[]} onGenerateAiPlan={jest.fn()} />
    );

    // Initially contains dynamic city that can be removed
    expect(getByTestId('journey-city-hoian')).toBeTruthy();

    // Press remove on Hoi An
    const removeBtn = getByTestId('journey-remove-city-hoian');
    fireEvent.press(removeBtn);

    expect(queryByTestId('journey-city-hoian')).toBeNull();
  });

  it('RED-FE-PLAN-UNIFIED-06: opening a saved trip renders Day-by-Day timeline, invite friends, and expense sharing', () => {
    useItineraryStore.mockReturnValue({
      currentTrip: mockSavedTrips[0],
      trips: mockSavedTrips,
      isLoading: false,
      error: null,
      fetchTrips: jest.fn(),
      addStop: jest.fn(),
      inviteCompanion: jest.fn(),
      createTrip: jest.fn(),
      applyAiPlan: jest.fn(),
    });

    const { getByText, getByTestId } = render(<PlanScreen />);

    // Should render active trip header and timeline stop
    expect(getByText('Hành trình Đà Lạt - Nha Trang 4N3Đ')).toBeTruthy();
    expect(getByText('Hồ Tuyền Lâm')).toBeTruthy();

    // Should have Add Stop button and subtabs for Itinerary and Expenses
    expect(getByText('+ Add Stop')).toBeTruthy();
    expect(getByText('Expenses & Splits')).toBeTruthy();
  });
});
