import React from 'react';
import { StyleSheet } from 'react-native';
import { render, fireEvent, within } from '@testing-library/react-native';
import ProfileScreen from '../../src/screens/account/ProfileScreen';
import HomeScreen from '../../src/screens/home/HomeScreen';
import MyTicketsModal from '../../src/screens/account/MyTicketsModal';
import MyBookingsModal from '../../src/screens/account/MyBookingsModal';
import PaymentCardsModal from '../../src/screens/account/PaymentCardsModal';
import AccountSettingsModal from '../../src/screens/account/AccountSettingsModal';
import AppSettingsModal from '../../src/screens/account/AppSettingsModal';
import HelpSupportModal from '../../src/screens/account/HelpSupportModal';
import LegalPrivacyModal from '../../src/screens/account/LegalPrivacyModal';
import { useAuthStore } from '../../src/stores/auth.store';
import { useBookingStore } from '../../src/stores/booking.store';
import { useThemeStore } from '../../src/stores/theme.store';
import { useCurrencyStore } from '../../src/stores/currency.store';

jest.mock('../../src/stores/auth.store');

describe('Component Test: Profile Sub-Screens, Background Harmonization & Currency Picker', () => {
  const mockUser = {
    id: 'u-1',
    fullName: 'Nguyễn Văn Đức',
    email: 'traveler@nomadix.vn',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.mockReturnValue({
      user: mockUser,
      logout: jest.fn(),
      updateProfile: jest.fn(),
      changePassword: jest.fn(),
    });
    useBookingStore.setState({ bookedTickets: [], bookedHotels: [] });
    useThemeStore.getState().setThemeMode('light');
    useCurrencyStore.setState({
      rates: { USD: 1, VND: 25450, EUR: 0.92, JPY: 155.2 },
      base: 'USD',
      loading: false,
      error: null,
    });
  });

  describe('1. Background Color Harmonization (#F8FAFC in Light Mode, #121316 in Dark Mode)', () => {
    test('RED-PROF-BG-01: ProfileScreen root container uses #F8FAFC in light mode, #121316 in dark mode', () => {
      const { getByTestId, unmount } = render(<ProfileScreen />);
      const rootContainer = getByTestId('profile-root-container');
      const lightStyle = StyleSheet.flatten(rootContainer.props.style);
      expect(lightStyle.backgroundColor).toBe('#F8FAFC');
      unmount();

      useThemeStore.getState().setThemeMode('dark');
      const darkRender = render(<ProfileScreen />);
      const darkContainer = darkRender.getByTestId('profile-root-container');
      const darkStyle = StyleSheet.flatten(darkContainer.props.style);
      expect(darkStyle.backgroundColor).toBe('#121316');
      darkRender.unmount();
    });

    test('RED-PROF-BG-02: All 7 sub-screens use #F8FAFC in light mode and #121316 in dark mode (no #F5F6F2)', () => {
      const subScreens = [
        { name: 'MyTicketsModal', Component: MyTicketsModal, testID: 'subscreen-tickets' },
        { name: 'MyBookingsModal', Component: MyBookingsModal, testID: 'subscreen-bookings' },
        { name: 'PaymentCardsModal', Component: PaymentCardsModal, testID: 'subscreen-payment' },
        { name: 'AccountSettingsModal', Component: AccountSettingsModal, testID: 'subscreen-account' },
        { name: 'AppSettingsModal', Component: AppSettingsModal, testID: 'subscreen-preferences' },
        { name: 'HelpSupportModal', Component: HelpSupportModal, testID: 'subscreen-help' },
        { name: 'LegalPrivacyModal', Component: LegalPrivacyModal, testID: 'subscreen-legal' },
      ];

      subScreens.forEach(({ name, Component, testID }) => {
        useThemeStore.getState().setThemeMode('light');
        const { getByTestId, unmount } = render(<Component visible={true} onClose={jest.fn()} />);
        const subRoot = getByTestId(testID);
        const lightStyle = StyleSheet.flatten(subRoot.props.style);
        expect(lightStyle.backgroundColor).toBe('#F8FAFC');
        unmount();

        useThemeStore.getState().setThemeMode('dark');
        const darkRender = render(<Component visible={true} onClose={jest.fn()} />);
        const darkRoot = darkRender.getByTestId(testID);
        const darkStyle = StyleSheet.flatten(darkRoot.props.style);
        expect(darkStyle.backgroundColor).toBe('#121316');
        darkRender.unmount();
      });
    });
  });

  describe('2. Full-Page Sub-Screens Navigation in ProfileScreen', () => {
    test('RED-PROF-PAGE-01: Navigating to Tickets, Bookings, Payment, Account, Preferences, Help, Legal renders dedicated full page with Back button', () => {
      const { getByTestId, queryByTestId } = render(<ProfileScreen />);

      // 1. My Tickets
      fireEvent.press(getByTestId('profile-menu-tickets'));
      expect(getByTestId('subscreen-tickets')).toBeTruthy();
      fireEvent.press(getByTestId('btn-close-my-tickets'));
      expect(queryByTestId('subscreen-tickets')).toBeNull();

      // 2. My Bookings
      fireEvent.press(getByTestId('profile-menu-bookings'));
      expect(getByTestId('subscreen-bookings')).toBeTruthy();
      fireEvent.press(getByTestId('btn-close-my-bookings'));
      expect(queryByTestId('subscreen-bookings')).toBeNull();

      // 3. Payment Methods
      fireEvent.press(getByTestId('profile-menu-payment'));
      expect(getByTestId('subscreen-payment')).toBeTruthy();
      fireEvent.press(getByTestId('btn-back-cards'));
      expect(queryByTestId('subscreen-payment')).toBeNull();

      // 4. Account Settings
      fireEvent.press(getByTestId('profile-menu-account'));
      expect(getByTestId('subscreen-account')).toBeTruthy();
      fireEvent.press(getByTestId('btn-close-account-settings'));
      expect(queryByTestId('subscreen-account')).toBeNull();

      // 5. Preferences & Settings
      fireEvent.press(getByTestId('profile-menu-settings'));
      expect(getByTestId('subscreen-preferences')).toBeTruthy();
      fireEvent.press(getByTestId('btn-close-app-settings'));
      expect(queryByTestId('subscreen-preferences')).toBeNull();

      // 6. Help & Support
      fireEvent.press(getByTestId('profile-menu-help'));
      expect(getByTestId('subscreen-help')).toBeTruthy();
      fireEvent.press(getByTestId('btn-close-help-support'));
      expect(queryByTestId('subscreen-help')).toBeNull();

      // 7. Legal & Privacy
      fireEvent.press(getByTestId('profile-menu-legal'));
      expect(getByTestId('subscreen-legal')).toBeTruthy();
      fireEvent.press(getByTestId('btn-close-legal-privacy'));
      expect(queryByTestId('subscreen-legal')).toBeNull();
    });

    test('RED-PROF-CLEAN-02: Faux stacked back cards are removed from Tickets and Payment Cards sub-screens', () => {
      const ticketRender = render(<MyTicketsModal visible={true} onClose={jest.fn()} />);
      expect(ticketRender.queryByTestId('ticket-stack-back-card')).toBeNull();
      ticketRender.unmount();

      const paymentRender = render(<PaymentCardsModal visible={true} onClose={jest.fn()} />);
      expect(paymentRender.queryByTestId('payment-stack-back-card')).toBeNull();
      paymentRender.unmount();
    });
  });

  describe('3. Currency Selection & Inline Picker Fix', () => {
    test('RED-CURR-SELECT-01: currency-from-select is an independent tap target on HomeScreen', () => {
      const { getByTestId } = render(<HomeScreen />);
      const selectBtn = getByTestId('currency-from-select');
      expect(selectBtn).toBeTruthy();

      // Clicking currency-from-select opens picker modal
      fireEvent.press(selectBtn);
      expect(getByTestId('currency-picker-modal')).toBeTruthy();
    });

    test('RED-CURR-SELECT-02: dedicated currency form modal has inline currency selectors without modal stacking conflict', () => {
      const { getByTestId, queryByTestId } = render(<HomeScreen />);

      // Open Form Modal by tapping the amount box
      fireEvent.press(getByTestId('currency-from-box'));
      expect(getByTestId('currency-converter-form-modal')).toBeTruthy();

      // Selecting a currency in the form modal uses inline picker chips/dropdown without launching a 2nd modal
      const modalFromBtn = getByTestId('modal-currency-from-btn');
      fireEvent.press(modalFromBtn);

      // Verify inline currency options are rendered within the form modal
      expect(getByTestId('inline-currency-selector')).toBeTruthy();
      expect(getByTestId('inline-currency-option-EUR')).toBeTruthy();

      // Tap EUR
      fireEvent.press(getByTestId('inline-currency-option-EUR'));

      // The inline picker closes or selects EUR directly, and fromCurrency is updated to EUR
      expect(within(modalFromBtn).getByText(/EUR/)).toBeTruthy();
    });
  });
});
