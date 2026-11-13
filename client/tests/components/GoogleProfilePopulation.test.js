import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import ProfileScreen from '../../src/screens/account/ProfileScreen';
import LoginScreen from '../../src/screens/auth/LoginScreen';
import AccountSettingsModal from '../../src/screens/account/AccountSettingsModal';
import { useAuthStore } from '../../src/stores/auth.store';

describe('Google Profile Population & Avatar Display (TDD RED State)', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
      isGuest: false,
      error: null,
      isLoading: false,
    });
  });

  test('RED-FE-GOOG-01: ProfileScreen renders avatar image when user has avatarUrl', () => {
    useAuthStore.setState({
      user: {
        id: 'usr-goog-101',
        fullName: 'Nguyễn Văn Đức',
        email: 'ducnva.wk@gmail.com',
        avatarUrl: 'https://lh3.googleusercontent.com/a/ACg8ocK-real-google-photo',
        role: 'traveler',
        authProvider: 'google',
        isEmailVerified: true,
      },
      isAuthenticated: true,
    });

    const { getByTestId, queryByTestId } = render(<ProfileScreen />);

    // Must render avatar image with exact google photo uri
    const avatarImg = getByTestId('profile-avatar-image');
    expect(avatarImg).toBeTruthy();
    expect(avatarImg.props.source).toEqual({
      uri: 'https://lh3.googleusercontent.com/a/ACg8ocK-real-google-photo',
    });

    // Should not show letter initial when avatar image is present
    expect(queryByTestId('profile-avatar-initial')).toBeNull();
  });

  test('RED-FE-GOOG-02: ProfileScreen and AccountSettingsModal display real Google user details', () => {
    useAuthStore.setState({
      user: {
        id: 'usr-goog-102',
        fullName: 'Nguyễn Văn Đức',
        email: 'ducnva.wk@gmail.com',
        avatarUrl: 'https://lh3.googleusercontent.com/a/ACg8ocK-avatar',
        role: 'traveler',
        authProvider: 'google',
        isEmailVerified: true,
      },
      isAuthenticated: true,
    });

    const profile = render(<ProfileScreen />);
    expect(profile.getByText('Nguyễn Văn Đức')).toBeTruthy();
    expect(profile.getByText('ducnva.wk@gmail.com')).toBeTruthy();

    const settings = render(<AccountSettingsModal visible={true} onClose={jest.fn()} />);
    // Check Full Name and Email inputs contain Google user info
    const nameInput = settings.getByDisplayValue('Nguyễn Văn Đức');
    const emailInput = settings.getByDisplayValue('ducnva.wk@gmail.com');
    expect(nameInput).toBeTruthy();
    expect(emailInput).toBeTruthy();
  });

  test('RED-FE-GOOG-03: LoginScreen handleGoogleLogin passes authentic profile with avatarUrl into loginWithGoogle', async () => {
    const mockLoginWithGoogle = jest.fn().mockResolvedValue({
      user: {
        fullName: 'Nguyễn Văn Đức',
        email: 'ducnva.wk@gmail.com',
        avatarUrl: 'https://lh3.googleusercontent.com/a/ACg8ocK-photo',
      },
    });

    useAuthStore.setState({
      loginWithGoogle: mockLoginWithGoogle,
    });

    const { getByTestId } = render(<LoginScreen />);
    const googleBtn = getByTestId('google-login-btn');

    await act(async () => {
      fireEvent.press(googleBtn);
    });

    expect(mockLoginWithGoogle).toHaveBeenCalledTimes(1);
    const callArg = mockLoginWithGoogle.mock.calls[0][0];
    expect(callArg.profile).toBeDefined();
    expect(callArg.profile.fullName).not.toBe('Google User');
    expect(callArg.profile.email).not.toBe('traveler.google@gmail.com');
    expect(callArg.profile.avatarUrl || callArg.profile.photoUrl || callArg.profile.picture).toBeTruthy();
  });
});
