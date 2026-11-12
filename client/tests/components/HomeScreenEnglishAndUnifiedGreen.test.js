import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import HomeScreen from '../../src/screens/home/HomeScreen';
import PlanScreen from '../../src/screens/plan/PlanScreen';
import PlanMapDiscovery from '../../src/components/plan/PlanMapDiscovery';
import { colors } from '../../src/theme/colors';
import { useThemeStore } from '../../src/stores/theme.store';
import { useAuthStore } from '../../src/stores/auth.store';
import { useBookingStore } from '../../src/stores/booking.store';
import { useItineraryStore } from '../../src/stores/itinerary.store';
import { usePlacesStore } from '../../src/stores/places.store';

jest.mock('../../src/stores/auth.store');
jest.mock('../../src/stores/booking.store');
jest.mock('../../src/stores/itinerary.store');
jest.mock('../../src/stores/places.store');

describe('Component & Theme Test: HomeScreen 100% English, Unified Pine Green #2E7D5B, Inline AI Button, Arrow Only', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useAuthStore.mockReturnValue({
      user: { fullName: 'Alex Rivera', email: 'alex@nomadix.com' },
      isAuthenticated: true,
      logout: jest.fn(),
    });

    useBookingStore.mockReturnValue({
      flights: [],
      hotels: [],
      isLoading: false,
    });

    useItineraryStore.mockReturnValue({
      currentTrip: null,
      trips: [],
      isLoading: false,
      fetchTrips: jest.fn(),
      createTrip: jest.fn(),
      applyAiPlan: jest.fn(),
    });

    usePlacesStore.mockReturnValue({
      places: [],
      selectedPlaceIds: new Set(),
      searchQuery: '',
      activeCategory: 'all',
      fetchPlaces: jest.fn(),
      generateAiPlan: jest.fn().mockResolvedValue({ days: [] }),
    });
  });

  it('RED-HOME-ENG-01: HomeScreen Quick Shortcuts labels are in English without Vietnamese text', () => {
    const { getByText, queryByText } = render(<HomeScreen />);

    // English labels
    expect(getByText('Flights')).toBeTruthy();
    expect(getByText('Hotels')).toBeTruthy();
    expect(getByText('Plan')).toBeTruthy();
    expect(getByText('Squad & Split')).toBeTruthy();

    // Must NOT have old Vietnamese labels
    expect(queryByText('Vé máy bay')).toBeNull();
    expect(queryByText('Khách sạn')).toBeNull();
    expect(queryByText('Kế hoạch')).toBeNull();
    expect(queryByText('Group & Quỹ')).toBeNull();
  });

  it('RED-HOME-ENG-02: HomeScreen Collections card subtitle is in English without Vietnamese text', () => {
    const { getByText, queryByText } = render(<HomeScreen />);

    // English subtitle
    expect(getByText('Explored Itinerary')).toBeTruthy();

    // Must NOT have old Vietnamese subtitle
    expect(queryByText('Lịch trình đã khám phá')).toBeNull();
  });

  it('RED-PLAN-ARROW-ONLY-01: Back button in creation mode has NO circular background/border and renders arrow only', () => {
    const { getByText, getByTestId } = render(<PlanScreen />);

    // Enter creation mode
    fireEvent.press(getByText(/✨ Plan a Trip/i));

    const backBtn = getByTestId('plan-back-to-list-btn');
    expect(backBtn).toBeTruthy();

    const flatStyle = Array.isArray(backBtn.props.style)
      ? Object.assign({}, ...backBtn.props.style)
      : backBtn.props.style || {};

    // Must NOT have circular background or border
    expect(flatStyle.backgroundColor === 'transparent' || !flatStyle.backgroundColor).toBe(true);
    expect(flatStyle.borderWidth === 0 || !flatStyle.borderWidth).toBe(true);
  });

  it('RED-PLAN-INLINE-AI-01: AI Itinerary Planning button is rendered inline inside plan content without floating counter bar', () => {
    const { getByTestId, queryByText } = render(
      <PlanMapDiscovery places={[]} onGenerateAiPlan={jest.fn()} />
    );

    const aiBtn = getByTestId('ai-plan-generate-btn');
    expect(aiBtn).toBeTruthy();

    // Floating pill "0 places selected" should be removed
    expect(queryByText(/0 places selected/i)).toBeNull();
  });

  it('RED-GREEN-UNIFY-01: System colors and theme store map emerald500 and success strictly to #2E7D5B', () => {
    expect(colors.emerald500).toBe('#2E7D5B');
    expect(colors.success).toBe('#2E7D5B');

    const themeState = useThemeStore.getState();
    expect(themeState.colors.pineGreen).toBe('#2E7D5B');
    expect(themeState.colors.emerald500).toBe('#2E7D5B');
    expect(themeState.colors.success).toBe('#2E7D5B');
  });
});
