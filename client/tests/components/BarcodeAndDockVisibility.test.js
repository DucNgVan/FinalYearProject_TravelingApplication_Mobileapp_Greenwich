import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import App from '../../App';
import MyTicketsModal from '../../src/screens/account/MyTicketsModal';
import MyBookingsModal from '../../src/screens/account/MyBookingsModal';
import { useAuthStore } from '../../src/stores/auth.store';
import { useThemeStore } from '../../src/stores/theme.store';

describe('TDD RED Phase: Stacked Cards for Tickets & Bookings, Barcode Fidelity & Bottom Dock Persistence', () => {
  beforeEach(() => {
    useThemeStore.getState().setThemeMode('light');
    useAuthStore.setState({
      user: { fullName: 'Guest Traveler', email: 'guest@nomadix.app' },
      isAuthenticated: true,
      isGuest: false,
    });
  });

  test('RED-BARCODE-01: MyTicketsModal renders realistic SVG barcode stripes instead of solid block', () => {
    const { getByTestId } = render(
      <MyTicketsModal visible={true} onClose={() => {}} />
    );

    const barcode = getByTestId('ticket-barcode-stripes');
    expect(barcode).toBeTruthy();
  });

  test('RED-STACK-02: MyTicketsModal renders clean card structure without faux stacked back cards', () => {
    const { getByTestId, queryByTestId } = render(
      <MyTicketsModal visible={true} onClose={() => {}} />
    );

    expect(getByTestId('ticket-stack-wrapper')).toBeTruthy();
    expect(queryByTestId('ticket-stack-back-card')).toBeNull();
    expect(getByTestId('ticket-stack-front-card')).toBeTruthy();
  });

  test('RED-STACK-03: MyBookingsModal renders clean card structure without faux stacked back cards', () => {
    const { getByTestId, queryByTestId } = render(
      <MyBookingsModal visible={true} onClose={() => {}} />
    );

    expect(getByTestId('booking-stack-wrapper')).toBeTruthy();
    expect(queryByTestId('booking-stack-back-card')).toBeNull();
    expect(getByTestId('booking-stack-front-card')).toBeTruthy();
  });

  test('RED-DOCK-04: Bottom navigation menu (app-bottom-tabbar) remains visible when viewing My Tickets, Bookings, and Cards', () => {
    const { getByTestId, getAllByText } = render(
      <App initialHasCompletedOnboarding={true} initialTab="profile" />
    );

    // Profile Screen is active, bottom bar must be visible
    expect(getByTestId('app-bottom-tabbar')).toBeTruthy();

    // Open My Tickets
    fireEvent.press(getByTestId('profile-menu-tickets'));
    expect(getAllByText('VN-0240').length).toBeGreaterThan(0);
    // Bottom dock must still be rendered and visible in DOM tree
    expect(getByTestId('app-bottom-tabbar')).toBeTruthy();

    // Close My Tickets
    fireEvent.press(getByTestId('btn-close-my-tickets'));

    // Open My Bookings
    fireEvent.press(getByTestId('profile-menu-bookings'));
    expect(getAllByText('Vinpearl Resort & Spa').length).toBeGreaterThan(0);
    expect(getByTestId('app-bottom-tabbar')).toBeTruthy();

    // Close My Bookings
    fireEvent.press(getByTestId('btn-close-my-bookings'));

    // Open Payment Cards
    fireEvent.press(getByTestId('profile-payment-cards-row'));
    expect(getAllByText('VISA').length).toBeGreaterThan(0);
    expect(getByTestId('app-bottom-tabbar')).toBeTruthy();
  });
});
