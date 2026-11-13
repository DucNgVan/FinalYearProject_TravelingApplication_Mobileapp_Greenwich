import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import App from '../../App';
import { useAuthStore } from '../../src/stores/auth.store';
import { useBookingStore } from '../../src/stores/booking.store';
import { useItineraryStore } from '../../src/stores/itinerary.store';
import { useExpenseStore } from '../../src/stores/expense.store';

jest.mock('../../src/stores/auth.store');
jest.mock('../../src/stores/booking.store');
jest.mock('../../src/stores/itinerary.store');
jest.mock('../../src/stores/expense.store');

describe('Component Test: App 4-Tab Navigation (Flight, Hotel, Plan, Account)', () => {
  const mockUser = {
    fullName: 'Nguyễn Văn Đức',
    email: 'traveler@nomadix.vn',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.mockReturnValue({
      isAuthenticated: true,
      user: mockUser,
      logout: jest.fn(),
    });
    useBookingStore.mockReturnValue({
      flights: [],
      hotels: [],
      isLoadingFlights: false,
      isLoadingHotels: false,
      searchFlights: jest.fn(),
      searchHotels: jest.fn(),
    });
    useItineraryStore.mockReturnValue({
      currentTrip: null,
      trips: [],
    });
    useExpenseStore.mockReturnValue({
      expenses: [],
      debtSummary: null,
    });
  });

  test('RED-FE-NAV-4TAB-01: renders 5 bottom tabs: Flights, Hotels, Home, Plan, Profile (Group consolidated into Plan)', () => {
    const { getByText, queryByText, getByTestId } = render(<App initialHasCompletedOnboarding={true} />);

    expect(getByTestId('tab-btn-flights')).toBeTruthy();
    expect(getByTestId('tab-btn-hotels')).toBeTruthy();
    expect(getByTestId('tab-btn-home')).toBeTruthy();
    expect(getByTestId('tab-btn-plan')).toBeTruthy();
    expect(getByTestId('tab-btn-profile')).toBeTruthy();
    expect(queryByText('Group')).toBeNull();
  });

  test('RED-FE-NAV-4TAB-02: clicking Profile tab in dock switches to ProfileScreen', () => {
    const { getByTestId, getByText } = render(<App initialHasCompletedOnboarding={true} />);

    const profileBtn = getByTestId('tab-btn-profile');
    fireEvent.press(profileBtn);

    // ProfileScreen content should appear
    expect(getByText('Nguyễn Văn Đức')).toBeTruthy();
    expect(getByText('traveler@nomadix.vn')).toBeTruthy();
  });
});
