import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import App from '../../App';
import LoginScreen from '../../src/screens/auth/LoginScreen';
import RegisterScreen from '../../src/screens/auth/RegisterScreen';
import OnboardingScreen from '../../src/screens/onboarding/OnboardingScreen';
import { useAuthStore } from '../../src/stores/auth.store';

jest.mock('../../src/stores/auth.store');

describe('TDD Suite: Auth Screens & Onboarding Overhaul', () => {
  const mockLogin = jest.fn();
  const mockRegister = jest.fn();
  const mockContinueAsGuest = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.mockReturnValue({
      user: null,
      isAuthenticated: false,
      isGuest: false,
      isLoading: false,
      error: null,
      login: mockLogin,
      register: mockRegister,
      continueAsGuest: mockContinueAsGuest,
    });
  });

  test('RED-FE-AUTH-01: LoginScreen should render Google social login button and remove Facebook', () => {
    const mockNav = { navigate: jest.fn() };
    const { getByTestId, queryByTestId, getByText, queryByText } = render(<LoginScreen navigation={mockNav} />);

    expect(getByTestId('google-login-btn')).toBeTruthy();
    expect(getByText(/Continue with Google/i)).toBeTruthy();
    expect(queryByTestId('facebook-login-btn')).toBeNull();
    expect(queryByText(/facebook/i)).toBeNull();
  });

  test('RED-FE-AUTH-02: RegisterScreen should render squad headline, subtitle, and all 5 required fields', async () => {
    const mockNav = { navigate: jest.fn() };
    const { getByText, getByPlaceholderText, getByTestId, queryByTestId } = render(<RegisterScreen navigation={mockNav} />);

    // 1. Check Headline & Subtitle matching user specification
    expect(getByText(/Join the squad/i)).toBeTruthy();
    expect(getByText(/Share the journey/i)).toBeTruthy();
    expect(getByText(/Create an account to start planning and splitting expenses seamlessly/i)).toBeTruthy();

    // 2. Check all 5 input fields
    expect(getByPlaceholderText(/full name/i)).toBeTruthy();
    expect(getByPlaceholderText(/date of birth|yyyy-mm-dd/i)).toBeTruthy();
    expect(getByPlaceholderText(/phone number/i)).toBeTruthy();
    expect(getByPlaceholderText(/email/i)).toBeTruthy();
    expect(getByPlaceholderText(/password/i)).toBeTruthy();

    // 3. Check hero background & social buttons
    expect(getByTestId('register-hero-bg')).toBeTruthy();
    expect(getByTestId('google-register-btn')).toBeTruthy();
    expect(queryByTestId('facebook-register-btn')).toBeNull();

    // 4. Fill in 5 fields and submit
    fireEvent.changeText(getByPlaceholderText(/full name/i), 'Alex Wanderer');
    fireEvent.changeText(getByPlaceholderText(/date of birth|yyyy-mm-dd/i), '1998-08-20');
    fireEvent.changeText(getByPlaceholderText(/phone number/i), '+84912345678');
    fireEvent.changeText(getByPlaceholderText(/email/i), 'alex@nomadix.app');
    fireEvent.changeText(getByPlaceholderText(/password/i), 'SecurePass2026!');
    if (queryByTestId('confirm-password-input')) {
      fireEvent.changeText(getByTestId('confirm-password-input'), 'SecurePass2026!');
    }

    fireEvent.press(getByText(/sign up|create account/i));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith(
        expect.objectContaining({
          fullName: 'Alex Wanderer',
          dateOfBirth: '1998-08-20',
          phoneNumber: '+84912345678',
          email: 'alex@nomadix.app',
          password: 'SecurePass2026!',
        })
      );
    });
  });

  test('RED-FE-AUTH-03: OnboardingScreen should render image backgrounds and 3 slides', () => {
    const mockComplete = jest.fn();
    const mockSkip = jest.fn();

    const { getByTestId, getByText, getAllByText } = render(
      <OnboardingScreen onComplete={mockComplete} onSkip={mockSkip} />
    );

    // Slide 1: Book
    expect(getByTestId('onboarding-hero-image-0')).toBeTruthy();
    expect(getByText(/Flights & stays/i)).toBeTruthy();

    // Advance to Slide 2
    fireEvent.press(getByText(/Next/i));
    expect(getByTestId('onboarding-hero-image-1')).toBeTruthy();
    expect(getByText(/Plan the trip/i)).toBeTruthy();
    expect(getAllByText(/Squad of 3/i).length).toBeGreaterThanOrEqual(1);

    // Advance to Slide 3
    fireEvent.press(getByText(/Next/i));
    expect(getByTestId('onboarding-hero-image-2')).toBeTruthy();
    expect(getByText(/Smart group/i)).toBeTruthy();
    expect(getByText(/÷3/i)).toBeTruthy();
  });
});
