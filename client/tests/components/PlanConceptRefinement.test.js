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

describe('Component Test: Plan Concept Refinement (Black/Grey/White Palette, Minimal Arrow, Plan Icon, Bottom Dock)', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useItineraryStore.mockReturnValue({
      currentTrip: null,
      trips: [],
      isLoading: false,
      error: null,
      fetchTrips: jest.fn(),
      fetchTripDetails: jest.fn(),
      createTrip: jest.fn().mockResolvedValue({ id: 'trip-concept-1' }),
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
        { id: 'p-1', name: 'Dragon Bridge', city: 'Da Nang', category: 'landmark', rating: 4.8 },
      ],
      selectedPlaceIds: new Set(),
      searchQuery: '',
      activeCategory: 'all',
      isLoading: false,
      fetchPlaces: jest.fn(),
      generateAiPlan: jest.fn().mockResolvedValue({ days: [] }),
    });
  });

  it('RED-CONCEPT-01: Back button in creation mode is a minimal black arrow without green border or Back to Trips text', () => {
    const { getByText, queryByText, getByTestId } = render(<PlanScreen />);

    // Open creation mode via unified Trip Wizard
    fireEvent.press(getByTestId('saved-trips-create-new-btn'));

    const backBtn = getByTestId('header-back-btn');
    expect(backBtn).toBeTruthy();

    // Must NOT contain the old green pill text "Back to Trips"
    expect(queryByText(/Back to Trips/i)).toBeNull();

    // Must contain a minimal glyph (‹)
    expect(getByText('‹')).toBeTruthy();
  });

  it('RED-CONCEPT-02: Empty state displays a Plan vector icon instead of airplane emoji', () => {
    const { getByTestId, queryByText } = render(<PlanScreen />);

    // Must NOT have the ✈️ airplane emoji
    expect(queryByText('✈️')).toBeNull();

    // Must have a dedicated Plan vector icon (e.g. lucide-icon-map)
    expect(getByTestId('plan-empty-state-icon')).toBeTruthy();
  });

  it('RED-CONCEPT-03: Plan a Trip button adheres to concept palette (Black #0F172A background, white text)', () => {
    const { getByTestId } = render(<PlanScreen />);

    const emptyCtaBtn = getByTestId('saved-trips-empty-btn');
    expect(emptyCtaBtn).toBeTruthy();

    const flatStyle = Array.isArray(emptyCtaBtn.props.style)
      ? Object.assign({}, ...emptyCtaBtn.props.style)
      : emptyCtaBtn.props.style || {};

    // Must be Black #0F172A, NOT green #2E7D5B
    expect(flatStyle.backgroundColor).toBe('#0F172A');
  });

  it('RED-CONCEPT-04: AI Itinerary Planning button in PlanMapDiscovery uses concept Black #0F172A background', () => {
    const { getByTestId } = render(
      <PlanMapDiscovery places={[]} onGenerateAiPlan={jest.fn()} />
    );

    const bottomBar = getByTestId('map-bottom-bar');
    expect(bottomBar).toBeTruthy();

    const aiBtn = getByTestId('ai-plan-generate-btn');
    expect(aiBtn).toBeTruthy();

    const flatStyle = Array.isArray(aiBtn.props.style)
      ? Object.assign({}, ...aiBtn.props.style)
      : aiBtn.props.style || {};

    // Button must be prominent black #0F172A, NOT disabled grey #E2E8F0 or green #2E7D5B
    expect(flatStyle.backgroundColor).toBe('#0F172A');
  });
});
