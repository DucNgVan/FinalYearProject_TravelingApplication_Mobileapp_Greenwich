import React from 'react';
import { StyleSheet } from 'react-native';
import { render } from '@testing-library/react-native';
import PlanScreen from '../../src/screens/plan/PlanScreen';
import BoardingPassModal from '../../src/components/booking/BoardingPassModal';
import ProfileScreen from '../../src/screens/account/ProfileScreen';
import HotelSearchScreen from '../../src/screens/booking/HotelSearchScreen';
import App from '../../App';
import { useAuthStore } from '../../src/stores/auth.store';
import { useItineraryStore } from '../../src/stores/itinerary.store';
import { useBookingStore } from '../../src/stores/booking.store';

jest.mock('../../src/stores/auth.store');
jest.mock('../../src/stores/booking.store');

describe('UI Refinements & Dock Alignment (TDD RED)', () => {
  const mockTicket = {
    id: 'tkt-001',
    pnr: 'VN-9X8K7L',
    ticketNumber: '738-1234567890',
    airlineName: 'Vietnam Airlines',
    flightNumber: 'VN-0240',
    origin: 'SGN',
    destination: 'HAN',
    status: 'CONFIRMED',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.mockReturnValue({
      user: { id: 'u-1', fullName: 'John Doe', email: 'traveler@nomadix.vn' },
      isAuthenticated: true,
      isGuest: false,
      logout: jest.fn(),
    });
    useBookingStore.mockReturnValue({
      flights: [],
      hotels: [],
      isLoadingFlights: false,
      isLoadingHotels: false,
      flightError: null,
      hotelError: null,
      searchFlights: jest.fn(),
      searchHotels: jest.fn(),
      bookedTickets: [mockTicket],
    });
    useItineraryStore.setState({
      currentTrip: {
        id: 'trip-1',
        title: 'Danang Vacation 2026',
        destinationCity: 'Da Nang',
        startDate: '2026-11-14',
        endDate: '2026-11-17',
        collaborators: [{ userId: 'u-1', name: 'John Doe', role: 'OWNER' }],
        days: [{ dayNumber: 1, items: [] }],
      },
      trips: [],
    });
  });

  test('RED-UI-01: PlanScreen header eyebrow uses textMuted color and standardized margin matching Hotel & Flight screens', () => {
    const { getByText } = render(<PlanScreen />);
    const eyebrow = getByText('Squad trip');
    const flatStyle = StyleSheet.flatten(eyebrow.props.style);

    // Eyebrow margin should be 8px matching Hotels and Flights
    expect(flatStyle.marginBottom).toBe(8);
  });

  test('RED-UI-02: BoardingPassModal renders pure English "Need support?" without parentheses or Vietnamese text', () => {
    const { getByText, queryByText } = render(
      <BoardingPassModal visible={true} ticket={mockTicket} onClose={jest.fn()} />
    );

    expect(getByText('Need support?')).toBeTruthy();
    expect(queryByText(/Bạn cần hỗ trợ/i)).toBeNull();
    expect(queryByText(/Đổi vé/i)).toBeNull();
  });

  test('RED-UI-03: ProfileScreen renders "Ticket Support & Refunds" without parentheses and removes "1 ticket saved" badge', () => {
    const { getByText, queryByText } = render(<ProfileScreen />);

    expect(getByText('Ticket Support & Refunds')).toBeTruthy();
    expect(queryByText(/Hỗ trợ & Đổi\/Hoàn vé/i)).toBeNull();
    expect(queryByText(/ticket.*saved/i)).toBeNull();
  });

  test('RED-UI-04: HotelSearchScreen renders STAY_VIBES tags cleanly without emojis', () => {
    const { getByText, queryByText } = render(<HotelSearchScreen />);

    expect(getByText('Beachfront')).toBeTruthy();
    expect(getByText('Mountain Escape')).toBeTruthy();
    expect(getByText('5-Star Luxury')).toBeTruthy();

    expect(queryByText(/🏝️|🏔️|💎/)).toBeNull();
  });

  test('RED-UI-05: App.js dock evenly distributes 5 columns (wrapping Home in flex:1) and increases tab label spacing', () => {
    const { getByTestId } = render(<App />);
    const flightsLabel = getByTestId('tab-label-flights');
    const flatLabelStyle = StyleSheet.flatten(flightsLabel.props.style);

    expect(flatLabelStyle.marginTop).toBeGreaterThanOrEqual(4);

    const homeTabCol = getByTestId('tab-col-home');
    const flatColStyle = StyleSheet.flatten(homeTabCol.props.style);
    expect(flatColStyle.flex).toBe(1);
    expect(flatColStyle.alignItems).toBe('center');
  });
});
