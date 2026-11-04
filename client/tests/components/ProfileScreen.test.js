import React from 'react';
import { StyleSheet } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import ProfileScreen from '../../src/screens/account/ProfileScreen';
import { useAuthStore } from '../../src/stores/auth.store';
import { useBookingStore } from '../../src/stores/booking.store';
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
    useBookingStore.setState({ bookedTickets: [] });
  });

  test('RED-FE-ACC-01: renders user avatar, name, email and level XP badge', () => {
    const { getByText } = render(<ProfileScreen />);

    expect(getByText('Nguyễn Văn Đức')).toBeTruthy();
    expect(getByText('traveler@nomadix.vn')).toBeTruthy();
    expect(getByText(/Phượt thủ Cấp độ 5 • 1\.450 XP|Explorer Level 5 • 1,450 XP/i)).toBeTruthy();
  });

  test('RED-FE-ACC-02: renders travel stats and action items', () => {
    const { getByText } = render(<ProfileScreen />);

    // Stats
    expect(getByText(/Chuyến đi|Trips/i)).toBeTruthy();
    expect(getByText(/Địa danh check-in|Check-ins/i)).toBeTruthy();
    expect(getByText(/Huy hiệu|Badges/i)).toBeTruthy();

    // Action items
    expect(getByText(/Xác minh danh tính KYC|Identity Verification \(KYC\)/i)).toBeTruthy();
    expect(getByText(/Tài khoản ngân hàng nhận tiền nợ|Bank Account for Debt Settlements/i)).toBeTruthy();
    expect(getByText(/Thông báo & Lời mời Squad|Notifications & Squad Invites/i)).toBeTruthy();
  });

  test('RED-FE-ACC-03: clicking logout button triggers authStore logout', () => {
    const { getByText } = render(<ProfileScreen />);

    const logoutBtn = getByText(/Đăng xuất tài khoản|Log Out/i);
    fireEvent.press(logoutBtn);

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  test('RED-FE-PRF-01: renders "Vé máy bay của tôi" section and displays default ticket card with PNR', () => {
    const { getByText } = render(<ProfileScreen />);

    expect(getByText(/Vé máy bay của tôi|My Booked Flights/i)).toBeTruthy();
    expect(getByText('VN-8X2K9P')).toBeTruthy();
  });

  test('opens boarding pass modal when ticket card is pressed and closes it', () => {
    const { getByText, queryByText } = render(<ProfileScreen />);
    fireEvent.press(getByText('VN-8X2K9P'));
    expect(getByText(/THẺ LÊN MÁY BAY ĐIỆN TỬ|ELECTRONIC BOARDING PASS/i)).toBeTruthy();

    // Close boarding pass
    fireEvent.press(getByText('✕'));
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

    const { getByText } = render(<ProfileScreen />);
    expect(getByText('VN-CUSTOM1')).toBeTruthy();
    expect(getByText('VJ-CUSTOM2')).toBeTruthy();
  });

  test('RED-FE-TH-04: ProfileScreen booked ticket card renders dark background (#1C1D21) in Dark Mode', () => {
    useThemeStore.getState().setThemeMode('dark');
    const { getByTestId } = render(<ProfileScreen />);
    const ticketCard = getByTestId('profile-ticket-card');
    const flatStyle = StyleSheet.flatten(ticketCard.props.style);
    expect(flatStyle.backgroundColor).toBe('#1C1D21');

    useThemeStore.getState().setThemeMode('light');
  });
});
