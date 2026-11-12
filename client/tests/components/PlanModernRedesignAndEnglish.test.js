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

describe('Component Test: Plan Modern Clean UI & 100% English Localization (TDD RED Phase)', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useItineraryStore.mockReturnValue({
      currentTrip: null,
      trips: [],
      isLoading: false,
      error: null,
      fetchTrips: jest.fn(),
      fetchTripDetails: jest.fn(),
      createTrip: jest.fn().mockResolvedValue({ id: 'trip-1' }),
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
      settleDebt: jest.fn(),
    });

    usePlacesStore.mockReturnValue({
      places: [
        { id: 'dn-01', name: 'Dragon Bridge', city: 'Da Nang', category: 'landmark', rating: 4.8 },
      ],
      selectedPlaceIds: new Set(),
      searchQuery: '',
      activeCategory: 'all',
      isLoading: false,
      fetchPlaces: jest.fn(),
      generateAiPlan: jest.fn().mockResolvedValue({ days: [] }),
    });
  });

  it('RED-PLAN-ENG-01: PlanScreen empty state and saved trips view are 100% in English', () => {
    const { getByText, getAllByText, queryByText } = render(<PlanScreen />);

    // English titles
    expect(getAllByText(/Travel Plan|My Saved Trips/i).length).toBeGreaterThan(0);
    expect(getByText(/No Travel Plans Yet/i)).toBeTruthy();
    expect(getByText(/\+ New Trip/i)).toBeTruthy();
    expect(getByText(/✨ Plan a Trip/i)).toBeTruthy();

    // No Vietnamese text should be present
    expect(queryByText(/Kế hoạch đã lưu/i)).toBeNull();
    expect(queryByText(/Chưa có kế hoạch nào/i)).toBeNull();
    expect(queryByText(/Lên lịch trình ngay/i)).toBeNull();
  });

  it('RED-PLAN-ENG-02: creation mode header uses clean English title and back button', () => {
    const { getByText, queryByText, getByTestId } = render(<PlanScreen />);

    // Tap "+ New Trip" or "✨ Plan a Trip"
    fireEvent.press(getByText(/✨ Plan a Trip/i));

    // Must have English header and back button
    expect(getByText(/Explore & Plan Trip/i)).toBeTruthy();
    expect(getByTestId('plan-back-to-list-btn')).toBeTruthy();

    // Must NOT have Vietnamese text
    expect(queryByText(/Khám phá & Lập kế hoạch/i)).toBeNull();
    expect(queryByText(/← Quay lại/i)).toBeNull();
  });

  it('RED-PLAN-CLEAN-03: category filter pills do not contain cartoon emojis and render clean text', () => {
    const { getByText, queryByText } = render(
      <PlanMapDiscovery places={[]} onGenerateAiPlan={jest.fn()} />
    );

    // Categories must be clean text
    expect(getByText('All')).toBeTruthy();
    expect(getByText('Attractions')).toBeTruthy();
    expect(getByText('Beaches')).toBeTruthy();
    expect(getByText('Food & Dining')).toBeTruthy();
    expect(getByText('Nature')).toBeTruthy();

    // Must NOT have emojis like 🌟, 🏛️, 🏖️, 🍜, 🌿
    expect(queryByText(/🌟/)).toBeNull();
    expect(queryByText(/🏛️/)).toBeNull();
    expect(queryByText(/🏖️/)).toBeNull();
    expect(queryByText(/🍜/)).toBeNull();
    expect(queryByText(/🌿/)).toBeNull();
  });

  it('RED-PLAN-CLEAN-04: stay duration and budget sections do not contain cartoon emojis and use sleek English labels', () => {
    const { getByText, queryByText } = render(
      <PlanMapDiscovery places={[]} onGenerateAiPlan={jest.fn()} />
    );

    // English labels
    expect(getByText(/Stay Duration/i)).toBeTruthy();
    expect(getByText(/Travel Budget per Person/i)).toBeTruthy();
    expect(getByText('Economy')).toBeTruthy();
    expect(getByText('Standard')).toBeTruthy();
    expect(getByText('Luxury')).toBeTruthy();
    expect(getByText(/AI Budget Distribution/i)).toBeTruthy();

    // Must NOT have emojis like ⏱️, 💰, 🎒, ☕, 💎, ✨ in headers or tier pills
    expect(queryByText(/⏱️/)).toBeNull();
    expect(queryByText(/💰/)).toBeNull();
    expect(queryByText(/🎒/)).toBeNull();
    expect(queryByText(/☕/)).toBeNull();
    expect(queryByText(/💎/)).toBeNull();
  });

  it('RED-PLAN-CLEAN-05: city names are clean English without Vietnamese diacritics', () => {
    const { getByTestId, queryByText, getAllByText } = render(
      <PlanMapDiscovery places={[]} onGenerateAiPlan={jest.fn()} />
    );

    expect(getByTestId('journey-city-danang')).toBeTruthy();
    expect(getByTestId('journey-city-hoian')).toBeTruthy();
    expect(getByTestId('journey-city-tokyo')).toBeTruthy();

    // Must be English "Da Nang" instead of "Đà Nẵng"
    expect(getAllByText(/Da Nang/).length).toBeGreaterThan(0);
    expect(getAllByText(/Hoi An/).length).toBeGreaterThan(0);
    expect(getAllByText(/Tokyo/).length).toBeGreaterThan(0);
    expect(queryByText(/Đà Nẵng/)).toBeNull();
    expect(queryByText(/Hội An/)).toBeNull();
  });

  it('RED-PLAN-CLEAN-06: AI budget section features a proportional visual distribution bar', () => {
    const { getByTestId } = render(
      <PlanMapDiscovery places={[]} onGenerateAiPlan={jest.fn()} />
    );

    // Must feature the modern proportional distribution bar
    expect(getByTestId('ai-budget-distribution-bar')).toBeTruthy();
  });
});
