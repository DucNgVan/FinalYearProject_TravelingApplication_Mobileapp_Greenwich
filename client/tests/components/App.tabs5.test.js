import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import App from '../../App';
import { useAuthStore } from '../../src/stores/auth.store';

describe('Component Test: App 5-Tab Navigation Layout (Flights, Hotels, Home, Plan, Profile)', () => {
  beforeEach(() => {
    // Authenticated state so main tabs are rendered directly
    useAuthStore.setState({
      user: { id: 'usr-1', fullName: 'Duc Nguyen', email: 'ducnva.wk@gmail.com' },
      isAuthenticated: true,
      isGuest: false,
    });
  });

  test('RED-FE-APP-01: should render exactly 5 bottom tabs in order: Flights, Hotels, Home, Plan, Profile', () => {
    const { getByTestId, queryByTestId } = render(<App initialHasCompletedOnboarding={true} />);

    const tabBar = getByTestId('app-bottom-tabbar');
    expect(tabBar).toBeTruthy();

    expect(getByTestId('tab-btn-flights')).toBeTruthy();
    expect(getByTestId('tab-btn-hotels')).toBeTruthy();
    expect(getByTestId('tab-btn-home')).toBeTruthy();
    expect(getByTestId('tab-btn-plan')).toBeTruthy();
    expect(getByTestId('tab-btn-profile')).toBeTruthy();
    expect(queryByTestId('tab-btn-group')).toBeNull();
  });

  test('RED-FE-APP-02: should default to Home screen in the center dock', () => {
    const { getByTestId, getByText } = render(<App initialHasCompletedOnboarding={true} />);

    // Home screen elements should be visible by default
    expect(getByTestId(/hero-(trip|suggestion)-card/)).toBeTruthy();
    expect(getByText(/NOMADIX/i)).toBeTruthy();
  });

  test('RED-FE-APP-03: should switch between all 5 tabs smoothly upon button press', () => {
    const { getByTestId, getAllByText } = render(<App initialHasCompletedOnboarding={true} />);

    // Switch to Flights (Left 1)
    fireEvent.press(getByTestId('tab-btn-flights'));
    expect(getByTestId('flight-search-container')).toBeTruthy();

    // Switch to Hotels (Left 2)
    fireEvent.press(getByTestId('tab-btn-hotels'));
    expect(getAllByText(/Where to stay|Hotels in/i).length).toBeGreaterThan(0);

    // Switch to Plan (Right 1)
    fireEvent.press(getByTestId('tab-btn-plan'));
    expect(getByTestId('tab-btn-plan')).toBeTruthy();

    // Switch to Profile (Right 2)
    fireEvent.press(getByTestId('tab-btn-profile'));
    expect(getByTestId('profile-root-container')).toBeTruthy();

    // Switch back to Home (Center)
    fireEvent.press(getByTestId('tab-btn-home'));
    expect(getByTestId(/hero-(trip|suggestion)-card/)).toBeTruthy();
  });
});
