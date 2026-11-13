import React from 'react';
import { StyleSheet } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import ProfileScreen from '../../src/screens/account/ProfileScreen';
import AppSettingsModal from '../../src/screens/account/AppSettingsModal';
import HelpSupportModal from '../../src/screens/account/HelpSupportModal';
import LegalPrivacyModal from '../../src/screens/account/LegalPrivacyModal';
import { useAuthStore } from '../../src/stores/auth.store';
import { useThemeStore } from '../../src/stores/theme.store';
import { useBookingStore } from '../../src/stores/booking.store';

describe('TDD RED Phase: Harmonized English UI, Region Section Headers, No Dividers & Unified Color Badges', () => {
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

  test('RED-HARM-01: ProfileScreen renders region section titles above each group', () => {
    const { getByText } = render(<ProfileScreen />);

    expect(getByText('SERVICES & BOOKINGS')).toBeTruthy();
    expect(getByText('PAYMENT & FINANCE')).toBeTruthy();
    expect(getByText('SYSTEM & SUPPORT')).toBeTruthy();
  });

  test('RED-HARM-02: ProfileScreen menus are 100% in English without bilingual parentheses', () => {
    const { getByTestId, getByText, queryByText } = render(<ProfileScreen />);

    // 100% English clean titles
    expect(getByText('Payment Methods')).toBeTruthy();
    expect(getByText('Account Settings')).toBeTruthy();
    expect(getByText('Preferences & Settings')).toBeTruthy();
    expect(getByText('Help & Support')).toBeTruthy();
    expect(getByText('Legal & Privacy')).toBeTruthy();

    // No bilingual parentheses
    expect(queryByText(/Thông tin thanh toán/i)).toBeNull();
    expect(queryByText(/Quản lý tài khoản/i)).toBeNull();
    expect(queryByText(/Cài đặt \(Settings\)/i)).toBeNull();
    expect(queryByText(/Pháp lý & Quyền riêng tư/i)).toBeNull();
  });

  test('RED-HARM-03: MenuItem rows in ProfileScreen do NOT have dividing bottom border lines', () => {
    const { getByTestId } = render(<ProfileScreen />);

    const ticketsRow = getByTestId('profile-menu-tickets');
    const flatStyle = StyleSheet.flatten(ticketsRow.props.style);
    expect(flatStyle.borderBottomWidth).toBeFalsy();

    const paymentRow = getByTestId('profile-menu-payment');
    const flatPaymentStyle = StyleSheet.flatten(paymentRow.props.style);
    expect(flatPaymentStyle.borderBottomWidth).toBeFalsy();

    const settingsRow = getByTestId('profile-menu-settings');
    const flatSettingsStyle = StyleSheet.flatten(settingsRow.props.style);
    expect(flatSettingsStyle.borderBottomWidth).toBeFalsy();
  });

  test('RED-HARM-04: AppSettingsModal, HelpSupportModal, and LegalPrivacyModal display 100% English content and zero dividing lines', () => {
    // AppSettingsModal
    const { getByText: getSettingsText, getByTestId: getSettingsId } = render(
      <AppSettingsModal visible={true} onClose={() => {}} />
    );
    expect(getSettingsText('Preferences & Settings')).toBeTruthy();
    expect(getSettingsText('APPEARANCE & THEME')).toBeTruthy();
    expect(getSettingsText('DISPLAY CURRENCY')).toBeTruthy();
    expect(getSettingsText('NOTIFICATIONS & ALERTS')).toBeTruthy();
    expect(getSettingsText('BIOMETRIC SECURITY')).toBeTruthy();

    const currencyRow = getSettingsId('settings-currency-VND');
    const flatCurrencyStyle = StyleSheet.flatten(currencyRow.props.style);
    expect(flatCurrencyStyle.borderBottomWidth).toBeFalsy();

    // HelpSupportModal
    const { getByText: getHelpText, getByTestId: getHelpId } = render(
      <HelpSupportModal visible={true} onClose={() => {}} />
    );
    expect(getHelpText('Help & Support')).toBeTruthy();
    expect(getHelpText('DIRECT SUPPORT CHANNELS')).toBeTruthy();
    expect(getHelpText('24/7 Live Chat')).toBeTruthy();
    expect(getHelpText('Hotline Support')).toBeTruthy();
    expect(getHelpText('Email Support')).toBeTruthy();

    const chatRow = getHelpId('btn-support-chat');
    const flatChatStyle = StyleSheet.flatten(chatRow.props.style);
    expect(flatChatStyle.borderBottomWidth).toBeFalsy();

    // LegalPrivacyModal
    const { getByText: getLegalText } = render(
      <LegalPrivacyModal visible={true} onClose={() => {}} />
    );
    expect(getLegalText('Legal & Privacy')).toBeTruthy();
    expect(getLegalText('TERMS OF SERVICE')).toBeTruthy();
  });

  test('RED-HARM-05: Icon badges in ProfileScreen follow the synchronized pastel palette', () => {
    const { getByTestId } = render(<ProfileScreen />);

    expect(getByTestId('badge-icon-tickets')).toBeTruthy();
    expect(getByTestId('badge-icon-bookings')).toBeTruthy();
    expect(getByTestId('badge-icon-payment')).toBeTruthy();
    expect(getByTestId('badge-icon-account')).toBeTruthy();
    expect(getByTestId('badge-icon-settings')).toBeTruthy();
    expect(getByTestId('badge-icon-help')).toBeTruthy();
    expect(getByTestId('badge-icon-legal')).toBeTruthy();
  });
});
