import React from 'react';
import { render } from '@testing-library/react-native';
import PlanScreen from '../../src/screens/plan/PlanScreen';
import { useItineraryStore } from '../../src/stores/itinerary.store';
import { useExpenseStore } from '../../src/stores/expense.store';
import { useThemeStore } from '../../src/stores/theme.store';
import { CITY_COVERS } from '../../src/components/plan/TripCardHero';

jest.mock('../../src/stores/itinerary.store');
jest.mock('../../src/stores/expense.store');
jest.mock('../../src/stores/theme.store');

describe('TDD RED Phase: Trip Hero Cards Identical Sync (PlanScreen vs TripCardHero)', () => {
  const mockLondonTrip = {
    id: 'trip-london-1',
    title: 'London Expedition',
    destination: 'London',
    destinationCity: 'London',
    country: 'Vương quốc Anh',
    daysCount: 3,
    status: 'Ready',
    totalDistanceKm: 12.5,
    days: [
      {
        dayIndex: 1,
        dayNumber: 1,
        distanceKm: 4.2,
        items: [
          {
            id: 'ldn-stop-1',
            name: 'Tower Bridge',
            time: '09:00',
            duration: '2h',
          },
        ],
      },
    ],
    collaborators: [{ userId: 'u-1', fullName: 'Đức Nguyễn', role: 'OWNER' }],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useThemeStore.mockReturnValue({
      mode: 'light',
      colors: {
        background: '#F8FAFC',
        card: '#FFFFFF',
        text: '#0F172A',
        textMuted: '#64748B',
        border: '#E2E8F0',
        primary: '#0F172A',
      },
    });

    useItineraryStore.mockReturnValue({
      currentTrip: mockLondonTrip,
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

  test('RED-HERO-SYNC-01: London trip in PlanScreen renders London cover image instead of Da Nang Golden Bridge', () => {
    const { getByTestId } = render(<PlanScreen />);

    const heroCard = getByTestId('itinerary-hero-card');
    expect(heroCard).toBeTruthy();

    const imageElement = heroCard.findByType('Image');
    expect(imageElement).toBeTruthy();

    // Must NOT be the hardcoded Da Nang Cầu Vàng image (photo-1559592413-7cec4d0cae2b)
    expect(imageElement.props.source.uri).not.toContain('photo-1559592413-7cec4d0cae2b');

    // Must be the London cover image matching CITY_COVERS.london
    expect(imageElement.props.source.uri).toContain('photo-1513635269975-59663e0ac1ad');
  });

  test('RED-HERO-SYNC-02: Hero card displays status badge matching trip status (Ready) rather than hardcoded LIVE', () => {
    const { getByTestId, getAllByText } = render(<PlanScreen />);

    // Should display Ready badge matching Image 2
    expect(getAllByText(/Ready/i).length).toBeGreaterThan(0);

    const statusBadge = getByTestId('itinerary-status-badge');
    expect(statusBadge).toBeTruthy();
  });

  test('RED-HERO-SYNC-03: Country & Days metadata is rendered as an eyebrow above trip title', () => {
    const { getByTestId, getByText } = render(<PlanScreen />);

    const eyebrow = getByTestId('itinerary-hero-eyebrow');
    expect(eyebrow).toBeTruthy();
    expect(eyebrow.props.children).toMatch(/VƯƠNG QUỐC ANH/i);
    expect(eyebrow.props.children).toMatch(/3 DAYS/i);
  });
});
