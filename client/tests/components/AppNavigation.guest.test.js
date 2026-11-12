import React, { act } from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import App from '../../App';
import { useAuthStore } from '../../src/stores/auth.store';

describe('Component Test: Guest Navigation & 3 Pre-Login Tabs', () => {
  beforeEach(() => {
    act(() => {
      useAuthStore.setState({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isGuest: false,
        isLoading: false,
        error: null,
      });
    });
  });

  test('RED-FE-GUEST-01: guest user can access functional tabs (Flights, Hotels, Plan) without requiring full login', () => {
    act(() => {
      useAuthStore.getState().continueAsGuest();
    });

    const { getByText, getAllByText } = render(<App />);

    // Functional tab bar should be rendered directly in guest mode
    expect(getAllByText(/Flights/i).length).toBeGreaterThanOrEqual(1);
    expect(getAllByText(/Hotels/i).length).toBeGreaterThanOrEqual(1);
    expect(getAllByText(/Plan/i).length).toBeGreaterThanOrEqual(1);

    // Flight search screen elements should be visible
    expect(getByText('Explore Vietnam')).toBeTruthy();
    expect(getByText('Find Flights')).toBeTruthy();
  });

  test('RED-FE-GUEST-02: Tab 4 displays Profile when logged in or explored as guest', () => {
    act(() => {
      useAuthStore.setState({
        user: { id: 'user-1', fullName: 'Nguyen Van Duc', email: 'duc@nomadix.app', role: 'Owner' },
        isAuthenticated: true,
        isGuest: false,
      });
    });

    const { getAllByText } = render(<App />);
    expect(getAllByText(/Profile/i).length).toBeGreaterThanOrEqual(1);
  });

  test('RED-FE-GUEST-03: auth store provides continueAsGuest action for guest exploration', () => {
    expect(typeof useAuthStore.getState().continueAsGuest).toBe('function');
    act(() => {
      useAuthStore.getState().continueAsGuest();
    });

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.isGuest).toBe(true);
    expect(state.user?.role).toBe('Viewer');
  });

  test('RED-FE-UI-RADIUS-01: App bottom navigation bar has floating rounded pill style with borderRadius >= 24', () => {
    act(() => {
      useAuthStore.getState().continueAsGuest();
    });

    const { getByTestId } = render(<App />);
    const bottomBar = getByTestId('app-bottom-tabbar');
    const flatStyle = Array.isArray(bottomBar.props.style)
      ? Object.assign({}, ...bottomBar.props.style)
      : bottomBar.props.style;

    expect(flatStyle.borderRadius).toBeGreaterThanOrEqual(24);
  });
});
