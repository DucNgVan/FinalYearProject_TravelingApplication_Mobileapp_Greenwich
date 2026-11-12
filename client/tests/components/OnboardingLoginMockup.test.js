import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import OnboardingScreen from '../../src/screens/onboarding/OnboardingScreen';
import LoginScreen from '../../src/screens/auth/LoginScreen';

describe('Component Test: Onboarding & Login Mockup Harmonization', () => {
  test('RED-FE-ONB-MOCK-01: OnboardingScreen renders 3 slides and transitions to Login', () => {
    const mockComplete = jest.fn();
    const mockLogin = jest.fn();

    const { getByText } = render(
      <OnboardingScreen onComplete={mockComplete} onSkip={mockLogin} onLogin={mockLogin} />
    );

    // Slide 1: 1 Book
    expect(getByText(/1 Book/i)).toBeTruthy();
    expect(getByText(/Flights & stays,/i)).toBeTruthy();
    expect(getByText('Log In')).toBeTruthy();

    // Advance to Slide 2: 2 Plan
    fireEvent.press(getByText(/Next →/i));
    expect(getByText(/2 Plan/i)).toBeTruthy();
    expect(getByText(/Plan the trip,/i)).toBeTruthy();
    expect(getByText(/Squad of 3/i)).toBeTruthy();

    // Advance to Slide 3: 3 Split
    fireEvent.press(getByText(/Next →/i));
    expect(getByText(/3 Split/i)).toBeTruthy();
    expect(getByText(/Smart group/i)).toBeTruthy();
    expect(getByText(/÷3/i)).toBeTruthy();

    // Complete Onboarding
    fireEvent.press(getByText(/Let's go →/i));
    expect(mockComplete).toHaveBeenCalled();
  });

  test('RED-FE-ONB-MOCK-02: LoginScreen renders Ha Long Bay hero background and login card', () => {
    const mockNav = { navigate: jest.fn() };
    const { getByText, getByTestId, queryByText } = render(<LoginScreen navigation={mockNav} />);

    // Ha Long Bay background container
    expect(getByTestId('login-hero-bg')).toBeTruthy();

    // Brand and headline
    expect(getByText('N')).toBeTruthy();
    expect(getByText(/Travel together\./i)).toBeTruthy();
    expect(getByText(/Split nothing/i)).toBeTruthy();
    expect(getByText(/but joy\./i)).toBeTruthy();

    // 1-Tap demo button was removed per user request
    expect(queryByText(/1-Tap: Vào ngay Demo/i)).toBeNull();

    // Actions
    expect(getByText('Login')).toBeTruthy();
    expect(getByText(/Continue as guest \(Viewer\)/i)).toBeTruthy();
    expect(getByText(/Sign Up/i)).toBeTruthy();
  });
});
