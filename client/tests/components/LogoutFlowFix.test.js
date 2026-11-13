import React, { act } from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import App from '../../App';
import { useAuthStore } from '../../src/stores/auth.store';

describe('TDD RED Phase: Logout Flow & Guest Reset Fix', () => {
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

  test('RED-LOGOUT-01: calling useAuthStore.logout resets isGuest to false', () => {
    act(() => {
      useAuthStore.getState().continueAsGuest();
    });

    expect(useAuthStore.getState().isGuest).toBe(true);
    expect(useAuthStore.getState().isAuthenticated).toBe(true);

    act(() => {
      useAuthStore.getState().logout();
    });

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.accessToken).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isGuest).toBe(false); // MUST BE FALSE!
  });

  test('RED-LOGOUT-02: Guest user tapping Log Out in ProfileScreen transitions App back to LoginScreen', () => {
    act(() => {
      useAuthStore.getState().continueAsGuest();
    });

    const { getByTestId, queryByTestId, getAllByText } = render(
      <App initialHasCompletedOnboarding={true} initialTab="profile" />
    );

    // Verify currently on Profile
    expect(getByTestId('profile-root-container')).toBeTruthy();
    const logoutBtn = getByTestId('profile-logout-btn');
    expect(logoutBtn).toBeTruthy();

    // Tap Log Out
    act(() => {
      fireEvent.press(logoutBtn);
    });

    // Profile screen should be unmounted/gone, LoginScreen should now be visible
    expect(queryByTestId('profile-root-container')).toBeNull();
    expect(getByTestId('login-card')).toBeTruthy();
    expect(getByTestId('login-submit-button')).toBeTruthy();
  });

  test('RED-LOGOUT-03: Authenticated user tapping Log Out resets activeTab to home and shows LoginScreen', () => {
    act(() => {
      useAuthStore.setState({
        user: { id: 'usr-real-1', fullName: 'Đức Nguyễn', email: 'duc@nomadix.app' },
        accessToken: 'valid-jwt-token',
        refreshToken: 'valid-refresh-token',
        isAuthenticated: true,
        isGuest: false,
      });
    });

    const { getByTestId, queryByTestId } = render(
      <App initialHasCompletedOnboarding={true} initialTab="profile" />
    );

    expect(getByTestId('profile-root-container')).toBeTruthy();
    const logoutBtn = getByTestId('profile-logout-btn');

    act(() => {
      fireEvent.press(logoutBtn);
    });

    expect(queryByTestId('profile-root-container')).toBeNull();
    expect(getByTestId('login-card')).toBeTruthy();
  });
});
