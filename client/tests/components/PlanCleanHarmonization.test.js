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

describe('Component Test: Plan Clean Harmonization & Unified Primary View (TDD RED Phase)', () => {
  const mockSavedTrips = [
    {
      id: 'trip-saved-1',
      title: 'Hành trình Đà Lạt - Nha Trang 4N3Đ',
      destination: 'Đà Lạt - Nha Trang',
      destinationCity: 'Đà Lạt',
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
      title: 'Khám phá Tokyo & Kyoto',
      destination: 'Tokyo - Kyoto',
      destinationCity: 'Tokyo',
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
        { id: 'p1', name: 'Dragon Bridge', city: 'Da Nang', category: 'landmark', rating: 4.8 },
      ],
      selectedPlaceIds: new Set(),
      searchQuery: '',
      activeCategory: 'all',
      isLoading: false,
      fetchPlaces: jest.fn(),
      generateAiPlan: jest.fn().mockResolvedValue({ days: [] }),
    });
  });

  it('RED-PLAN-CLEAN-01: completely removes top mode switcher tabs (no 2-tab segmented control)', () => {
    const { queryByTestId } = render(<PlanScreen />);

    // Top mode switcher and its 2 tabs must NOT exist
    expect(queryByTestId('plan-top-mode-switcher')).toBeNull();
    expect(queryByTestId('plan-mode-create-btn')).toBeNull();
    expect(queryByTestId('plan-mode-saved-btn')).toBeNull();
  });

  it('RED-PLAN-CLEAN-02: root view defaults directly to saved trips list when trips exist', () => {
    const { getByTestId, queryByTestId, getByText } = render(<PlanScreen />);

    // Saved trips container must be rendered immediately
    expect(getByTestId('saved-trips-list')).toBeTruthy();
    expect(getByText(/My Saved Trips/i)).toBeTruthy();
    expect(getByTestId('saved-trip-card-trip-saved-1')).toBeTruthy();
    expect(getByTestId('saved-trip-card-trip-saved-2')).toBeTruthy();

    // Map discovery view should not be shown on initial root load when trips exist
    expect(queryByTestId('map-bottom-bar')).toBeNull();
  });

  it('RED-PLAN-CLEAN-03: allows opening creation mode via "+ New Trip" (unified Accordion Wizard) and closing back to trips', () => {
    const { getByText, getByTestId, queryByTestId } = render(<PlanScreen />);

    // Click "+ New Trip" in header
    const createNewBtn = getByText(/\+ New Trip/i);
    fireEvent.press(createNewBtn);

    // Unified Accordion Wizard is now active
    expect(getByTestId('accordion-wizard-inline-container')).toBeTruthy();
    expect(getByTestId('header-close-btn')).toBeTruthy();

    // Click close button on wizard header
    const closeBtn = getByTestId('header-close-btn');
    fireEvent.press(closeBtn);

    // Returned to saved trips list
    expect(getByTestId('saved-trips-list')).toBeTruthy();
    expect(queryByTestId('accordion-wizard-inline-container')).toBeNull();
  });

  it('RED-PLAN-CLEAN-04: city names in PlanMapDiscovery are clean text without flags/emojis', () => {
    const { getByTestId, queryByText, getAllByText } = render(
      <PlanMapDiscovery places={[]} onGenerateAiPlan={jest.fn()} />
    );

    // Check journey city chips: clean names without flag icons
    expect(getByTestId('journey-city-danang')).toBeTruthy();
    expect(getByTestId('journey-city-hoian')).toBeTruthy();
    expect(getByTestId('journey-city-tokyo')).toBeTruthy();

    // Must NOT have emojis like 🇻🇳, 🏮, 🇯🇵 in city text
    expect(queryByText(/Đà Nẵng 🇻🇳/)).toBeNull();
    expect(queryByText(/Hội An 🏮/)).toBeNull();
    expect(queryByText(/Tokyo 🇯🇵/)).toBeNull();

    // Clean names must be present
    expect(getAllByText(/Da Nang/).length).toBeGreaterThan(0);
    expect(getAllByText(/Hoi An/).length).toBeGreaterThan(0);
    expect(getAllByText(/Tokyo/).length).toBeGreaterThan(0);
  });

  it('RED-PLAN-CLEAN-05: AI Planning button uses solid concept styling at the bottom of the plan info', () => {
    const { getByText, getByTestId } = render(
      <PlanMapDiscovery places={[]} onGenerateAiPlan={jest.fn()} />
    );

    const bottomBar = getByTestId('map-bottom-bar');
    expect(bottomBar).toBeTruthy();

    const aiBtn = getByText(/✨ AI Itinerary Planning/i);
    expect(aiBtn).toBeTruthy();
  });
});
