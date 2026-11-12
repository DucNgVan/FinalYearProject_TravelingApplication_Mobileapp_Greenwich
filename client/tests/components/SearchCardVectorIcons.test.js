import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import HotelSearchScreen from '../../src/screens/booking/HotelSearchScreen';
import FlightSearchScreen from '../../src/screens/booking/FlightSearchScreen';
import HomeScreen from '../../src/screens/home/HomeScreen';
import { useBookingStore } from '../../src/stores/booking.store';
import { useItineraryStore } from '../../src/stores/itinerary.store';
import { useAuthStore } from '../../src/stores/auth.store';
import { useThemeStore } from '../../src/stores/theme.store';

jest.mock('../../src/stores/booking.store');
jest.mock('../../src/stores/itinerary.store');
jest.mock('../../src/stores/auth.store');

describe('TDD Suite: Search Card Vector Lucide Icons (Zero Raw Emojis)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.mockReturnValue({
      user: { id: 'test-user', fullName: 'Tester' },
      isAuthenticated: true,
      isGuest: false,
    });
    useItineraryStore.mockReturnValue({
      currentTrip: {
        id: 'trip-1',
        title: 'Berlin 2026',
        destinationCity: 'Berlin',
        days: [{}, {}],
      },
      trips: [],
      isLoading: false,
      fetchUserTrips: jest.fn(),
      fetchTripDetails: jest.fn(),
    });
    useBookingStore.mockReturnValue({
      hotels: [
        {
          id: 'hotel-01',
          name: 'Grand Da Nang Hotel',
          city: 'Đà Nẵng',
          starRating: 5,
          reviewScore: 9.2,
          pricePerNight: 1500000,
          currency: 'VND',
        },
      ],
      flights: [
        {
          id: 'flight-01',
          flightNumber: 'VN123',
          airline: 'Vietnam Airlines',
          origin: 'SGN',
          destination: 'HAN',
          departureTime: '2026-11-15T08:00:00Z',
          arrivalTime: '2026-11-15T10:15:00Z',
          stops: 0,
          price: { amount: 1200000, currency: 'VND' },
        },
      ],
      isLoadingHotels: false,
      isLoadingFlights: false,
      hotelError: null,
      flightError: null,
      searchHotels: jest.fn().mockResolvedValue([]),
      searchFlights: jest.fn().mockResolvedValue([]),
      selectHotel: jest.fn(),
      selectFlight: jest.fn(),
    });
    useThemeStore.getState().setThemeMode('light');
  });

  test('RED-VECTOR-01: HotelSearchScreen summaryCard renders vector LucideIcon calendar & users, without device emojis', async () => {
    const { getByText, getByTestId, queryByText } = render(<HotelSearchScreen />);

    // Trigger search to collapse the panel into summaryCard
    const searchBtn = getByText(/Search Hotels|Tìm khách sạn/i);
    fireEvent.press(searchBtn);

    await waitFor(() => {
      // Must contain 1-color vector Lucide icon components
      expect(getByTestId('lucide-icon-calendar')).toBeTruthy();
      expect(getByTestId('lucide-icon-users')).toBeTruthy();
    });

    // Must NOT contain raw emojis in the text
    expect(queryByText(/📅/)).toBeNull();
    expect(queryByText(/👥/)).toBeNull();
  });

  test('RED-VECTOR-02: FlightSearchScreen collapsed ticket row renders vector LucideIcon calendar & users/user', async () => {
    const { getByText, getByTestId, queryByText } = render(<FlightSearchScreen />);

    // Trigger search to collapse flight ticket row
    const searchBtn = getByText(/Search Flights|Tìm chuyến bay/i);
    fireEvent.press(searchBtn);

    await waitFor(() => {
      expect(getByTestId('lucide-icon-calendar')).toBeTruthy();
      expect(getByTestId('lucide-icon-users')).toBeTruthy();
    });

    // Must NOT contain raw emojis in the text
    expect(queryByText(/📅/)).toBeNull();
    expect(queryByText(/👤/)).toBeNull();
  });

  test('RED-VECTOR-03: HomeScreen Hero metadata pills render vector LucideIcon calendar & users', () => {
    const { getByTestId, queryByText } = render(<HomeScreen />);

    expect(getByTestId('lucide-icon-calendar')).toBeTruthy();
    expect(getByTestId('lucide-icon-users')).toBeTruthy();

    expect(queryByText(/📅 19 days/)).toBeNull();
    expect(queryByText(/👥 3 travelers/)).toBeNull();
  });
});
