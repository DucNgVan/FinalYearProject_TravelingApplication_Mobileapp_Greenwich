import React from 'react';
import { StyleSheet } from 'react-native';
import { render, act } from '@testing-library/react-native';
import ProfileScreen from '../../src/screens/account/ProfileScreen';
import { useAuthStore } from '../../src/stores/auth.store';
import { useThemeStore } from '../../src/stores/theme.store';
import { useBookingStore } from '../../src/stores/booking.store';
import { useItineraryStore } from '../../src/stores/itinerary.store';

describe('TDD RED Phase: ProfileScreen Flight Color Harmonization', () => {
  beforeEach(() => {
    act(() => {
      useThemeStore.getState().setThemeMode('light');
    });
    useAuthStore.setState({
      user: {
        id: 'usr-duc-01',
        fullName: 'Nguyen Van Duc',
        email: 'ducnv1792005@gmail.com',
        role: 'Traveler',
        level: 1,
        xp: 0,
        tripsCount: 0,
        checkinsCount: 0,
        badgesCount: 0,
      },
      isAuthenticated: true,
      isGuest: false,
    });
    useBookingStore.setState({ bookedTickets: [], bookedHotels: [] });
    useItineraryStore.setState({ trips: [] });
  });

  test('RED-PROFILE-COLOR-01: Avatar circle and role badge use executive Nomadix palette (#0F172A avatar with #FFFFFF text in light mode)', () => {
    const { getByTestId } = render(<ProfileScreen />);

    const avatarContainer = getByTestId('profile-avatar-container');
    expect(avatarContainer).toBeTruthy();
    const avatarStyle = StyleSheet.flatten(avatarContainer.props.style);
    expect(avatarStyle.backgroundColor).toBe('#0F172A');

    const avatarInitial = getByTestId('profile-avatar-initial');
    const initialStyle = StyleSheet.flatten(avatarInitial.props.style);
    expect(initialStyle.color).toBe('#FFFFFF');
  });

  test('RED-PROFILE-COLOR-02: Level XP bar and 3 stat count metrics use unified monochrome slate typography (no green/blue count)', () => {
    const { getByTestId } = render(<ProfileScreen />);

    const statCheckins = getByTestId('profile-stat-checkins');
    const checkinCount = statCheckins.props.children[0];
    const checkinCountStyle = StyleSheet.flatten(checkinCount.props.style);
    // Must NOT be bright green #2E7D5B
    expect(checkinCountStyle.color).not.toBe('#2E7D5B');

    const statBadges = getByTestId('profile-stat-badges');
    const badgeCount = statBadges.props.children[0];
    const badgeCountStyle = StyleSheet.flatten(badgeCount.props.style);
    // Must NOT be bright blue #2563EB
    expect(badgeCountStyle.color).not.toBe('#2563EB');
  });

  test('RED-PROFILE-COLOR-03: All 7 menu icon badges eliminate rainbow pastels, unifying to executive slate #F1F5F9 in Light Mode', () => {
    const { getByTestId } = render(<ProfileScreen />);

    const badges = [
      'badge-icon-tickets',
      'badge-icon-bookings',
      'badge-icon-payment',
      'badge-icon-account',
      'badge-icon-settings',
      'badge-icon-help',
      'badge-icon-legal',
    ];

    badges.forEach((testId) => {
      const badgeElem = getByTestId(testId);
      expect(badgeElem).toBeTruthy();
      const style = StyleSheet.flatten(badgeElem.props.style);
      // In Light Mode, every icon badge must be sleek slate #F1F5F9
      expect(style.backgroundColor).toBe('#F1F5F9');
    });
  });

  test('RED-PROFILE-COLOR-04: Appearance Theme Switcher uses high-contrast flight-style capsule (#111827 active in light mode)', () => {
    const { getByTestId } = render(<ProfileScreen />);

    const lightPill = getByTestId('theme-pill-light');
    expect(lightPill).toBeTruthy();
    const pillStyle = StyleSheet.flatten(lightPill.props.style);
    // Active pill in light mode must be solid dark #111827 (matching FlightSearchScreen & HomeScreen)
    expect(pillStyle.backgroundColor).toBe('#111827');
  });
});
