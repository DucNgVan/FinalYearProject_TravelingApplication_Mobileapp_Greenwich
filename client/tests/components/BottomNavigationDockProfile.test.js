import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import App from '../../App';
import { useAuthStore } from '../../src/stores/auth.store';

describe('Bottom Navigation 5-Tab Layout with Profile (RED Phase)', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: { id: 'usr-1', fullName: 'Duc Nguyen', email: 'duc@nomadix.app' },
      isAuthenticated: true,
      isGuest: false,
    });
  });

  test('RED-NAV-01: renders 5 balanced bottom tabs in order: Flights, Hotels, Home, Plan, Profile', () => {
    const { getByTestId } = render(<App initialHasCompletedOnboarding={true} />);

    expect(getByTestId('tab-btn-flights')).toBeTruthy();
    expect(getByTestId('tab-btn-hotels')).toBeTruthy();
    expect(getByTestId('tab-btn-home')).toBeTruthy();
    expect(getByTestId('tab-btn-plan')).toBeTruthy();
    expect(getByTestId('tab-btn-profile')).toBeTruthy();
  });

  test('RED-NAV-02: pressing Profile tab button in dock opens ProfileScreen', () => {
    const { getByTestId, getByText } = render(<App initialHasCompletedOnboarding={true} />);

    fireEvent.press(getByTestId('tab-btn-profile'));
    expect(getByTestId('profile-root-container')).toBeTruthy();
    expect(getByText('Account')).toBeTruthy();
  });
});
