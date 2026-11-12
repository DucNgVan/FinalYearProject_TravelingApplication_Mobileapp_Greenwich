import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import HotelSearchScreen from '../../src/screens/booking/HotelSearchScreen';
import { useBookingStore } from '../../src/stores/booking.store';

jest.mock('../../src/stores/booking.store');

describe('Component Test: HotelSearchScreen with Collapsible Search Box & City Chips', () => {
  const mockSearchHotels = jest.fn().mockResolvedValue([]);
  const mockSelectHotel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useBookingStore.mockReturnValue({
      hotels: [
        {
          id: 'hotel-01',
          name: 'Ana Mandara Villas Dalat Resort',
          city: 'Đà Lạt',
          address: 'Đường Lê Lai, Phường 5, TP. Đà Lạt',
          starRating: 5,
          reviewScore: 9.6,
          pricePerNight: 3200000,
          currency: 'VND',
        },
      ],
      isLoadingHotels: false,
      hotelError: null,
      searchHotels: mockSearchHotels,
      selectHotel: mockSelectHotel,
    });
  });

  test('RED-FE-HTL-COL-01: clicking city quick chip updates destination and search can be triggered', async () => {
    const { getByText, getByPlaceholderText } = render(<HotelSearchScreen />);

    // Quick chip "Đà Lạt"
    const chipDaLat = getByText('Đà Lạt');
    fireEvent.press(chipDaLat);

    // Search button
    const searchBtn = getByText(/Tìm khách sạn|Search Hotels/i);
    fireEvent.press(searchBtn);

    expect(mockSearchHotels).toHaveBeenCalledWith(
      expect.objectContaining({
        city: 'Đà Lạt',
      })
    );
  });

  test('RED-FE-HTL-COL-02: search box collapses into compact summary card with "Thay đổi" button after search', async () => {
    const { getByText, queryByPlaceholderText } = render(<HotelSearchScreen />);

    // Select Da Lat and search
    fireEvent.press(getByText('Đà Lạt'));
    fireEvent.press(getByText(/Tìm khách sạn|Search Hotels/i));

    // Should display collapsed summary card
    await waitFor(() => {
      expect(getByText(/Thay đổi|Edit/i)).toBeTruthy();
    });

    // Clicking "Thay đổi" expands search box again
    fireEvent.press(getByText(/Thay đổi|Edit/i));
    expect(queryByPlaceholderText(/Thành phố|Destination/i)).toBeTruthy();
  });
});
