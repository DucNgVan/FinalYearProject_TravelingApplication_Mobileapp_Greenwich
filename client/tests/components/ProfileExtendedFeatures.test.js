import React from 'react';
import { StyleSheet } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import App from '../../App';
import ProfileScreen from '../../src/screens/account/ProfileScreen';
import AppSettingsModal from '../../src/screens/account/AppSettingsModal';
import HelpSupportModal from '../../src/screens/account/HelpSupportModal';
import LegalPrivacyModal from '../../src/screens/account/LegalPrivacyModal';
import { useAuthStore } from '../../src/stores/auth.store';
import { useThemeStore } from '../../src/stores/theme.store';
import { useBookingStore } from '../../src/stores/booking.store';

describe('TDD RED Phase: Profile Extended Features (Payment, Account, Settings, Help, Legal & Privacy)', () => {
  beforeEach(() => {
    useThemeStore.getState().setThemeMode('light');
    useAuthStore.setState({
      user: { fullName: 'Nguyen Van Duc', email: 'duc@nomadix.app', role: 'Owner' },
      isAuthenticated: true,
      isGuest: false,
    });
    useBookingStore.setState({ bookedTickets: [], bookedHotels: [] });
  });

  afterEach(() => {
    useThemeStore.getState().setThemeMode('light');
  });

  test('RED-PROF-01: ProfileScreen renders all 5 required menu rows with proper labels & testIDs', () => {
    const { getByTestId, getAllByText } = render(<ProfileScreen />);

    // 1. Thông tin thanh toán
    expect(getByTestId('profile-menu-payment')).toBeTruthy();
    expect(getAllByText(/Thông tin thanh toán|Payment Cards & Methods/i).length).toBeGreaterThan(0);

    // 2. Quản lý tài khoản
    expect(getByTestId('profile-menu-account')).toBeTruthy();
    expect(getAllByText(/Quản lý tài khoản|Account Settings/i).length).toBeGreaterThan(0);

    // 3. Cài đặt
    expect(getByTestId('profile-menu-settings')).toBeTruthy();
    expect(getAllByText(/Cài đặt|Settings/i).length).toBeGreaterThan(0);

    // 4. Trợ giúp
    expect(getByTestId('profile-menu-help')).toBeTruthy();
    expect(getAllByText(/Trợ giúp & Hỗ trợ|Trợ giúp|Help & Support/i).length).toBeGreaterThan(0);

    // 5. Pháp lý và quyền riêng tư
    expect(getByTestId('profile-menu-legal')).toBeTruthy();
    expect(getAllByText(/Pháp lý & Quyền riêng tư|Pháp lý và quyền riêng tư|Legal & Privacy/i).length).toBeGreaterThan(0);
  });

  test('RED-PROF-02: AppSettingsModal renders Currency, Language, and Notification settings, and close works', () => {
    const onClose = jest.fn();
    const { getByTestId, getByText } = render(
      <AppSettingsModal visible={true} onClose={onClose} />
    );

    expect(getByTestId('app-settings-modal')).toBeTruthy();
    expect(getByText(/Cài đặt|Settings/i)).toBeTruthy();
    expect(getByText(/VND/i)).toBeTruthy();
    expect(getByText(/USD/i)).toBeTruthy();
    expect(getByText(/Tiếng Việt/i)).toBeTruthy();
    expect(getByText(/English/i)).toBeTruthy();

    // Close button
    const backBtn = getByTestId('btn-close-app-settings');
    fireEvent.press(backBtn);
    expect(onClose).toHaveBeenCalled();
  });

  test('RED-PROF-03: HelpSupportModal renders FAQ search, 24/7 chat, Hotline, and Ticket support link', () => {
    const onClose = jest.fn();
    const { getByTestId, getByText } = render(
      <HelpSupportModal visible={true} onClose={onClose} />
    );

    expect(getByTestId('help-support-modal')).toBeTruthy();
    expect(getByText(/Trợ giúp & Hỗ trợ|Help & Support/i)).toBeTruthy();
    expect(getByTestId('btn-support-chat')).toBeTruthy();
    expect(getByTestId('btn-support-hotline')).toBeTruthy();
    expect(getByTestId('btn-support-email')).toBeTruthy();
    expect(getByText('1900 6868')).toBeTruthy();
    expect(getByText(/support@nomadix\.app/i)).toBeTruthy();

    // Close button
    const backBtn = getByTestId('btn-close-help-support');
    fireEvent.press(backBtn);
    expect(onClose).toHaveBeenCalled();
  });

  test('RED-PROF-04: LegalPrivacyModal renders Terms of Service, Privacy Policy, and Data Management', () => {
    const onClose = jest.fn();
    const { getByTestId, getByText } = render(
      <LegalPrivacyModal visible={true} onClose={onClose} />
    );

    expect(getByTestId('legal-privacy-modal')).toBeTruthy();
    expect(getByText(/Pháp lý & Quyền riêng tư|Legal & Privacy/i)).toBeTruthy();
    expect(getByText(/ĐIỀU KHOẢN DỊCH VỤ/i)).toBeTruthy();

    // Switch to Privacy tab
    fireEvent.press(getByTestId('legal-tab-privacy'));
    expect(getByText(/CHÍNH SÁCH BẢO MẬT & QUYỀN RIÊNG TƯ/i)).toBeTruthy();
    expect(getByText(/GDPR/i)).toBeTruthy();

    // Switch to Data tab
    fireEvent.press(getByTestId('legal-tab-data'));
    expect(getByTestId('btn-download-data')).toBeTruthy();
    expect(getByTestId('btn-clear-cache')).toBeTruthy();

    // Close button
    const backBtn = getByTestId('btn-close-legal-privacy');
    fireEvent.press(backBtn);
    expect(onClose).toHaveBeenCalled();
  });

  test('RED-PROF-05: In Dark Mode, new modals have dark background and dark back buttons', () => {
    useThemeStore.getState().setThemeMode('dark');

    const { getByTestId: getSettingsId } = render(
      <AppSettingsModal visible={true} onClose={() => {}} />
    );
    const settingsBack = getSettingsId('btn-close-app-settings');
    const settingsStyle = StyleSheet.flatten(settingsBack.props.style);
    expect(settingsStyle.backgroundColor).toBe('#1C1D21');

    const { getByTestId: getHelpId } = render(
      <HelpSupportModal visible={true} onClose={() => {}} />
    );
    const helpBack = getHelpId('btn-close-help-support');
    const helpStyle = StyleSheet.flatten(helpBack.props.style);
    expect(helpStyle.backgroundColor).toBe('#1C1D21');

    const { getByTestId: getLegalId } = render(
      <LegalPrivacyModal visible={true} onClose={() => {}} />
    );
    const legalBack = getLegalId('btn-close-legal-privacy');
    const legalStyle = StyleSheet.flatten(legalBack.props.style);
    expect(legalStyle.backgroundColor).toBe('#1C1D21');
  });

  test('RED-PROF-06: Bottom dock remains visible when opening Settings, Help, and Legal from Profile', () => {
    const { getByTestId } = render(
      <App initialHasCompletedOnboarding={true} initialTab="profile" />
    );

    expect(getByTestId('app-bottom-tabbar')).toBeTruthy();

    // Open Settings
    fireEvent.press(getByTestId('profile-menu-settings'));
    expect(getByTestId('app-settings-modal')).toBeTruthy();
    expect(getByTestId('app-bottom-tabbar')).toBeTruthy();
    fireEvent.press(getByTestId('btn-close-app-settings'));

    // Open Help
    fireEvent.press(getByTestId('profile-menu-help'));
    expect(getByTestId('help-support-modal')).toBeTruthy();
    expect(getByTestId('app-bottom-tabbar')).toBeTruthy();
    fireEvent.press(getByTestId('btn-close-help-support'));

    // Open Legal
    fireEvent.press(getByTestId('profile-menu-legal'));
    expect(getByTestId('legal-privacy-modal')).toBeTruthy();
    expect(getByTestId('app-bottom-tabbar')).toBeTruthy();
    fireEvent.press(getByTestId('btn-close-legal-privacy'));
  });
});
