import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import FlightSearchScreen from '../../src/screens/booking/FlightSearchScreen';
import { useBookingStore } from '../../src/stores/booking.store';

jest.mock('../../src/stores/booking.store');

describe('Component Test: FlightSearchScreen', () => {
  const mockSearchFlights = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useBookingStore.mockReturnValue({
      flights: [],
      isLoadingFlights: false,
      flightError: null,
      searchFlights: mockSearchFlights,
    });
  });

  test('RED-FE-BK-11: FlightSearchScreen should render origin, destination, departure date inputs, and search button', () => {
    const { getByPlaceholderText, getByText } = render(<FlightSearchScreen />);

    expect(getByPlaceholderText(/điểm đi|origin|SGN/i)).toBeTruthy();
    expect(getByPlaceholderText(/điểm đến|destination|HAN/i)).toBeTruthy();
    expect(getByPlaceholderText(/ngày đi|departure date|YYYY-MM-DD/i)).toBeTruthy();
    expect(getByText(/tìm chuyến bay|search flights/i)).toBeTruthy();
  });

  test('RED-FE-BK-12: FlightSearchScreen should display validation error when origin and destination are identical', async () => {
    const { getByPlaceholderText, getByText, findByText } = render(<FlightSearchScreen />);

    fireEvent.changeText(getByPlaceholderText(/điểm đi|origin|SGN/i), 'HAN');
    fireEvent.changeText(getByPlaceholderText(/điểm đến|destination|HAN/i), 'HAN');
    fireEvent.changeText(getByPlaceholderText(/ngày đi|departure date|YYYY-MM-DD/i), '2026-10-15');

    fireEvent.press(getByText(/tìm chuyến bay|search flights/i));

    const errorMessage = await findByText(/điểm đi và điểm đến không được trùng nhau|origin and destination cannot be identical/i);
    expect(errorMessage).toBeTruthy();
    expect(mockSearchFlights).not.toHaveBeenCalled();
  });

  test('RED-FE-BK-13: FlightSearchScreen should dispatch search query and display list of FlightCards', async () => {
    const mockFlightOffers = [
      {
        id: 'flight-vn-101',
        airlineCode: 'VN',
        airlineName: 'Vietnam Airlines',
        flightNumber: 'VN-101',
        origin: 'SGN',
        destination: 'HAN',
        departureTime: '2026-10-15T08:00:00Z',
        arrivalTime: '2026-10-15T10:15:00Z',
        durationMinutes: 135,
        stops: 0,
        cabinClass: 'ECONOMY',
        price: { currency: 'VND', amount: 1550000 },
      },
    ];

    useBookingStore.mockReturnValue({
      flights: mockFlightOffers,
      isLoadingFlights: false,
      flightError: null,
      searchFlights: mockSearchFlights,
    });

    const { getByPlaceholderText, getByText } = render(<FlightSearchScreen />);

    fireEvent.changeText(getByPlaceholderText(/điểm đi|origin|SGN/i), 'SGN');
    fireEvent.changeText(getByPlaceholderText(/điểm đến|destination|HAN/i), 'HAN');
    fireEvent.changeText(getByPlaceholderText(/ngày đi|departure date|YYYY-MM-DD/i), '2026-10-15');

    fireEvent.press(getByText(/tìm chuyến bay|search flights/i));

    await waitFor(() => {
      expect(mockSearchFlights).toHaveBeenCalledWith(
        expect.objectContaining({
          origin: 'SGN',
          destination: 'HAN',
          departureDate: '2026-10-15',
        })
      );
    });

    expect(getByText(/Vietnam Airlines/i)).toBeTruthy();
  });

  test('should show validation error when required fields are missing', async () => {
    const { getByText, findByText } = render(<FlightSearchScreen />);
    fireEvent.press(getByText(/tìm chuyến bay|search flights/i));

    const err = await findByText(/vui lòng nhập đầy đủ|please enter origin/i);
    expect(err).toBeTruthy();
    expect(mockSearchFlights).not.toHaveBeenCalled();
  });

  test('should display flightError from store and handle flight selection navigation', () => {
    const mockSelectFlight = jest.fn();
    const mockNavigation = { navigate: jest.fn() };
    const mockFlightOffers = [
      {
        id: 'flight-vn-101',
        airlineCode: 'VN',
        airlineName: 'Vietnam Airlines',
        flightNumber: 'VN-101',
        origin: 'SGN',
        destination: 'HAN',
        stops: 0,
        price: { currency: 'VND', amount: 1550000 },
      },
    ];

    useBookingStore.mockReturnValue({
      flights: mockFlightOffers,
      isLoadingFlights: false,
      flightError: 'Server error 500',
      searchFlights: mockSearchFlights,
      selectFlight: mockSelectFlight,
    });

    const { getByText, getByTestId } = render(
      <FlightSearchScreen navigation={mockNavigation} />
    );

    expect(getByText('Server error 500')).toBeTruthy();

    fireEvent.press(getByTestId('flight-card-flight-vn-101'));
    expect(mockSelectFlight).toHaveBeenCalledWith(mockFlightOffers[0]);
    expect(mockNavigation.navigate).toHaveBeenCalledWith('FlightDetails', { flightId: 'flight-vn-101' });
  });
});
