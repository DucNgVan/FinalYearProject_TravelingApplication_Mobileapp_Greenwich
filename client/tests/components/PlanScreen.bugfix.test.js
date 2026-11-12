import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import PlanScreen from '../../src/screens/plan/PlanScreen';
import { useItineraryStore } from '../../src/stores/itinerary.store';
import { useExpenseStore } from '../../src/stores/expense.store';
import { usePlacesStore } from '../../src/stores/places.store';

jest.mock('../../src/stores/itinerary.store');
jest.mock('../../src/stores/expense.store');
jest.mock('../../src/stores/places.store');

describe('BugFix Tests: PlanScreen Critical Runtime Fixes', () => {
  const mockCreateTrip = jest.fn();
  const mockApplyAiPlan = jest.fn();
  const mockGenerateAiPlan = jest.fn().mockResolvedValue({
    days: { 1: [{ id: 'dn-01', name: 'Cầu Rồng', lat: 16.061, lng: 108.227 }] },
  });

  const basePlacesStore = {
    places: [
      { id: 'dn-01', name: 'Cầu Rồng Đà Nẵng', category: 'landmark', city: 'Đà Nẵng', lat: 16.061, lng: 108.227, rating: 4.8, address: 'Nguyễn Văn Linh' },
    ],
    selectedPlaceIds: new Set(['dn-01']),
    searchQuery: '',
    activeCategory: 'all',
    isLoading: false,
    fetchPlaces: jest.fn(),
    generateAiPlan: mockGenerateAiPlan,
    togglePlaceSelection: jest.fn(),
  };

  const baseExpenseStore = {
    expenses: [],
    debtSummary: null,
    isLoading: false,
    error: null,
    settleDebt: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // BUGFIX-01: createTrip payload must use destinationCity (not destination) to match backend Joi schema
  it('BUGFIX-01: createTrip payload uses destinationCity field matching backend Joi schema', async () => {
    const existingTrip = {
      id: 'existing-01',
      title: 'Current Trip',
      destinationCity: 'Đà Nẵng',
      startDate: '2026-10-15',
      endDate: '2026-10-17',
      collaborators: [{ userId: 'u-1', fullName: 'Đức', role: 'OWNER' }],
      days: [{ dayNumber: 1, date: '2026-10-15', items: [] }],
    };
    useItineraryStore.mockReturnValue({
      currentTrip: existingTrip,
      trips: [existingTrip],
      createTrip: mockCreateTrip,
      applyAiPlan: mockApplyAiPlan,
      addStop: jest.fn(),
      inviteCompanion: jest.fn(),
    });
    useExpenseStore.mockReturnValue(baseExpenseStore);
    usePlacesStore.mockReturnValue(basePlacesStore);

    const { getByText, getByTestId } = render(<PlanScreen />);

    // Open unified trip wizard
    fireEvent.press(getByText('+ New Trip'));

    // Step through unified wizard
    fireEvent.press(getByTestId('trending-destination-danang'));
    fireEvent.press(getByTestId('when-next-btn'));
    fireEvent.press(getByTestId('preferences-next-btn'));
    fireEvent.press(getByTestId('spot-card-my-khe'));
    fireEvent.press(getByTestId('spots-continue-btn'));
    fireEvent.press(getByTestId('stay-option-hotel'));
    fireEvent.press(getByTestId('stay-continue-btn'));
    fireEvent.press(getByTestId('invite-share-view-plan-btn'));

    await waitFor(() => {
      expect(mockCreateTrip).toHaveBeenCalledTimes(1);
      const payload = mockCreateTrip.mock.calls[0][0];
      expect(payload).toHaveProperty('destinationCity', 'Đà Nẵng');
    });
  });

  // BUGFIX-04: PlanScreen must handle dayNumber field from backend (not just dayIndex)
  it('BUGFIX-04: renders day selector chips correctly using dayNumber field from backend response', () => {
    const tripWithDayNumber = {
      id: 'trip-fix-04',
      title: 'Test Trip',
      destination: 'Đà Nẵng',
      startDate: '2026-10-15',
      endDate: '2026-10-17',
      collaborators: [{ userId: 'u-1', fullName: 'Đức', role: 'OWNER', status: 'ACCEPTED' }],
      days: [
        { dayNumber: 1, date: '2026-10-15', items: [{ id: 'i1', name: 'Cầu Rồng', arrivalTime: '09:00', durationMinutes: 90 }] },
        { dayNumber: 2, date: '2026-10-16', items: [] },
        { dayNumber: 3, date: '2026-10-17', items: [] },
      ],
    };

    useItineraryStore.mockReturnValue({
      currentTrip: tripWithDayNumber,
      trips: [tripWithDayNumber],
      createTrip: mockCreateTrip,
      applyAiPlan: mockApplyAiPlan,
      addStop: jest.fn(),
      inviteCompanion: jest.fn(),
    });
    useExpenseStore.mockReturnValue(baseExpenseStore);
    usePlacesStore.mockReturnValue(basePlacesStore);

    const { getByText } = render(<PlanScreen />);

    // Day chips should display correct numbers even when backend returns dayNumber
    expect(getByText('Day 1')).toBeTruthy();
    expect(getByText('Day 2')).toBeTruthy();
    expect(getByText('Day 3')).toBeTruthy();
  });

  // BUGFIX-04b: selecting a day with dayNumber should show its items
  it('BUGFIX-04b: displays stop items for day 1 using dayNumber field', () => {
    const tripWithDayNumber = {
      id: 'trip-fix-04b',
      title: 'Test Trip',
      destination: 'Đà Nẵng',
      startDate: '2026-10-15',
      endDate: '2026-10-17',
      collaborators: [{ userId: 'u-1', fullName: 'Đức', role: 'OWNER', status: 'ACCEPTED' }],
      days: [
        { dayNumber: 1, date: '2026-10-15', items: [{ id: 'i1', name: 'Bán đảo Sơn Trà', arrivalTime: '09:00', durationMinutes: 120 }] },
        { dayNumber: 2, date: '2026-10-16', items: [] },
      ],
    };

    useItineraryStore.mockReturnValue({
      currentTrip: tripWithDayNumber,
      trips: [tripWithDayNumber],
      createTrip: mockCreateTrip,
      applyAiPlan: mockApplyAiPlan,
      addStop: jest.fn(),
      inviteCompanion: jest.fn(),
    });
    useExpenseStore.mockReturnValue(baseExpenseStore);
    usePlacesStore.mockReturnValue(basePlacesStore);

    const { getByText } = render(<PlanScreen />);

    // Day 1 is selected by default, its items should be visible
    expect(getByText('Bán đảo Sơn Trà')).toBeTruthy();
  });

  // BUGFIX-03: AI plan generation must forward selected places from map discovery
  it('BUGFIX-03: handleGenerateAiPlan passes selected places to store generateAiPlan', async () => {
    const trip = {
      id: 'trip-fix-03',
      title: 'AI Plan Test',
      destination: 'Đà Nẵng',
      startDate: '2026-10-15',
      endDate: '2026-10-17',
      collaborators: [{ userId: 'u-1', fullName: 'Đức', role: 'OWNER', status: 'ACCEPTED' }],
      days: [{ dayIndex: 1, date: '2026-10-15', items: [] }],
    };

    useItineraryStore.mockReturnValue({
      currentTrip: trip,
      trips: [trip],
      createTrip: mockCreateTrip,
      applyAiPlan: mockApplyAiPlan,
      addStop: jest.fn(),
      inviteCompanion: jest.fn(),
    });
    useExpenseStore.mockReturnValue(baseExpenseStore);
    usePlacesStore.mockReturnValue(basePlacesStore);

    const { getByText } = render(<PlanScreen />);

    // Switch to Map Discovery tab
    fireEvent.press(getByText(/Map & Places|Map/));

    // Trigger AI plan generation
    fireEvent.press(getByText(/✨ AI Itinerary Planning/));

    await waitFor(() => {
      expect(mockGenerateAiPlan).toHaveBeenCalledWith(
        3, // durationDays calculated from dates
        expect.arrayContaining([
          expect.objectContaining({ id: 'dn-01' }),
        ])
      );
    });
  });

  // BUGFIX-05: Header should display destinationCity when destination is absent
  it('BUGFIX-05: header displays destinationCity from backend response', () => {
    const tripWithDestCity = {
      id: 'trip-fix-05',
      title: 'Backend Trip',
      destinationCity: 'Hà Nội',
      startDate: '2026-11-01',
      endDate: '2026-11-03',
      collaborators: [{ userId: 'u-1', fullName: 'Đức', role: 'OWNER', status: 'ACCEPTED' }],
      days: [{ dayNumber: 1, date: '2026-11-01', items: [] }],
    };

    useItineraryStore.mockReturnValue({
      currentTrip: tripWithDestCity,
      trips: [tripWithDestCity],
      createTrip: mockCreateTrip,
      applyAiPlan: mockApplyAiPlan,
      addStop: jest.fn(),
      inviteCompanion: jest.fn(),
    });
    useExpenseStore.mockReturnValue(baseExpenseStore);
    usePlacesStore.mockReturnValue(basePlacesStore);

    const { getByText } = render(<PlanScreen />);

    // Should display destinationCity in header subtitle
    expect(getByText(/Hà Nội/)).toBeTruthy();
  });
});
