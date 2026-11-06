import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import HotelSearchScreen from '../../src/screens/booking/HotelSearchScreen';
import { useBookingStore } from '../../src/stores/booking.store';

jest.mock('../../src/stores/booking.store');

describe('Component Test: HotelSearchScreen', () => {
  const mockSearchHotels = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useBookingStore.mockReturnValue({
      hotels: [],
      isLoadingHotels: false,
      hotelError: null,
      searchHotels: mockSearchHotels,
    });
  });

  test('RED-FE-BK-14: HotelSearchScreen should render destination city, check-in, check-out inputs, and search button', () => {
    const { getByPlaceholderText, getByText } = render(<HotelSearchScreen />);

    expect(getByPlaceholderText(/thành phố|điểm đến|destination|city/i)).toBeTruthy();
    expect(getByPlaceholderText(/ngày nhận phòng|check-in/i)).toBeTruthy();
    expect(getByPlaceholderText(/ngày trả phòng|check-out/i)).toBeTruthy();
    expect(getByText(/tìm khách sạn|search hotels/i)).toBeTruthy();
  });

  test('RED-FE-BK-15: HotelSearchScreen should show validation error when check-out is before or equal to check-in', async () => {
    const { getByPlaceholderText, getByText, findByText } = render(<HotelSearchScreen />);

    fireEvent.changeText(getByPlaceholderText(/thành phố|điểm đến|destination|city/i), 'Da Nang');
    fireEvent.changeText(getByPlaceholderText(/ngày nhận phòng|check-in/i), '2026-10-20');
    fireEvent.changeText(getByPlaceholderText(/ngày trả phòng|check-out/i), '2026-10-19');

    fireEvent.press(getByText(/tìm khách sạn|search hotels/i));

    const errorMessage = await findByText(/ngày trả phòng phải sau ngày nhận phòng|check-out must be after check-in/i);
    expect(errorMessage).toBeTruthy();
    expect(mockSearchHotels).not.toHaveBeenCalled();
  });

  test('RED-FE-BK-16: HotelSearchScreen should dispatch search query and display list of HotelCards', async () => {
    const mockHotelOptions = [
      {
        id: 'hotel-vp-01',
        name: 'Vinpearl Luxury Landmark 81',
        city: 'Ho Chi Minh City',
        address: '720A Dien Bien Phu, Binh Thanh',
        starRating: 5,
        reviewScore: 9.4,
        pricePerNight: 3500000,
        currency: 'VND',
        nights: 2,
        totalPrice: 7000000,
      },
    ];

    useBookingStore.mockReturnValue({
      hotels: mockHotelOptions,
      isLoadingHotels: false,
      hotelError: null,
      searchHotels: mockSearchHotels,
    });

    const { getByPlaceholderText, getByText } = render(<HotelSearchScreen />);

    fireEvent.changeText(getByPlaceholderText(/thành phố|điểm đến|destination|city/i), 'Ho Chi Minh City');
    fireEvent.changeText(getByPlaceholderText(/ngày nhận phòng|check-in/i), '2026-10-20');
    fireEvent.changeText(getByPlaceholderText(/ngày trả phòng|check-out/i), '2026-10-22');

    fireEvent.press(getByText(/tìm khách sạn|search hotels/i));

    await waitFor(() => {
      expect(mockSearchHotels).toHaveBeenCalledWith(
        expect.objectContaining({
          destination: 'Ho Chi Minh City',
          checkIn: '2026-10-20',
          checkOut: '2026-10-22',
        })
      );
    });

    expect(getByText(/Vinpearl Luxury Landmark 81/i)).toBeTruthy();
  });

  test('should show validation error when required fields are missing', async () => {
    const { getByText, findByText } = render(<HotelSearchScreen />);
    fireEvent.press(getByText(/tìm khách sạn|search hotels/i));

    const err = await findByText(/vui lòng nhập đầy đủ|please enter all required fields/i);
    expect(err).toBeTruthy();
    expect(mockSearchHotels).not.toHaveBeenCalled();
  });

  test('should show validation error when date format is invalid', async () => {
    const { getByPlaceholderText, getByText, findByText } = render(<HotelSearchScreen />);

    fireEvent.changeText(getByPlaceholderText(/thành phố|điểm đến|destination|city/i), 'Phu Quoc');
    fireEvent.changeText(getByPlaceholderText(/ngày nhận phòng|check-in/i), 'not-a-date');
    fireEvent.changeText(getByPlaceholderText(/ngày trả phòng|check-out/i), 'also-not-a-date');

    fireEvent.press(getByText(/tìm khách sạn|search hotels/i));

    const err = await findByText(/định dạng ngày không hợp lệ|invalid date format/i);
    expect(err).toBeTruthy();
    expect(mockSearchHotels).not.toHaveBeenCalled();
  });

  test('should display hotelError from store and handle hotel selection navigation', () => {
    const mockSelectHotel = jest.fn();
    const mockNavigation = { navigate: jest.fn() };
    const mockHotelOptions = [
      {
        id: 'hotel-vp-01',
        name: 'Vinpearl Luxury Landmark 81',
        city: 'Ho Chi Minh City',
        address: '720A Dien Bien Phu, Binh Thanh',
        starRating: 5,
        pricePerNight: 3500000,
      },
    ];

    useBookingStore.mockReturnValue({
      hotels: mockHotelOptions,
      isLoadingHotels: false,
      hotelError: 'Hotel search failed',
      searchHotels: mockSearchHotels,
      selectHotel: mockSelectHotel,
    });

    const { getByText, getByTestId } = render(
      <HotelSearchScreen navigation={mockNavigation} />
    );

    expect(getByText('Hotel search failed')).toBeTruthy();

    fireEvent.press(getByTestId('hotel-card-hotel-vp-01'));
    expect(mockSelectHotel).toHaveBeenCalledWith(mockHotelOptions[0]);
    expect(mockNavigation.navigate).toHaveBeenCalledWith('HotelDetails', { hotelId: 'hotel-vp-01' });
  });
});
