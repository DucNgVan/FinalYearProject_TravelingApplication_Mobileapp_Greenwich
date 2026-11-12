import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import OnboardingScreen from '../../src/screens/onboarding/OnboardingScreen';

describe('Component Test: Pre-Login 3-Tab Onboarding Flow (Book, Plan, Split)', () => {
  const mockOnComplete = jest.fn();
  const mockOnSkip = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('RED-ONBOARDING-01: Renders Slide 1 (Book: Flights & stays, in one swipe)', () => {
    const { getByText, getByTestId } = render(
      <OnboardingScreen onComplete={mockOnComplete} onSkip={mockOnSkip} />
    );

    expect(getByText(/Flights & stays, in one swipe/i)).toBeTruthy();
    expect(getByText(/Compare fares, pick your seat and lock in a hotel/i)).toBeTruthy();
    expect(getByText(/SGN → DAD/i)).toBeTruthy();
    expect(getByText(/3 nights · 4.9★/i)).toBeTruthy();
    expect(getByText(/Next →/i)).toBeTruthy();
    expect(getByTestId('onboarding-slide-0')).toBeTruthy();
  });

  test('RED-ONBOARDING-02: Pressing "Next →" advances to Slide 2 (Plan the trip, together)', () => {
    const { getByText, getByTestId, queryByText } = render(
      <OnboardingScreen onComplete={mockOnComplete} onSkip={mockOnSkip} />
    );

    const nextBtn = getByText(/Next →/i);
    fireEvent.press(nextBtn);

    expect(getByText(/Plan the trip, together/i)).toBeTruthy();
    expect(getByText(/Everyone edits one live itinerary/i)).toBeTruthy();
    expect(getByText(/Squad of 3/i)).toBeTruthy();
    expect(getByText(/My Khe Beach/i)).toBeTruthy();
    expect(getByTestId('onboarding-slide-1')).toBeTruthy();
  });

  test('RED-ONBOARDING-03: Advancing to Slide 3 displays (Smart group expense split) with "Let\'s go →"', () => {
    const { getByText, getByTestId } = render(
      <OnboardingScreen onComplete={mockOnComplete} onSkip={mockOnSkip} />
    );

    // Slide 1 -> Slide 2
    fireEvent.press(getByText(/Next →/i));
    // Slide 2 -> Slide 3
    fireEvent.press(getByText(/Next →/i));

    expect(getByText(/Smart group expense split/i)).toBeTruthy();
    expect(getByText(/Nomadix untangles who owes whom/i)).toBeTruthy();
    expect(getByText(/2 payments, not 6/i)).toBeTruthy();
    expect(getByText(/An pays Duc · 800k đ/i)).toBeTruthy();
    expect(getByText(/Let's go →/i)).toBeTruthy();
    expect(getByTestId('onboarding-slide-2')).toBeTruthy();
  });

  test('RED-ONBOARDING-04: Pressing "Let\'s go →" invokes onComplete callback to proceed to Login', () => {
    const { getByText } = render(
      <OnboardingScreen onComplete={mockOnComplete} onSkip={mockOnSkip} />
    );

    // Advance to Slide 3
    fireEvent.press(getByText(/Next →/i));
    fireEvent.press(getByText(/Next →/i));

    // Tap "Let's go →"
    const letsGoBtn = getByText(/Let's go →/i);
    fireEvent.press(letsGoBtn);

    expect(mockOnComplete).toHaveBeenCalledTimes(1);
  });

  test('RED-ONBOARDING-05: Pressing "Skip" or "Log In" immediately triggers onSkip', () => {
    const { getByText } = render(
      <OnboardingScreen onComplete={mockOnComplete} onSkip={mockOnSkip} />
    );

    const skipBtn = getByText(/Skip|Log In/i);
    fireEvent.press(skipBtn);

    expect(mockOnSkip).toHaveBeenCalledTimes(1);
  });
});
