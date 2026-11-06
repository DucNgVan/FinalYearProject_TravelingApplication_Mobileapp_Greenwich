import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { useBookingStore } from '../../src/stores/booking.store';
import HotelBookingModal from '../../src/components/booking/HotelBookingModal';

describe('Component & Store Test: Hotel Duffel Booking & Modal (RED Phase)', () => {
  const mockHotel = {
    id: 'acc_da_nang_01',
    provider: 'DUFFEL_STAYS',
    name: 'Novotel Danang Premier Han River',
    city: 'Da Nang',
    address: '36 Bach Dang Street, Da Nang',
    starRating: 4,
    reviewScore: 9.2,
    pricePerNight: 1750000,
    currency: 'VND',
    thumbnailUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600',
  };

  test('RED-HOTEL-BOOK-01: bookHotelSandbox stores confirmed hotel stay in store state', () => {
    const store = useBookingStore.getState();
    expect(typeof store.bookHotelSandbox).toBe('function');

    const result = store.bookHotelSandbox(
      mockHotel,
      { fullName: 'Alex Rivers', email: 'alex@example.com' },
      '2026-11-14',
      '2026-11-17',
      1
    );

    expect(result.success).toBe(true);
    expect(result.voucherNumber).toMatch(/^HTL-/);
    expect(result.stay.hotelName).toBe('Novotel Danang Premier Han River');
    expect(result.stay.status).toBe('CONFIRMED');

    const state = useBookingStore.getState();
    expect(state.bookedHotels).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          voucherNumber: result.voucherNumber,
        }),
      ])
    );
  });

  test('RED-HOTEL-MODAL-01: HotelBookingModal renders stay details and triggers onConfirm', () => {
    const handleClose = jest.fn();
    const handleConfirm = jest.fn();

    const { getByText, getByTestId } = render(
      <HotelBookingModal
        visible={true}
        hotel={mockHotel}
        checkIn="2026-11-14"
        checkOut="2026-11-17"
        guests={2}
        rooms={1}
        onClose={handleClose}
        onConfirm={handleConfirm}
      />
    );

    expect(getByText('Novotel Danang Premier Han River')).toBeTruthy();
    expect(getByText(/Duffel Stays Sandbox Booking/i)).toBeTruthy();

    const confirmBtn = getByTestId('confirm-hotel-booking-btn');
    fireEvent.press(confirmBtn);

    expect(handleConfirm).toHaveBeenCalledWith(
      expect.objectContaining({
        hotelId: 'acc_da_nang_01',
      })
    );
  });
});
