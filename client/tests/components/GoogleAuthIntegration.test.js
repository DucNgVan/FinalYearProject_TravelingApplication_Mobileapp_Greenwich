import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from '../../src/screens/auth/LoginScreen';
import { useAuthStore } from '../../src/stores/auth.store';
import apiClient from '../../src/api/client';

jest.mock('../../src/api/client');

describe('TDD RED Phase: Google OAuth 2.0 Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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

  test('RED-GOOG-FE-04: useAuthStore.loginWithGoogle calls /auth/google, sets authenticated true and isGuest false', async () => {
    const mockGoogleResponse = {
      user: {
        id: 'user-google-123',
        email: 'traveler.google@gmail.com',
        fullName: 'Google User',
        isEmailVerified: true,
      },
      tokens: {
        accessToken: 'jwt-google-access-token',
        refreshToken: 'jwt-google-refresh-token',
      },
    };

    apiClient.post.mockResolvedValueOnce(mockGoogleResponse);

    // Call loginWithGoogle (should exist on store)
    expect(typeof useAuthStore.getState().loginWithGoogle).toBe('function');

    await useAuthStore.getState().loginWithGoogle({
      idToken: 'mock-valid-google-id-token',
      profile: {
        email: 'traveler.google@gmail.com',
        fullName: 'Google User',
      },
    });

    const state = useAuthStore.getState();
    expect(apiClient.post).toHaveBeenCalledWith('/auth/google', {
      idToken: 'mock-valid-google-id-token',
      profile: {
        email: 'traveler.google@gmail.com',
        fullName: 'Google User',
      },
    });
    expect(state.isAuthenticated).toBe(true);
    expect(state.isGuest).toBe(false);
    expect(state.user.email).toBe('traveler.google@gmail.com');
    expect(state.accessToken).toBe('jwt-google-access-token');
  });

  test('RED-GOOG-FE-05: LoginScreen google-login-btn triggers Google login flow', async () => {
    const mockGoogleResponse = {
      user: {
        id: 'user-google-456',
        email: 'duc.google@gmail.com',
        fullName: 'Duc Nguyen Google',
      },
      tokens: {
        accessToken: 'token-456',
        refreshToken: 'refresh-456',
      },
    };

    apiClient.post.mockResolvedValueOnce(mockGoogleResponse);

    const { getByTestId } = render(<LoginScreen navigation={{ navigate: jest.fn() }} />);

    const googleBtn = getByTestId('google-login-btn');
    expect(googleBtn).toBeTruthy();

    fireEvent.press(googleBtn);

    await waitFor(() => {
      // Must call google endpoint or trigger loginWithGoogle
      expect(apiClient.post).toHaveBeenCalledWith(
        expect.stringMatching(/\/auth\/google/),
        expect.anything()
      );
    });
  });
});
