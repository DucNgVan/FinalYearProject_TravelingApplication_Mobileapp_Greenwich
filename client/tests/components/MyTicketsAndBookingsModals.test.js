import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import MyTicketsModal from '../../src/screens/account/MyTicketsModal';
import MyBookingsModal from '../../src/screens/account/MyBookingsModal';
import ProfileScreen from '../../src/screens/account/ProfileScreen';
import { useBookingStore } from '../../src/stores/booking.store';
import { useAuthStore } from '../../src/stores/auth.store';

describe('TDD RED Phase: MyTicketsModal, MyBookingsModal and Profile Screen Integration', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: { fullName: 'Guest Traveler', email: 'guest@nomadix.app' },
    });
    useBookingStore.setState({
      bookedTickets: [
        {
          id: 'tkt-001',
          pnr: 'VN-8X2K9P',
          ticketNumber: '738-2491048291',
          airlineCode: 'VN',
          airlineName: 'Vietnam Airlines',
          flightNumber: 'VN-0240',
          origin: 'SGN',
          originCity: 'Ho Chi Minh',
          destination: 'HAN',
          destinationCity: 'Ha Noi',
          status: 'CONFIRMED',
          totalPrice: 2073060,
        },
      ],
      bookedHotels: [
        {
          id: 'stay-001',
          hotelName: 'Vinpearl Resort & Spa',
          city: 'Da Nang Bay · Oceanfront',
          checkIn: '14 Nov',
          checkOut: '17 Nov',
          nights: 3,
          totalPrice: 5550000,
          status: 'Confirmed',
        },
        {
          id: 'stay-002',
          hotelName: 'Anantara Resort & Spa',
          city: 'Hoi An Ancient River',
          checkIn: '17 Nov',
          checkOut: '19 Nov',
          nights: 2,
          totalPrice: 4800000,
          status: 'Confirmed',
        },
      ],
    });
  });

  test('RED-TKT-01: MyTicketsModal renders ticket card, segments, and action buttons', () => {
    const { getByText, getByTestId } = render(
      <MyTicketsModal visible={true} onClose={() => {}} />
    );

    expect(getByText('My Tickets')).toBeTruthy();
    expect(getByTestId('ticket-segment-upcoming')).toBeTruthy();
    expect(getByTestId('ticket-segment-past')).toBeTruthy();
    expect(getByText('SGN')).toBeTruthy();
    expect(getByText('HAN')).toBeTruthy();
    expect(getByTestId('btn-view-boarding-pass')).toBeTruthy();
    expect(getByTestId('btn-download-ticket')).toBeTruthy();
    expect(getByTestId('btn-share-ticket')).toBeTruthy();
    expect(getByText('Change or refund ticket')).toBeTruthy();
  });

  test('RED-BKG-02: MyBookingsModal renders hotel bookings with Upcoming, Past, Cancelled tabs', () => {
    const { getByText, getByTestId } = render(
      <MyBookingsModal visible={true} onClose={() => {}} />
    );

    expect(getByText('My Bookings')).toBeTruthy();
    expect(getByTestId('booking-segment-upcoming')).toBeTruthy();
    expect(getByTestId('booking-segment-past')).toBeTruthy();
    expect(getByTestId('booking-segment-cancelled')).toBeTruthy();
    expect(getByText('Vinpearl Resort & Spa')).toBeTruthy();
    expect(getByText('Anantara Resort & Spa')).toBeTruthy();
  });

  test('RED-PRF-03: ProfileScreen opens MyTicketsModal, MyBookingsModal, and AccountSettingsModal', () => {
    const { getByTestId, getByText, getAllByText } = render(<ProfileScreen />);

    // Test opening My Tickets modal
    const ticketsBtn = getByTestId('profile-menu-tickets');
    fireEvent.press(ticketsBtn);
    expect(getAllByText('My Tickets').length).toBeGreaterThanOrEqual(2);

    // Test opening Account Settings modal from header avatar edit button
    const editProfileBtn = getByTestId('profile-edit-settings-btn');
    fireEvent.press(editProfileBtn);
    expect(getAllByText('Account Settings').length).toBeGreaterThanOrEqual(2);
  });
});
