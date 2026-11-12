import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import App from '../../App';
import LoginScreen from '../../src/screens/auth/LoginScreen';
import FlightSearchScreen from '../../src/screens/booking/FlightSearchScreen';
import HotelSearchScreen from '../../src/screens/booking/HotelSearchScreen';
import { useAuthStore } from '../../src/stores/auth.store';
import { useBookingStore } from '../../src/stores/booking.store';
import { useItineraryStore } from '../../src/stores/itinerary.store';
import { useExpenseStore } from '../../src/stores/expense.store';
import { useThemeStore } from '../../src/stores/theme.store';

jest.mock('../../src/stores/auth.store');
jest.mock('../../src/stores/booking.store');
jest.mock('../../src/stores/itinerary.store');
jest.mock('../../src/stores/expense.store');

describe('Component Test: Nomadix Zero Whitespace UI Harmonization', () => {
  const mockSearchFlights = jest.fn();
  const mockSearchHotels = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    useAuthStore.mockReturnValue({
      user: null,
      isAuthenticated: false,
      isGuest: false,
      login: jest.fn(),
      continueAsGuest: jest.fn(),
      logout: jest.fn(),
      isLoading: false,
      error: null,
    });

    useBookingStore.mockReturnValue({
      flights: [
        {
          id: 'vn-240',
          airline: 'Vietnam Airlines',
          flightNumber: 'VN-240',
          origin: 'SGN',
          destination: 'HAN',
          departureTime: '2026-11-14T08:00:00Z',
          arrivalTime: '2026-11-14T10:15:00Z',
          duration: '2h 15m',
          price: 1850000,
          stops: 0,
        },
      ],
      hotels: [
        {
          id: 'novotel-dad',
          name: 'Novotel Danang',
          city: 'Da Nang',
          pricePerNight: 1450000,
          rating: 4,
          emoji: '🏨',
        },
      ],
      isLoadingFlights: false,
      isLoadingHotels: false,
      flightError: null,
      hotelError: null,
      searchFlights: mockSearchFlights,
      searchHotels: mockSearchHotels,
    });

    useItineraryStore.mockReturnValue({
      currentTrip: {
        id: 'trip-1',
        title: 'Danang Vacation 2026',
        destinationCity: 'Da Nang',
        members: [{ name: 'Duc', role: 'Owner' }],
      },
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
      fetchExpenses: jest.fn(),
      fetchDebtSummary: jest.fn(),
    });
  });

  it('RED-FE-APP-TOPBAR-01: App removes redundant top bar header & floating gear to eliminate whitespace', () => {
    const { queryByText, queryByTestId } = render(<App />);

    // App should NOT render the duplicate generic header "Flight Booking"
    expect(queryByText('Flight Booking')).toBeNull();
    // App should NOT render the floating settings gear overlay
    expect(queryByTestId('app-settings-fab')).toBeNull();
  });

  it('RED-FE-LOGIN-HERO-01: LoginScreen renders full-bleed hero branding without awkward whitespace', () => {
    const { getByText, getByTestId } = render(<LoginScreen navigation={{ navigate: jest.fn() }} />);

    // Hero title & slogan
    expect(getByText(/Travel together/i)).toBeTruthy();
    expect(getByText(/Split nothing/i)).toBeTruthy();
    expect(getByText(/but joy/i)).toBeTruthy();
    // N logo box
    expect(getByText('N')).toBeTruthy();
    // Guest button
    expect(getByText(/Continue as guest \(Viewer\)/i)).toBeTruthy();
  });

  it('RED-FE-FLIGHT-IMMEDIATE-01: FlightSearchScreen displays route chips, ticket summary card and available flights immediately', () => {
    const { getByText, getAllByText } = render(<FlightSearchScreen />);

    // Eyebrow & Title
    expect(getByText('Explore Vietnam')).toBeTruthy();
    expect(getByText('Find Flights')).toBeTruthy();

    // Route chip for SGN ⇄ HAN should be visible
    expect(getByText(/SGN ⇄ HAN/i)).toBeTruthy();

    // Ticket card details
    expect(getByText('FROM')).toBeTruthy();
    expect(getByText('TO')).toBeTruthy();
    expect(getByText('⇄')).toBeTruthy();

    // Available flights section header immediately rendered
    expect(getByText('Available flights')).toBeTruthy();
    expect(getByText('Vietnam Airlines')).toBeTruthy();
  });

  it('RED-FE-HOTEL-IMMEDIATE-01: HotelSearchScreen displays city chips, nights summary and hotel results immediately', () => {
    const { getByText } = render(<HotelSearchScreen />);

    // Eyebrow & Title
    expect(getByText('Where to stay')).toBeTruthy();
    expect(getByText(/Hotels in Da Nang/i)).toBeTruthy();

    // City chips
    expect(getByText('Da Nang')).toBeTruthy();

    // Nights summary card
    expect(getByText(/3 nights/i)).toBeTruthy();
    expect(getByText(/2 adults/i)).toBeTruthy();

    // Hotel card with Book now
    expect(getByText('Novotel Danang')).toBeTruthy();
    expect(getByText('Book now')).toBeTruthy();
  });
});
