import React from 'react';
import { StyleSheet } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import GroupScreen from '../../src/screens/group/GroupScreen';
import TicketSupportModal from '../../src/components/booking/TicketSupportModal';
import SeatMapSelector from '../../src/components/booking/SeatMapSelector';
import HomeScreen from '../../src/screens/home/HomeScreen';
import LoginScreen from '../../src/screens/auth/LoginScreen';
import { useThemeStore } from '../../src/stores/theme.store';
import { useAuthStore } from '../../src/stores/auth.store';
import { useBookingStore } from '../../src/stores/booking.store';

describe('TDD RED Phase: Global UI/UX Full Harmonization (English, No Dividers, Obsidian Dark Theme)', () => {
  beforeEach(() => {
    useThemeStore.getState().setThemeMode('light');
    useAuthStore.setState({
      user: { fullName: 'Alex Rivera', email: 'alex@nomadix.app', role: 'Owner' },
      isAuthenticated: true,
      isGuest: false,
    });
    useBookingStore.setState({ bookedTickets: [], bookedHotels: [] });
  });

  afterEach(() => {
    useThemeStore.getState().setThemeMode('light');
  });

  test('RED-HARM-GLOBAL-01: GroupScreen is 100% in English, without bilingual parentheses, and has no divider lines', () => {
    const { getByText, queryByText, getByTestId, getAllByTestId } = render(<GroupScreen />);

    // Header & Actions
    expect(getByText(/Squad & Shared Ledger|Group & Expenses/i)).toBeTruthy();
    expect(getByText('+ Invite Friend')).toBeTruthy();

    // Section Labels in 100% English
    expect(getByText('SQUAD MEMBERS')).toBeTruthy();
    expect(getByText('TRIP BUDGET & EXPENSES')).toBeTruthy();
    expect(getByText('PACKING LIST')).toBeTruthy();

    // Financial Cards in clean English
    expect(getByText('Total Trip Spend')).toBeTruthy();
    expect(getByText('You Owe')).toBeTruthy();
    expect(getByText("You're Owed")).toBeTruthy();

    // No bilingual parentheses or Vietnamese text
    expect(queryByText(/Sổ Quỹ/i)).toBeNull();
    expect(queryByText(/Thành viên nhóm/i)).toBeNull();
    expect(queryByText(/Tổng chi tiêu/i)).toBeNull();
    expect(queryByText(/Bạn đang nợ/i)).toBeNull();
    expect(queryByText(/Đồ cần chuẩn bị/i)).toBeNull();

    // Zero divider lines on packing items
    const firstPackingRow = getByTestId('packing-item-0');
    const flatPackingStyle = StyleSheet.flatten(firstPackingRow.props.style);
    expect(flatPackingStyle.borderBottomWidth).toBeFalsy();
  });

  test('RED-HARM-GLOBAL-02: TicketSupportModal and SeatMapSelector are 100% in English without bilingual text', () => {
    const mockTicket = {
      id: 'tkt-001',
      pnr: 'VN-8X2K9P',
      flightNumber: 'VN-0240',
      origin: 'SGN',
      destination: 'HAN',
      airlineName: 'Vietnam Airlines',
      totalPrice: 2000000,
    };

    // TicketSupportModal
    const { getByText: getTicketText, queryByText: queryTicketText } = render(
      <TicketSupportModal visible={true} ticket={mockTicket} onClose={() => {}} />
    );
    expect(getTicketText('Ticket Support & Refunds')).toBeTruthy();
    expect(getTicketText('Cancel & Refund')).toBeTruthy();
    expect(getTicketText('Change Flight')).toBeTruthy();
    expect(getTicketText('Refund Quote')).toBeTruthy();
    expect(getTicketText('Confirm Cancellation & Refund')).toBeTruthy();
    expect(queryTicketText(/Trung tâm Hỗ trợ/i)).toBeNull();
    expect(queryTicketText(/Hủy vé & Hoàn tiền/i)).toBeNull();

    // SeatMapSelector
    const { getByText: getSeatText, queryByText: querySeatText } = render(
      <SeatMapSelector visible={true} flight={mockTicket} onClose={() => {}} onSelectSeat={() => {}} />
    );
    expect(getSeatText('Cabin Seat Map')).toBeTruthy();
    expect(querySeatText(/Sơ đồ ghế ngồi/i)).toBeNull();
  });

  test('RED-HARM-GLOBAL-03: HomeScreen in Dark Mode harmonizes with obsidian palette (#121316 background, #1C1D21 cards)', () => {
    useThemeStore.getState().setThemeMode('dark');

    const { getByTestId } = render(<HomeScreen onNavigateTab={() => {}} onOpenProfile={() => {}} />);

    const converterCard = getByTestId('currency-converter-widget');
    const flatCardStyle = StyleSheet.flatten(converterCard.props.style);
    expect(flatCardStyle.backgroundColor).toBe('#1C1D21');

    const radarCard = getByTestId('home-travel-radar-widget');
    const flatRadarStyle = StyleSheet.flatten(radarCard.props.style);
    expect(flatRadarStyle.backgroundColor).toBe('#1C1D21');
  });

  test('RED-HARM-GLOBAL-04: LoginScreen validation error messages are 100% in English without bilingual parentheses', () => {
    const { getByTestId, getByText, queryByText } = render(<LoginScreen navigation={{ navigate: () => {} }} />);

    const loginBtn = getByTestId('login-submit-button');
    fireEvent.press(loginBtn);

    expect(getByText(/Please enter a valid email/i)).toBeTruthy();
    expect(getByText('Please enter your password')).toBeTruthy();

    expect(queryByText(/Vui lòng nhập email hợp lệ/i)).toBeNull();
    expect(queryByText(/Vui lòng nhập mật khẩu/i)).toBeNull();
  });
});
