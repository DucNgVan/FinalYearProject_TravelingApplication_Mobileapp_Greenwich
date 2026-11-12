import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import PlanScreen from '../../src/screens/plan/PlanScreen';
import { useItineraryStore } from '../../src/stores/itinerary.store';
import { useExpenseStore } from '../../src/stores/expense.store';

jest.mock('../../src/stores/itinerary.store');
jest.mock('../../src/stores/expense.store');

describe('Component Test: PlanScreen Add Stop Flow', () => {
  const mockTrip = {
    id: 'trip-101',
    title: 'Phượt Đà Lạt 3N2Đ cùng Squad',
    destination: 'Đà Lạt',
    startDate: '2026-10-15',
    endDate: '2026-10-17',
    collaborators: [{ userId: 'u-1', fullName: 'Đức Nguyễn', role: 'OWNER' }],
    days: [
      {
        dayIndex: 1,
        date: '2026-10-15',
        items: [
          {
            id: 'item-1',
            name: 'Tiệm Cafe Mê Linh',
            arrivalTime: '08:00',
            durationMinutes: 90,
          },
        ],
      },
    ],
  };

  const mockAddStop = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useItineraryStore.mockReturnValue({
      currentTrip: mockTrip,
      addStop: mockAddStop,
      inviteCompanion: jest.fn(),
    });
    useExpenseStore.mockReturnValue({
      expenses: [],
      debtSummary: { totalExpense: 0, memberBalances: [], simplifiedSettlements: [] },
    });
  });

  test('RED-FE-PLAN-STOP-01: opens Add Stop modal, fills input, and triggers addStop', () => {
    const { getByText, getByPlaceholderText } = render(<PlanScreen />);

    // Click "+ Add Stop"
    const addStopBtn = getByText('+ Add Stop');
    fireEvent.press(addStopBtn);

    // Modal should be visible
    expect(getByText('Add New Stop')).toBeTruthy();

    // Fill form
    fireEvent.changeText(getByPlaceholderText(/e\.g\..*Ba Na Hills/i), 'Thác Datanla');
    fireEvent.changeText(getByPlaceholderText(/e\.g\..*10:30/i), '10:30');
    fireEvent.changeText(getByPlaceholderText(/e\.g\..*90 mins/i), '120');

    // Submit
    fireEvent.press(getByText('Save Stop'));

    expect(mockAddStop).toHaveBeenCalledWith('trip-101', {
      dayIndex: 1,
      name: 'Thác Datanla',
      arrivalTime: '10:30',
      durationMinutes: 120,
    });
  });
});
