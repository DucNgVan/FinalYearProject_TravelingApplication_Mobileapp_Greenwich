import React from 'react';
import { render } from '@testing-library/react-native';
import HotelSearchScreen from '../../src/screens/booking/HotelSearchScreen';
import PlanScreen from '../../src/screens/plan/PlanScreen';
import ProfileScreen from '../../src/screens/account/ProfileScreen';
import HotelCard from '../../src/components/booking/HotelCard';
import { useAuthStore } from '../../src/stores/auth.store';
import { useItineraryStore } from '../../src/stores/itinerary.store';
import { useBookingStore } from '../../src/stores/booking.store';
import { useExpenseStore } from '../../src/stores/expense.store';

describe('Component Test: Full Application UI Harmonization with Nomadix HTML Spec', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: { id: 'u1', fullName: 'Nguyen Van Duc', email: 'duc@nomadix.app', role: 'Owner' },
      isAuthenticated: true,
      isGuest: false,
    });

    useItineraryStore.setState({
      currentTrip: {
        id: 'trip-1',
        title: 'Danang Vacation 2026',
        destinationCity: 'Da Nang',
        startDate: '2026-11-14',
        endDate: '2026-11-17',
        collaborators: [
          { userId: 'u1', name: 'Duc', role: 'OWNER' },
          { userId: 'u2', name: 'Linh', role: 'EDITOR' },
          { userId: 'u3', name: 'An', role: 'VIEWER' },
        ],
        days: [
          {
            dayNumber: 1,
            items: [{ id: 'it-1', title: 'Landing at Da Nang', time: '10:30 AM', note: 'Meet squad driver' }],
          },
        ],
      },
      trips: [],
      isLoading: false,
      error: null,
    });

    useBookingStore.setState({
      hotels: [
        {
          id: 'h1',
          name: 'Novotel Danang',
          city: 'DAD',
          pricePerNight: 1450000,
          starRating: 4,
          reviewScore: 4.8,
          nights: 3,
          address: '36 Bach Dang, Da Nang',
        },
      ],
      bookedTickets: [],
    });

    useExpenseStore.setState({
      expenses: [
        { id: 'exp-1', description: 'Seafood dinner', amount: 3600000, paidBy: 'Duc' },
      ],
      debtSummary: {
        totalExpense: 3600000,
        memberBalances: [
          { userId: 'u1', name: 'Duc', netBalance: 2400000 },
          { userId: 'u2', name: 'Linh', netBalance: -1200000 },
          { userId: 'u3', name: 'An', netBalance: -1200000 },
        ],
        settlements: [
          { from: 'Linh', to: 'Duc', amount: 1200000 },
          { from: 'An', to: 'Duc', amount: 1200000 },
        ],
      },
    });
  });

  test('RED-FE-HOTEL-UI-01: HotelSearchScreen adopts eyebrow "Where to stay", title "Hotels in Da Nang", and 22px card border radius', () => {
    const { getByText, getByTestId } = render(<HotelSearchScreen />);

    expect(getByText('Where to stay')).toBeTruthy();
    expect(getByText(/Hotels in Da Nang/i)).toBeTruthy();

    const hotelCard = getByTestId('hotel-card-h1');
    const flatStyle = Array.isArray(hotelCard.props.style)
      ? Object.assign({}, ...hotelCard.props.style)
      : hotelCard.props.style;

    expect(flatStyle.borderRadius).toBeGreaterThanOrEqual(22);
  });

  test('RED-FE-PLAN-UI-01: PlanScreen adopts eyebrow "Squad trip", trip title, and 16px segmented tab bar', () => {
    const { getByText, getByTestId } = render(<PlanScreen />);

    expect(getByText('Squad trip')).toBeTruthy();
    expect(getByText('Danang Vacation 2026')).toBeTruthy();

    const segControl = getByTestId('plan-subtabs-segmented');
    const flatStyle = Array.isArray(segControl.props.style)
      ? Object.assign({}, ...segControl.props.style)
      : segControl.props.style;

    expect(flatStyle.borderRadius).toBeGreaterThanOrEqual(16);
  });

  test('RED-FE-PROFILE-UI-01: ProfileScreen adopts eyebrow "Account", title "Profile", and role pill', () => {
    const { getByText } = render(<ProfileScreen />);

    expect(getByText('Account')).toBeTruthy();
    expect(getByText('Profile')).toBeTruthy();
    expect(getByText('Owner')).toBeTruthy();
    expect(getByText(/Dark mode/i)).toBeTruthy();
    expect(getByText(/Sign out|Log Out/i)).toBeTruthy();
  });
});
