import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import AccordionTripWizardModal from '../../src/components/plan/AccordionTripWizardModal';
import PlanScreen from '../../src/screens/plan/PlanScreen';
import { useItineraryStore } from '../../src/stores/itinerary.store';
import { useExpenseStore } from '../../src/stores/expense.store';
import { usePlacesStore } from '../../src/stores/places.store';
import { useThemeStore } from '../../src/stores/theme.store';

jest.mock('../../src/stores/itinerary.store');
jest.mock('../../src/stores/expense.store');
jest.mock('../../src/stores/places.store');
jest.mock('../../src/stores/theme.store');

describe('TDD RED Phase: Global Destinations & Color Harmonization Verification', () => {
  const mockDaNangTrip = {
    id: 'trip-danang-palette-1',
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
        ],
      },
      {
        dayIndex: 2,
        dayNumber: 2,
        distanceKm: 7.0,
        items: [],
      },
      {
        dayIndex: 3,
        dayNumber: 3,
        distanceKm: 7.8,
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

    usePlacesStore.mockReturnValue({
      places: [],
      selectedPlaceIds: new Set(),
      searchQuery: '',
      activeCategory: 'all',
      isLoading: false,
      fetchPlaces: jest.fn().mockResolvedValue([]),
    });
  });

  test('RED-GLOBAL-01: Step 1 (Where?) renders country filter pills and filters cities by country', () => {
    const { getByTestId, getByText, queryByText } = render(
      <AccordionTripWizardModal visible={true} onClose={jest.fn()} />
    );

    // Country filter chips should be rendered
    expect(getByTestId('country-filter-all')).toBeTruthy();
    expect(getByTestId('country-filter-VN')).toBeTruthy();
    expect(getByTestId('country-filter-JP')).toBeTruthy();
    expect(getByTestId('country-filter-US')).toBeTruthy();

    // Tap USA filter
    fireEvent.press(getByTestId('country-filter-US'));

    // Should display USA cities
    expect(getByText('New York')).toBeTruthy();

    // Non-US cities like Tokyo or Rome should not be present in filtered list
    expect(queryByText('Tokyo')).toBeNull();
  });

  test('RED-GLOBAL-02: Global search input matches worldwide cities across countries in real-time', () => {
    const { getByTestId, getByText } = render(
      <AccordionTripWizardModal visible={true} onClose={jest.fn()} />
    );

    const searchInput = getByTestId('destination-search-input');

    // Search for London
    fireEvent.changeText(searchInput, 'London');
    expect(getByText('London')).toBeTruthy();

    // Search for Sydney
    fireEvent.changeText(searchInput, 'Sydney');
    expect(getByText('Sydney')).toBeTruthy();
  });

  test('RED-COLOR-04: Itinerary day chips adhere to reference image color principle (Active: #0F172A, Inactive: #FFFFFF with #E2E8F0 border)', () => {
    const { getByTestId, getByText } = render(<PlanScreen />);

    // Day 1 is active by default
    const day1Chip = getByTestId('itinerary-day-chip-1');
    const day2Chip = getByTestId('itinerary-day-chip-2');

    // Flatten styles to verify colors
    const flatDay1Style = Array.isArray(day1Chip.props.style)
      ? Object.assign({}, ...day1Chip.props.style.filter(Boolean))
      : day1Chip.props.style;
    const flatDay2Style = Array.isArray(day2Chip.props.style)
      ? Object.assign({}, ...day2Chip.props.style.filter(Boolean))
      : day2Chip.props.style;

    // Active chip must be solid #0F172A (matching active "Da Nang" pill in reference image)
    expect(flatDay1Style.backgroundColor).toBe('#0F172A');

    // Inactive chip must be white #FFFFFF with #E2E8F0 border (matching inactive "Hoi An" pill in reference image)
    expect(flatDay2Style.backgroundColor).toBe('#FFFFFF');
    expect(flatDay2Style.borderColor).toBe('#E2E8F0');
  });

  test('RED-COLOR-05: Bottom bar buttons adhere to reference image principles (Start Trip is #0F172A, Re-Pick is #FFFFFF with #E2E8F0 border)', () => {
    const { getByTestId } = render(<PlanScreen />);

    const startTripBtn = getByTestId('itinerary-start-trip-btn');
    const repickBtn = getByTestId('itinerary-repick-spots-btn');

    const flatStartTripStyle = Array.isArray(startTripBtn.props.style)
      ? Object.assign({}, ...startTripBtn.props.style.filter(Boolean))
      : startTripBtn.props.style;
    const flatRepickStyle = Array.isArray(repickBtn.props.style)
      ? Object.assign({}, ...repickBtn.props.style.filter(Boolean))
      : repickBtn.props.style;

    // Primary CTA Start Trip must be #0F172A (not green #2E7D5B)
    expect(flatStartTripStyle.backgroundColor).toBe('#0F172A');

    // Secondary Re-Pick Spots must be #FFFFFF with #E2E8F0 border
    expect(flatRepickStyle.backgroundColor).toBe('#FFFFFF');
    expect(flatRepickStyle.borderColor).toBe('#E2E8F0');
  });
});
