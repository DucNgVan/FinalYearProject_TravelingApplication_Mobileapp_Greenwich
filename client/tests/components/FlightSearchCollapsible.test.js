import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import FlightSearchScreen from '../../src/screens/booking/FlightSearchScreen';
import { useBookingStore } from '../../src/stores/booking.store';

jest.mock('../../src/stores/booking.store');

describe('Component Test: FlightSearchScreen with Collapsible Search Box & Route Chips', () => {
  const mockSearchFlights = jest.fn().mockResolvedValue([]);

  beforeEach(() => {
    jest.clearAllMocks();
    useBookingStore.mockReturnValue({
      flights: [
        {
          id: 'flight-01',
          airlineCode: 'VN',
          airlineName: 'Vietnam Airlines',
          flightNumber: 'VN-128',
          origin: 'SGN',
          destination: 'HAN',
          departureTime: '2026-10-15T08:00:00Z',
          arrivalTime: '2026-10-15T10:15:00Z',
          durationMinutes: 135,
          stops: 0,
          price: { currency: 'VND', amount: 1450000 },
        },
      ],
      isLoadingFlights: false,
      flightError: null,
      searchFlights: mockSearchFlights,
    });
  });

  test('RED-FE-FLT-COL-01: clicking route chip pre-fills origin and destination and triggers search', () => {
    const { getByText } = render(<FlightSearchScreen />);

    // Quick chip SGN → HAN
    const routeChip = getByText('SGN → HAN');
    fireEvent.press(routeChip);

    const searchBtn = getByText(/Tìm chuyến bay|Search Flights/i);
    fireEvent.press(searchBtn);

    expect(mockSearchFlights).toHaveBeenCalledWith(
      expect.objectContaining({
        origin: 'SGN',
        destination: 'HAN',
      })
    );
  });

  test('RED-FE-FLT-COL-02: search box collapses after search and expands upon pressing "Thay đổi"', async () => {
    const { getByText, queryByPlaceholderText } = render(<FlightSearchScreen />);

    // Click quick route and search
    fireEvent.press(getByText('SGN → HAN'));
    fireEvent.press(getByText(/Tìm chuyến bay|Search Flights/i));

    // Should see "Thay đổi" button in collapsed summary
    await waitFor(() => {
      expect(getByText(/Thay đổi|Edit/i)).toBeTruthy();
    });

    // Clicking "Thay đổi" expands the search box back
    fireEvent.press(getByText(/Thay đổi|Edit/i));
    expect(queryByPlaceholderText(/Điểm đi|Origin/i)).toBeTruthy();
  });
});
