import React from 'react';
import { StyleSheet } from 'react-native';
import { render } from '@testing-library/react-native';
import ProfileScreen from '../../src/screens/account/ProfileScreen';
import { useThemeStore, darkColors } from '../../src/stores/theme.store';
import { useAuthStore } from '../../src/stores/auth.store';
import { useBookingStore } from '../../src/stores/booking.store';

jest.mock('../../src/stores/auth.store');

describe('Theme Harmonization (RED Phase)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.mockReturnValue({
      user: { fullName: 'Traveler Duc', email: 'duc@nomadix.app' },
      logout: jest.fn(),
    });
    useBookingStore.setState({ bookedTickets: [] });
  });

  test('RED-THEME-01: darkColors in theme.store matches HomeScreen obsidian palette (#121316, #1C1D21, #2A2D35)', () => {
    expect(darkColors.background).toBe('#121316');
    expect(darkColors.card).toBe('#1C1D21');
    expect(darkColors.border).toBe('#2A2D35');
    expect(darkColors.text).toBe('#FFFFFF');
    expect(darkColors.textMuted).toBe('#9CA3AF');
  });

  test('RED-THEME-02: ProfileScreen uses synchronized obsidian dark mode background and card colors', () => {
    useThemeStore.setState({ mode: 'dark', colors: darkColors });
    const { getByTestId } = render(<ProfileScreen />);

    const rootContainer = getByTestId('profile-root-container');
    const flatRootStyle = StyleSheet.flatten(rootContainer.props.style);
    expect(flatRootStyle.backgroundColor).toBe('#121316');

    const profileCard = getByTestId('profile-user-card');
    const flatCardStyle = StyleSheet.flatten(profileCard.props.style);
    expect(flatCardStyle.backgroundColor).toBe('#1C1D21');
    expect(flatCardStyle.borderColor).toBe('#2A2D35');
  });
});
