import React from 'react';
import { StyleSheet } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import ProfileScreen from '../../src/screens/account/ProfileScreen';
import { useAuthStore } from '../../src/stores/auth.store';
import { useBookingStore } from '../../src/stores/booking.store';
import { usePaymentStore } from '../../src/stores/payment.store';
import { useThemeStore } from '../../src/stores/theme.store';

jest.mock('../../src/stores/auth.store');

describe('Component Test: ProfileScreen (Account & Travel Stats)', () => {
  const mockUser = {
    id: 'u-1',
    fullName: 'Nguyễn Văn Đức',
    email: 'traveler@nomadix.vn',
  };

  const mockLogout = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.mockReturnValue({
      user: mockUser,
      logout: mockLogout,
    });
    useBookingStore.setState({
      bookedTickets: [
        {
          id: 'tkt-001',
          pnr: 'VN-8X2K9P',
          airlineCode: 'VN',
          airlineName: 'Vietnam Airlines',
          flightNumber: 'VN-0240',
          origin: 'SGN',
          originCity: 'Ho Chi Minh',
          destination: 'HAN',
          destinationCity: 'Ha Noi',
          departureTime: '2026-11-14T08:00:00Z',
          arrivalTime: '2026-11-14T10:10:00Z',
          totalPrice: 2073060,
          seat: '14A',
          gate: 'G03',
          classType: 'Economy Classic',
        },
      ],
    });
    usePaymentStore.setState({
      cards: [
        {
          id: 'c-1',
          cardNumber: '•••• •••• •••• 4821',
          brand: 'VISA',
          cardHolder: 'GUEST TRAVELER',
          expiryDate: '12/28',
          cardType: 'Visa · Credit',
        },
      ],
    });
  });

  test('RED-FE-ACC-01: renders user avatar, name, email and level XP badge', () => {
    const { getByText } = render(<ProfileScreen />);

    expect(getByText('Nguyễn Văn Đức')).toBeTruthy();
    expect(getByText('traveler@nomadix.vn')).toBeTruthy();
    expect(getByText(/Phượt thủ Cấp độ 5 • 1\.450 XP|Explorer Level 5 • 1,450 XP/i)).toBeTruthy();
  });

  test('RED-FE-ACC-02: renders travel stats and action items', () => {
    const { getByText, getAllByText } = render(<ProfileScreen />);

    // Stats
    expect(getByText(/Chuyến đi|Trips/i)).toBeTruthy();
    expect(getByText(/Địa danh check-in|Check-ins/i)).toBeTruthy();
    expect(getByText(/Huy hiệu|Badges/i)).toBeTruthy();

    // Action items
    expect(getAllByText(/Payment Methods|Payment Cards/i).length).toBeGreaterThan(0);
    expect(getAllByText(/Account Settings/i).length).toBeGreaterThan(0);
    expect(getAllByText(/Preferences & Settings|Settings/i).length).toBeGreaterThan(0);
  });

  test('RED-FE-ACC-03: clicking logout button triggers authStore logout', () => {
    const { getByText } = render(<ProfileScreen />);

    const logoutBtn = getByText(/Đăng xuất tài khoản|Log Out/i);
    fireEvent.press(logoutBtn);

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  test('RED-FE-PRF-01: renders "My Tickets" section and displays default ticket card with PNR in modal', () => {
    const { getByText, getByTestId } = render(<ProfileScreen />);

    expect(getByText(/My Tickets/i)).toBeTruthy();
    fireEvent.press(getByTestId('profile-menu-tickets'));
    expect(getByText('VN-8X2K9P')).toBeTruthy();
  });

  test('opens boarding pass modal when ticket card is pressed and closes it', () => {
    const { getByText, getAllByText, getByTestId } = render(<ProfileScreen />);
    fireEvent.press(getByTestId('profile-menu-tickets'));
    expect(getByText('VN-8X2K9P')).toBeTruthy();
    fireEvent.press(getByTestId('btn-view-boarding-pass'));
    expect(getAllByText(/ELECTRONIC BOARDING PASS|BOARDING PASS/i).length).toBeGreaterThan(0);

    // Close boarding pass
    fireEvent.press(getAllByText('✕')[0]);
  });

  test('toggles theme when theme row is tapped', () => {
    const { getByTestId } = render(<ProfileScreen />);
    const themeRow = getByTestId('theme-toggle-row');
    fireEvent.press(themeRow);
  });

  test('renders user booked tickets from booking store when present', () => {
    useBookingStore.setState({
      bookedTickets: [
        {
          id: 'tkt-custom-01',
          pnr: 'VN-CUSTOM1',
          airlineCode: 'VN',
          airlineName: 'Vietnam Airlines',
          flightNumber: 'VN-1111',
          origin: 'SGN',
          destination: 'HAN',
          departureTime: '2026-10-15T08:00:00Z',
          arrivalTime: '2026-10-15T10:10:00Z',
          totalPrice: 1500000,
        },
        {
          id: 'tkt-custom-02',
          pnr: 'VJ-CUSTOM2',
          airlineCode: 'VJ',
          airlineName: 'VietJet Air',
          flightNumber: 'VJ-2222',
          origin: 'HAN',
          destination: 'DAD',
          departureTime: '2026-10-16T08:00:00Z',
          arrivalTime: '2026-10-16T09:20:00Z',
          totalPrice: 1200000,
        },
      ],
    });

    const { getByText, getByTestId } = render(<ProfileScreen />);
    fireEvent.press(getByTestId('profile-menu-tickets'));
    expect(getByText('VN-CUSTOM1')).toBeTruthy();
  });

  test('RED-FE-TH-04: ProfileScreen personal card renders dark background (#1C1D21) in Dark Mode', () => {
    useThemeStore.getState().setThemeMode('dark');
    const { getByTestId } = render(<ProfileScreen />);
    const userCard = getByTestId('profile-user-card');
    const flatStyle = StyleSheet.flatten(userCard.props.style);
    expect(flatStyle.backgroundColor).toBe('#1C1D21');

    useThemeStore.getState().setThemeMode('light');
  });

  test('RED-FE-PAY-01: ProfileScreen renders Payment Cards row and opens modal when pressed', () => {
    const { getByTestId, getByText } = render(<ProfileScreen />);
    const paymentRow = getByTestId('profile-payment-cards-row');
    expect(paymentRow).toBeTruthy();

    fireEvent.press(paymentRow);
    expect(getByText('Payment Cards')).toBeTruthy();
    expect(getByText('VISA')).toBeTruthy();
  });
});
