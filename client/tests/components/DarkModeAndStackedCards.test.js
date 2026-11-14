import React from 'react';
import { StyleSheet } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import ProfileScreen from '../../src/screens/account/ProfileScreen';
import MyTicketsModal from '../../src/screens/account/MyTicketsModal';
import MyBookingsModal from '../../src/screens/account/MyBookingsModal';
import PaymentCardsModal from '../../src/screens/account/PaymentCardsModal';
import { useAuthStore } from '../../src/stores/auth.store';
import { useThemeStore } from '../../src/stores/theme.store';
import { useBookingStore } from '../../src/stores/booking.store';

describe('TDD RED Phase: Dark Mode Contrast, Back Button Fix, and Physical Stacked Cards', () => {
  beforeEach(() => {
    useThemeStore.getState().setThemeMode('dark');
    useAuthStore.setState({
      user: { fullName: 'Guest Traveler', email: 'guest@nomadix.app', role: 'Viewer' },
      isAuthenticated: true,
      isGuest: false,
    });
    useBookingStore.setState({ bookedTickets: [], bookedHotels: [] });
  });

  afterEach(() => {
    useThemeStore.getState().setThemeMode('light');
  });

  test('RED-DARK-BACK-01: In Dark Mode, MyTicketsModal and MyBookingsModal back buttons must NOT have white background', () => {
    const { getByTestId: getTicketId } = render(
      <MyTicketsModal visible={true} onClose={() => {}} />
    );
    const ticketBackBtn = getTicketId('btn-close-my-tickets');
    const ticketBackStyle = StyleSheet.flatten(ticketBackBtn.props.style);
    // Must NOT be hardcoded #FFFFFF in Dark Mode
    expect(ticketBackStyle.backgroundColor).not.toBe('#FFFFFF');
    expect(ticketBackStyle.backgroundColor).toBe('#1C1D21');

    const { getByTestId: getBookingId } = render(
      <MyBookingsModal visible={true} onClose={() => {}} />
    );
    const bookingBackBtn = getBookingId('btn-close-my-bookings');
    const bookingBackStyle = StyleSheet.flatten(bookingBackBtn.props.style);
    expect(bookingBackStyle.backgroundColor).not.toBe('#FFFFFF');
    expect(bookingBackStyle.backgroundColor).toBe('#1C1D21');
  });

  test('RED-DARK-PAY-02: PaymentCardsModal supports Dark Mode with dark background and correct contrast', () => {
    const { getByTestId } = render(
      <PaymentCardsModal visible={true} onClose={() => {}} />
    );

    const backBtn = getByTestId('btn-back-cards');
    const backStyle = StyleSheet.flatten(backBtn.props.style);
    expect(backStyle.backgroundColor).not.toBe('#FFFFFF');
    expect(backStyle.backgroundColor).toBe('#1C1D21');
  });

  test('RED-HERO-03: ProfileScreen hero card renders high-fidelity Level and Stats layout', () => {
    const { getByTestId, getByText } = render(<ProfileScreen />);

    expect(getByTestId('profile-level-badge')).toBeTruthy();
    expect(getByText('Explorer Level 5')).toBeTruthy();
    expect(getByText('1,450 XP')).toBeTruthy();
    expect(getByTestId('profile-hero-progress-fill')).toBeTruthy();
  });

  test('RED-STACK-04: MyTicketsModal and MyBookingsModal render clean card structures (without faux stacked back cards)', () => {
    useBookingStore.setState({
      bookedTickets: [{ id: 'tkt-01', pnr: 'VN-123', flightNumber: 'VN-01', origin: 'HAN', destination: 'SGN', totalPrice: 1000000 }],
      bookedHotels: [{ id: 'stay-01', hotelName: 'Vinpearl Resort', city: 'Da Nang', checkIn: '14 Nov', checkOut: '17 Nov', nights: 3, totalPrice: 3000000, status: 'Confirmed' }],
    });
    const { getByTestId: getTicketId, queryByTestId: queryTicketId } = render(
      <MyTicketsModal visible={true} onClose={() => {}} />
    );
    expect(getTicketId('ticket-stack-wrapper')).toBeTruthy();
    expect(queryTicketId('ticket-stack-back-card')).toBeNull();
    expect(getTicketId('ticket-stack-front-card')).toBeTruthy();

    const { getByTestId: getBookingId, queryByTestId: queryBookingId } = render(
      <MyBookingsModal visible={true} onClose={() => {}} />
    );
    expect(getBookingId('booking-stack-wrapper')).toBeTruthy();
    expect(queryBookingId('booking-stack-back-card')).toBeNull();
    expect(getBookingId('booking-stack-front-card')).toBeTruthy();
  });
});
