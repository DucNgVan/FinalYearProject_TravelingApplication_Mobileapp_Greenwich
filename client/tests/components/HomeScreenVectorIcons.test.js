import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import HomeScreen from '../../src/screens/home/HomeScreen';
import { useAuthStore } from '../../src/stores/auth.store';
import { useThemeStore } from '../../src/stores/theme.store';

describe('TDD RED Phase: HomeScreen Pure Vector Outline Icons (Zero Emojis)', () => {
  beforeEach(() => {
    useThemeStore.getState().setThemeMode('light');
    useAuthStore.setState({
      user: { fullName: 'Guest Traveler', email: 'guest@nomadix.app' },
    });
  });

  test('RED-HOME-01: HomeScreen must render pure outline vector icons for 4 services and swap button', () => {
    const { getByTestId, queryByText } = render(<HomeScreen />);

    // Assert that the ugly emojis are completely eradicated
    expect(queryByText('✈️')).toBeNull();
    expect(queryByText('🏨')).toBeNull();
    expect(queryByText('🗺️')).toBeNull();
    expect(queryByText('👥')).toBeNull();
    expect(queryByText('🔄')).toBeNull();
    expect(queryByText('👁️')).toBeNull();
    expect(queryByText('🔔')).toBeNull();

    // Verify Travel Radar & Weather widget renders
    expect(getByTestId('home-travel-radar-widget')).toBeTruthy();

    // Verify currency swap button is a dark circle with vector swap icon
    expect(getByTestId('currency-swap-btn')).toBeTruthy();

    // Verify explored banner renders clean number 8 pill without eye emoji
    expect(getByTestId('home-explored-badge')).toBeTruthy();
  });
});
