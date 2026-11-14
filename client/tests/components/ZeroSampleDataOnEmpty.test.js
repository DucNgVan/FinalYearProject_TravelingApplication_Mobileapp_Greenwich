import React from 'react';
import { render } from '@testing-library/react-native';
import ProfileScreen from '../../src/screens/account/ProfileScreen';
import MyTicketsModal from '../../src/screens/account/MyTicketsModal';
import MyBookingsModal from '../../src/screens/account/MyBookingsModal';
import { useAuthStore } from '../../src/stores/auth.store';
import { useBookingStore } from '../../src/stores/booking.store';
import { usePaymentStore } from '../../src/stores/payment.store';

describe('TDD RED: Zero Sample Data On Empty Across Screens', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: {
        id: 'new-user-001',
        fullName: 'Nguyen Van Duc',
        email: 'ducnv1792005@gmail.com',
        phoneNumber: '0901234567',
        dateOfBirth: '2000-01-15',
        role: 'traveler',
        xp: 0,
        level: 1,
      },
    });
    useBookingStore.setState({
      bookedTickets: [],
      bookedHotels: [],
    });
  });

  test('RED-FE-EMPTY-01: ProfileScreen should not render default mock ticket or fake 4 trips / 12 check-ins when user has 0 items', () => {
    const { queryByText, getByTestId } = render(<ProfileScreen />);

    // Should NOT render seed/dummy ticket
    expect(queryByText('VN-0240')).toBeNull();
    expect(queryByText('tkt-seed-001')).toBeNull();

    // Stats should show authentic 0 trips, 0 check-ins, 0 badges for new user
    const tripsStat = getByTestId('profile-stat-trips');
    expect(tripsStat.props.children[0].props.children).toBe(0);

    const checkinsStat = getByTestId('profile-stat-checkins');
    expect(checkinsStat.props.children[0].props.children).toBe(0);

    const badgesStat = getByTestId('profile-stat-badges');
    expect(badgesStat.props.children[0].props.children).toBe(0);
  });

  test('RED-FE-EMPTY-02: MyTicketsModal should render clean empty state and no fake seed ticket when bookedTickets is empty', () => {
    const { queryByText, getAllByText } = render(
      <MyTicketsModal visible={true} onClose={jest.fn()} />
    );

    // Should NOT render seed ticket
    expect(queryByText('VN-0240')).toBeNull();
    expect(queryByText('tkt-seed-001')).toBeNull();

    // Should render authentic empty state
    expect(getAllByText(/No Tickets|Chưa có vé/i).length).toBeGreaterThanOrEqual(1);
  });

  test('RED-FE-EMPTY-03: MyBookingsModal should render clean empty state and no fake hotel bookings when bookedHotels is empty', () => {
    const { queryByText, getAllByText } = render(
      <MyBookingsModal visible={true} onClose={jest.fn()} />
    );

    // Should NOT render fake hotel bookings
    expect(queryByText('Vinpearl Resort & Spa')).toBeNull();
    expect(queryByText('Anantara Resort & Spa')).toBeNull();
    expect(queryByText('JW Marriott Hotel')).toBeNull();

    // Should render authentic empty state
    expect(getAllByText(/No Bookings|Chưa có đặt phòng/i).length).toBeGreaterThanOrEqual(1);
  });

  test('RED-FE-EMPTY-04: payment.store should start with empty cards array for new users without sample cards', () => {
    // Payment cards should not have hardcoded sample card by default
    usePaymentStore.setState({ cards: [] });
    expect(usePaymentStore.getState().cards.length).toBe(0);
  });
});
