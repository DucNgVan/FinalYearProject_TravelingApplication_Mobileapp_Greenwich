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

describe('Component Test: App Root Navigation & Auth Guard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useBookingStore.mockReturnValue({
      flights: [],
      hotels: [],
      isLoadingFlights: false,
      isLoadingHotels: false,
      flightError: null,
      hotelError: null,
      searchFlights: jest.fn(),
      searchHotels: jest.fn(),
    });

    useItineraryStore.mockReturnValue({
      currentTrip: null,
      trips: [],
      isLoading: false,
      error: null,
      fetchTrips: jest.fn(),
      fetchTripDetails: jest.fn(),
    });

    useExpenseStore.mockReturnValue({
      expenses: [],
      debtSummary: null,
      isLoading: false,
      error: null,
      fetchTripExpenses: jest.fn(),
      fetchDebtSummary: jest.fn(),
    });
  });

  test('RED-FE-APP-01: when unauthenticated, displays the 3 pre-login onboarding tabs (Book, Plan, Split)', () => {
    useAuthStore.mockReturnValue({
      isAuthenticated: false,
      isGuest: false,
      user: null,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
    });

    const { getByText } = render(<App />);

    // Slide 1: Book
    expect(getByText(/Flights & stays, in one swipe/i)).toBeTruthy();
    expect(getByText(/SGN → DAD/i)).toBeTruthy();
    expect(getByText(/3 nights · 4.9★/i)).toBeTruthy();
    expect(getByText(/Next →/i)).toBeTruthy();
    expect(getByText(/Log In/i)).toBeTruthy();

    // Advance to Slide 2: Plan
    fireEvent.press(getByText(/Next →/i));
    expect(getByText(/Plan the trip, together/i)).toBeTruthy();
    expect(getByText(/Squad of 3/i)).toBeTruthy();

    // Advance to Slide 3: Split
    fireEvent.press(getByText(/Next →/i));
    expect(getByText(/Smart group expense split/i)).toBeTruthy();
    expect(getByText(/Let's go →/i)).toBeTruthy();
  });

  test('RED-FE-APP-02: when authenticated, displays bottom tabs (Flights, Hotels, Plan, Profile)', () => {
    useAuthStore.mockReturnValue({
      isAuthenticated: true,
      isGuest: false,
      user: { fullName: 'Đức Nguyễn', email: 'duc@example.com' },
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
    });

    const { getByText, queryByText, getAllByText, getByTestId } = render(<App />);

    // Should show the functional bottom tabs
    expect(getByTestId('tab-btn-flights')).toBeTruthy();
    expect(getByTestId('tab-btn-hotels')).toBeTruthy();
    expect(getByTestId('tab-btn-plan')).toBeTruthy();
    expect(getAllByText('Profile').length).toBeGreaterThanOrEqual(1);

    // Should NOT show login screen
    expect(queryByText('Welcome Back')).toBeNull();
  });

  test('RED-FE-APP-03: clicking "Plan" tab renders the Plan screen', () => {
    useAuthStore.mockReturnValue({
      isAuthenticated: true,
      isGuest: false,
      user: { fullName: 'Đức Nguyễn', email: 'duc@example.com' },
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
    });

    const { getAllByText, getByTestId } = render(<App />);

    const planTabButton = getByTestId('tab-btn-plan');
    fireEvent.press(planTabButton);

    expect(getAllByText(/No Travel Plan Yet|Trip Itinerary|My Saved Trips/i).length).toBeGreaterThan(0);
  });

  test('RED-FE-APP-04: allows switching to Hotels and Flights tabs and calling logout', () => {
    const mockLogout = jest.fn();
    useAuthStore.mockReturnValue({
      isAuthenticated: true,
      isGuest: false,
      user: { fullName: 'Đức Nguyễn' },
      logout: mockLogout,
    });

    const { getByText, getAllByText, getByTestId } = render(<App />);

    // Switch to Hotel tab
    fireEvent.press(getByTestId('tab-btn-hotels'));
    expect(getByText(/Where to stay/i)).toBeTruthy();

    // Switch to Flight tab
    fireEvent.press(getByTestId('tab-btn-flights'));
    expect(getAllByText(/Find Flights/i).length).toBeGreaterThanOrEqual(1);

    // Switch to Home then Profile and click Logout
    fireEvent.press(getByTestId('tab-btn-home'));
    fireEvent.press(getAllByText('Profile')[0]);
    fireEvent.press(getByText('Log Out'));
    expect(mockLogout).toHaveBeenCalled();
  });

  test('RED-FE-APP-05: toggles between Login and Register screens after completing onboarding', () => {
    useAuthStore.mockReturnValue({
      isAuthenticated: false,
      isGuest: false,
      user: null,
      login: jest.fn(),
      register: jest.fn(),
    });

    const { getByText, getAllByText } = render(<App initialHasCompletedOnboarding={true} />);

    // In Login screen, click Register link
    fireEvent.press(getByText(/Sign Up|Register/i));
    expect(getByText(/Create a new account/i)).toBeTruthy();

    // In Register screen, click Login link
    fireEvent.press(getByText('Login'));
    expect(getAllByText('NOMADIX').length).toBeGreaterThanOrEqual(1);
  });

  test('RED-FE-APP-06: tapping "Log In" header shortcut on onboarding directly shows LoginScreen', () => {
    useAuthStore.mockReturnValue({
      isAuthenticated: false,
      isGuest: false,
      user: null,
      login: jest.fn(),
      register: jest.fn(),
    });

    const { getByText, getAllByText } = render(<App />);

    // Tap "Log In" header button
    fireEvent.press(getByText('Log In'));

    expect(getAllByText('NOMADIX').length).toBeGreaterThanOrEqual(1);
    expect(getByText(/Travel together/i)).toBeTruthy();
    expect(getByText('Login')).toBeTruthy();
  });
});
