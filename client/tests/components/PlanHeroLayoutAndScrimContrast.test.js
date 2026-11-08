import React from 'react';
import { render } from '@testing-library/react-native';
import PlanScreen from '../../src/screens/plan/PlanScreen';
import { useItineraryStore } from '../../src/stores/itinerary.store';
import { useExpenseStore } from '../../src/stores/expense.store';
import { useThemeStore } from '../../src/stores/theme.store';

jest.mock('../../src/stores/itinerary.store');
jest.mock('../../src/stores/expense.store');
jest.mock('../../src/stores/theme.store');

describe('TDD RED Phase: PlanScreen Hero Layout & Scrim Contrast', () => {
  const mockDaLatTrip = {
    id: 'trip-dalat-exp-1',
    title: 'Đà Lạt Expedition',
    destination: 'Đà Lạt',
    destinationCity: 'Đà Lạt',
    country: 'Việt Nam',
    daysCount: 3,
    status: 'Ready',
    totalDistanceKm: 15.2,
    days: [
      {
        dayIndex: 1,
        dayNumber: 1,
        distanceKm: 5.0,
        items: [
          {
            id: 'dalat-stop-1',
            name: 'Xuan Huong Lake',
            time: '08:30',
            duration: '1.5h',
          },
        ],
      },
    ],
    collaborators: [{ userId: 'u-1', role: 'OWNER' }],
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
      currentTrip: mockDaLatTrip,
      trips: [mockDaLatTrip],
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

  test('RED-HERO-LAYOUT-01: Top badges and bottom content are nested inside heroCardScrim with justifyContent space-between', () => {
    const { getByTestId } = render(<PlanScreen />);

    const heroCard = getByTestId('itinerary-hero-card');
    expect(heroCard).toBeTruthy();

    const scrim = getByTestId('itinerary-hero-scrim');
    expect(scrim).toBeTruthy();

    // The scrim must have justifyContent: 'space-between' to pull bottom content down to the bottom
    const scrimStyle = [scrim.props.style].flat();
    const hasSpaceBetween = scrimStyle.some((s) => s && s.justifyContent === 'space-between');
    expect(hasSpaceBetween).toBe(true);

    // Both status badge and eyebrow must be children of the scrim
    const statusBadge = scrim.findAll(
      (node) => node.props && node.props.testID === 'itinerary-status-badge'
    );
    expect(statusBadge.length).toBeGreaterThanOrEqual(1);

    const eyebrow = scrim.findAll(
      (node) => node.props && node.props.testID === 'itinerary-hero-eyebrow'
    );
    expect(eyebrow.length).toBeGreaterThanOrEqual(1);
  });

  test('RED-HERO-LAYOUT-02: Scrim overlay applies soft gray-dark translucent background with opacity >= 0.5 for high text contrast', () => {
    const { getByTestId } = render(<PlanScreen />);

    const scrim = getByTestId('itinerary-hero-scrim');
    const scrimStyle = [scrim.props.style].flat();
    const scrimBg = scrimStyle.find((s) => s && s.backgroundColor)?.backgroundColor;

    expect(scrimBg).toBeDefined();
    // Must be an rgba color with alpha >= 0.5
    expect(scrimBg).toMatch(/rgba\(.*,\s*0\.[5-9]\d*\)/);
  });

  test('RED-HERO-LAYOUT-03: All hero elements render with valid text without being floating or truncated', () => {
    const { getByTestId, getByText } = render(<PlanScreen />);

    expect(getByTestId('itinerary-status-badge')).toBeTruthy();
    expect(getByText('Đà Lạt Expedition')).toBeTruthy();
    expect(getByTestId('itinerary-hero-eyebrow')).toBeTruthy();
    expect(getByText(/VIỆT NAM • 3 DAYS/i)).toBeTruthy();
    expect(getByTestId('itinerary-progress-day')).toBeTruthy();
    expect(getByTestId('itinerary-progress-percent')).toBeTruthy();
  });
});
