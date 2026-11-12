import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import PlanScreen from '../../src/screens/plan/PlanScreen';
import { useItineraryStore } from '../../src/stores/itinerary.store';
import { useExpenseStore } from '../../src/stores/expense.store';
import { usePlacesStore } from '../../src/stores/places.store';

jest.mock('../../src/stores/itinerary.store');
jest.mock('../../src/stores/expense.store');
jest.mock('../../src/stores/places.store');

describe('Component Test: PlanScreen 3 Sub-Tabs Integration (Map Discovery, Itinerary, Expenses)', () => {
  const mockTrip = {
    id: 'trip-101',
    title: 'Khám phá Đà Nẵng - Hội An',
    destination: 'Đà Nẵng',
    startDate: '2026-10-15',
    endDate: '2026-10-17',
    collaborators: [
      { userId: 'u-1', fullName: 'Đức Nguyễn (Bạn)', role: 'OWNER', status: 'ACCEPTED' },
    ],
    days: [
      {
        dayIndex: 1,
        date: '2026-10-15',
        items: [
          {
            id: 'item-1',
            name: 'Bán đảo Sơn Trà',
            arrivalTime: '09:00',
            durationMinutes: 90,
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
      fetchTripDetails: jest.fn(),
      addStop: jest.fn(),
      createTrip: jest.fn(),
      applyAiPlan: jest.fn(),
    });

    useExpenseStore.mockReturnValue({
      expenses: [],
      debtSummary: { totalExpense: 0, memberBalances: [], simplifiedSettlements: [] },
      isLoading: false,
      error: null,
    });

    usePlacesStore.mockReturnValue({
      places: [
        {
          id: 'dn-01',
          name: 'Cầu Rồng Đà Nẵng',
          category: 'landmark',
          rating: 4.8,
          address: 'Nguyễn Văn Linh',
        },
      ],
      selectedPlaceIds: new Set(),
      searchQuery: '',
      activeCategory: 'all',
      isLoading: false,
      fetchPlaces: jest.fn(),
      generateAiPlan: jest.fn(),
    });
  });

  it('RED-FE-PLAN-TAB-01: renders 3 sub-tabs including "Map & Places"', () => {
    const { getByText } = render(<PlanScreen />);

    expect(getByText('Map & Places')).toBeTruthy();
    expect(getByText('Itinerary & Squad')).toBeTruthy();
    expect(getByText('Expenses & Splits')).toBeTruthy();
  });

  it('RED-FE-PLAN-TAB-02: switches to "Map & Places" sub-tab and renders map discovery view', () => {
    const { getByText, getByPlaceholderText } = render(<PlanScreen />);

    const mapTabBtn = getByText(/Map & Places|Map/i);
    fireEvent.press(mapTabBtn);

    // Search bar of map view should be present
    expect(getByPlaceholderText(/e\.g\..*Ba Na Hills|search/i)).toBeTruthy();
    expect(getByText(/✨ AI Itinerary Planning/i)).toBeTruthy();
  });
});
