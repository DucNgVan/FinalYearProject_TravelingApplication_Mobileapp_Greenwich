import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ProfileScreen from '../../src/screens/account/ProfileScreen';
import PaymentCardsModal from '../../src/screens/account/PaymentCardsModal';
import MyTicketsModal from '../../src/screens/account/MyTicketsModal';
import MyBookingsModal from '../../src/screens/account/MyBookingsModal';
import PlanScreen from '../../src/screens/plan/PlanScreen';
import { useBookingStore } from '../../src/stores/booking.store';
import { usePaymentStore } from '../../src/stores/payment.store';
import { useItineraryStore } from '../../src/stores/itinerary.store';
import { useThemeStore } from '../../src/stores/theme.store';

describe('TDD RED: Profile Zero Mock Data, Modals English Localization, and Plan Hub Default View', () => {
  beforeEach(() => {
    useThemeStore.getState().setThemeMode('light');
    useBookingStore.setState({ bookedTickets: [], bookedHotels: [] });
    usePaymentStore.setState({ cards: [], selectedCardId: null });
    useItineraryStore.setState({
      trips: [],
      currentTrip: null,
    });
  });

  test('RED-PROFILE-REAL-DATA-01: ProfileScreen displays clean zero state without fake tickets, hotels or cards', () => {
    const { queryByText, getByText } = render(<ProfileScreen />);

    // Must NOT have fake mock data
    expect(queryByText('1 active')).toBeNull();
    expect(queryByText(/SGN → HAN/i)).toBeNull();
    expect(queryByText(/Vinpearl Resort/i)).toBeNull();
    expect(queryByText(/Visa •••• 4821/i)).toBeNull();

    // Must display honest empty subtitles
    expect(getByText(/No active flight tickets/i)).toBeTruthy();
    expect(getByText(/No active hotel bookings/i)).toBeTruthy();
    expect(getByText(/No saved cards/i)).toBeTruthy();
  });

  test('RED-MODALS-ENGLISH-01: PaymentCardsModal, MyTicketsModal, and MyBookingsModal are 100% in English without Vietnamese', () => {
    // 1. PaymentCardsModal
    const { queryByText: queryCardText, getByText: getCardText } = render(
      <PaymentCardsModal visible={true} onClose={jest.fn()} />
    );
    expect(queryCardText('Chưa có thẻ thanh toán')).toBeNull();
    expect(queryCardText(/Bạn chưa lưu thẻ thanh toán nào/i)).toBeNull();
    expect(getCardText('No Saved Cards')).toBeTruthy();

    // 2. MyTicketsModal
    const { queryByText: queryTicketText, getByText: getTicketText } = render(
      <MyTicketsModal visible={true} onClose={jest.fn()} />
    );
    expect(queryTicketText('Chưa có vé máy bay nào')).toBeNull();
    expect(queryTicketText(/Bạn chưa có vé máy bay nào đã đặt/i)).toBeNull();
    expect(getTicketText('No Active Flight Tickets')).toBeTruthy();

    // 3. MyBookingsModal
    const { queryByText: queryBookingText, getByText: getBookingText } = render(
      <MyBookingsModal visible={true} onClose={jest.fn()} />
    );
    expect(queryBookingText('Chưa có đặt phòng nào')).toBeNull();
    expect(queryBookingText(/Bạn chưa có đặt phòng khách sạn nào/i)).toBeNull();
    expect(getBookingText('No Hotel Bookings')).toBeTruthy();
  });

  test('RED-PLAN-HUB-DEFAULT-01: PlanScreen opens to Main Travel Plan Hub by default instead of forcing Trip Details', () => {
    const sampleTrip = {
      id: 'trip-hanoi-nx26',
      title: 'Hà Nội Expedition',
      destinationCity: 'Hà Nội',
      country: 'Việt Nam',
      daysCount: 3,
      days: [
        {
          dayIndex: 1,
          date: 'Day 1',
          items: [{ id: 's1', name: 'Hoan Kiem Lake' }],
        },
      ],
      collaborators: [{ userId: 'u1', role: 'OWNER' }],
    };

    useItineraryStore.setState({
      trips: [sampleTrip],
      currentTrip: null,
    });

    const { getByTestId, queryByTestId, getByText } = render(<PlanScreen />);

    // 1. Must be on Main Plan Hub showing saved trips list
    expect(getByTestId('saved-trips-list')).toBeTruthy();
    expect(getByText(/My Saved Trips \(1\)/i)).toBeTruthy();
    expect(getByText(/Hà Nội Expedition/i)).toBeTruthy();

    // 2. Must NOT be stuck in sub-tab details
    expect(queryByTestId('plan-subtab-capsule')).toBeNull();

    // 3. Tapping the trip card navigates into Details
    fireEvent.press(getByTestId('trip-hero-card-trip-hanoi-nx26'));
    expect(getByTestId('plan-subtab-capsule')).toBeTruthy();
    expect(getByText('Hoan Kiem Lake')).toBeTruthy();

    // 4. Pressing back button returns to Main Plan Hub
    const backBtn = getByTestId('trip-detail-back-btn');
    expect(backBtn).toBeTruthy();
    fireEvent.press(backBtn);
    expect(getByTestId('saved-trips-list')).toBeTruthy();
  });
});
