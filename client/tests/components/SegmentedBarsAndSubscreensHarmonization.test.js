import React from 'react';
import { StyleSheet } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import LegalPrivacyModal from '../../src/screens/account/LegalPrivacyModal';
import MyBookingsModal from '../../src/screens/account/MyBookingsModal';
import MyTicketsModal from '../../src/screens/account/MyTicketsModal';
import AppSettingsModal from '../../src/screens/account/AppSettingsModal';
import ProfileScreen from '../../src/screens/account/ProfileScreen';
import { useThemeStore } from '../../src/stores/theme.store';
import { useAuthStore } from '../../src/stores/auth.store';
import { useBookingStore } from '../../src/stores/booking.store';

jest.mock('../../src/stores/auth.store');
jest.mock('../../src/stores/booking.store');

describe('TDD Suite: Segmented Bars, Booking Tabs & Sub-screens Harmonization', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.mockReturnValue({
      user: { id: 'user-001', fullName: 'Guest Traveler', email: 'guest@nomadix.app', role: 'Explorer' },
      logout: jest.fn(),
    });
    useBookingStore.mockReturnValue({
      bookedTickets: [],
      bookedHotels: [],
    });
    useThemeStore.getState().setThemeMode('light');
  });

  test('RED-SEG-BAR-01: LegalPrivacyModal segmented control follows canonical template (track borderRadius: 24, padding: 4, pill borderRadius: 20, active #111827 with white text)', () => {
    const { getByTestId, getByText } = render(<LegalPrivacyModal visible={true} onClose={jest.fn()} />);

    const termsTab = getByTestId('legal-tab-terms');
    const flatActiveStyle = StyleSheet.flatten(termsTab.props.style);

    // Active pill must use solid dark background #111827 and NOT white #FFFFFF
    expect(flatActiveStyle.backgroundColor).toBe('#111827');
    expect(flatActiveStyle.borderRadius).toBe(20);

    // Active text inside Terms of Service must be white #FFFFFF
    const termsText = getByText('Terms of Service');
    const textStyle = StyleSheet.flatten(termsText.props.style);
    expect(textStyle.color).toBe('#FFFFFF');
  });

  test('RED-SEG-BAR-02: MyBookingsModal and MyTicketsModal use canonical segmented bar styling (#111827 active, white text)', () => {
    const { getByTestId: getBookingTestId, getByText: getBookingText } = render(
      <MyBookingsModal visible={true} onClose={jest.fn()} />
    );

    const upcomingBookingTab = getBookingTestId('booking-segment-upcoming');
    const flatBookingStyle = StyleSheet.flatten(upcomingBookingTab.props.style);
    expect(flatBookingStyle.backgroundColor).toBe('#111827');
    expect(flatBookingStyle.borderRadius).toBe(20);

    const bookingText = getBookingText('Upcoming');
    expect(StyleSheet.flatten(bookingText.props.style).color).toBe('#FFFFFF');

    const { getByTestId: getTicketTestId, getByText: getTicketText } = render(
      <MyTicketsModal visible={true} onClose={jest.fn()} />
    );

    const upcomingTicketTab = getTicketTestId('ticket-segment-upcoming');
    const flatTicketStyle = StyleSheet.flatten(upcomingTicketTab.props.style);
    expect(flatTicketStyle.backgroundColor).toBe('#111827');
    expect(flatTicketStyle.borderRadius).toBe(20);

    const ticketText = getTicketText('Upcoming');
    expect(StyleSheet.flatten(ticketText.props.style).color).toBe('#FFFFFF');
  });

  test('RED-BKG-TAB-03: MyBookingsModal filters bookings by tab and displays Cancelled badge on Cancelled tab, never Confirmed', () => {
    const { getByTestId, queryAllByText, getByText } = render(
      <MyBookingsModal visible={true} onClose={jest.fn()} />
    );

    // Initially on Upcoming tab: shows Confirmed bookings
    expect(queryAllByText('Confirmed').length).toBeGreaterThan(0);

    // Press Cancelled tab
    const cancelledTab = getByTestId('booking-segment-cancelled');
    fireEvent.press(cancelledTab);

    // When Cancelled is active: must NOT display "Confirmed" badges
    expect(queryAllByText('Confirmed').length).toBe(0);

    // Must show Cancelled stay or Cancelled badge
    expect(queryAllByText(/Cancelled/i).length).toBeGreaterThan(0);

    // Press Past tab
    const pastTab = getByTestId('booking-segment-past');
    fireEvent.press(pastTab);
    expect(queryAllByText('Confirmed').length).toBe(0);
    expect(queryAllByText(/Completed/i).length).toBeGreaterThan(0);
  });

  test('RED-PREF-CLR-04: AppSettingsModal eliminates #0B7A75 teal in favor of Midnight Navy #0E1B2C for switches, checkmarks, and theme pills', () => {
    const { getByTestId, getByText, UNSAFE_getAllByType } = render(
      <AppSettingsModal visible={true} onClose={jest.fn()} />
    );

    // Appearance segmented theme pill uses canonical #111827 active style
    const lightThemeTab = getByTestId('settings-theme-light');
    const flatThemeStyle = StyleSheet.flatten(lightThemeTab.props.style);
    expect(flatThemeStyle.backgroundColor).toBe('#111827');
    expect(flatThemeStyle.borderRadius).toBe(20);
    expect(StyleSheet.flatten(getByText('Light Mode').props.style).color).toBe('#FFFFFF');

    // Selected currency checkmark circle uses #0E1B2C (not teal #0B7A75)
    const vndOption = getByTestId('settings-currency-VND');
    const checkCircle = vndOption.findAll((node) => {
      const style = StyleSheet.flatten(node.props.style);
      return style && (style.backgroundColor === '#0E1B2C' || style.backgroundColor === '#0B7A75');
    })[0];
    expect(checkCircle).toBeDefined();
    expect(StyleSheet.flatten(checkCircle.props.style).backgroundColor).not.toBe('#0B7A75');
    expect(StyleSheet.flatten(checkCircle.props.style).backgroundColor).toBe('#0E1B2C');

    // Notification switches use #0E1B2C for true trackColor (onTintColor in React Native)
    const flightSwitch = getByTestId('settings-switch-flight');
    const activeTrack = flightSwitch.props.onTintColor || (flightSwitch.props.trackColor && flightSwitch.props.trackColor.true);
    expect(activeTrack).not.toBe('#0B7A75');
    expect(activeTrack).toBe('#0E1B2C');
  });

  test('RED-FULLPAGE-05: Sub-screens use absolute fill and zIndex >= 100 to present as full-page sub-views over ProfileScreen', () => {
    const { getByTestId } = render(<ProfileScreen />);

    // Open Bookings
    fireEvent.press(getByTestId('profile-menu-bookings'));

    // Subscreen bookings is visible
    const subscreen = getByTestId('subscreen-bookings');
    expect(subscreen).toBeTruthy();

    const flatStyle = StyleSheet.flatten(subscreen.props.style);
    expect(flatStyle.position).toBe('absolute');
    expect(flatStyle.top).toBe(0);
    expect(flatStyle.bottom).toBe(0);
    expect(flatStyle.left).toBe(0);
    expect(flatStyle.right).toBe(0);
    expect(flatStyle.zIndex).toBeGreaterThanOrEqual(100);
  });
});
