import React from 'react';
import { render } from '@testing-library/react-native';
import App from '../../App';
import LoginScreen from '../../src/screens/auth/LoginScreen';
import RegisterScreen from '../../src/screens/auth/RegisterScreen';
import { useAuthStore } from '../../src/stores/auth.store';
import { useThemeStore } from '../../src/stores/theme.store';

jest.mock('../../src/stores/auth.store');

describe('TDD Suite: Auth Edge-to-Edge Full Bleed (Zero Letterboxing at Top & Bottom)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.mockReturnValue({
      user: null,
      isAuthenticated: false,
      isGuest: false,
      login: jest.fn(),
      register: jest.fn(),
      continueAsGuest: jest.fn(),
    });
    useThemeStore.getState().setThemeMode('light');
  });

  test('RED-EDGE-01: App auth wrapper uses empty edges ({[]}) to allow full-bleed background and translucent status bar', () => {
    const { UNSAFE_getByType } = render(
      <App initialHasCompletedOnboarding={true} />
    );

    // Look for SafeAreaView in the auth tree
    const { SafeAreaView } = require('react-native-safe-area-context');
    const safeAreaViews = UNSAFE_getByType(SafeAreaView);

    // edges prop must be empty or not contain 'top'/'bottom' restricting full-bleed hero
    expect(safeAreaViews.props.edges).toEqual([]);
  });

  test('RED-EDGE-02: LoginScreen card anchors to the bottom as a seamless Bottom Sheet (zero bottom radius)', () => {
    const { getByTestId } = render(<LoginScreen navigation={{ navigate: jest.fn() }} />);

    const card = getByTestId('login-card');
    const flatStyle = Array.isArray(card.props.style)
      ? Object.assign({}, ...card.props.style)
      : card.props.style;

    // Must be flat at bottom to seamlessly fill the bottom of the screen
    expect(flatStyle.borderBottomLeftRadius).toBe(0);
    expect(flatStyle.borderBottomRightRadius).toBe(0);
    expect(flatStyle.borderTopLeftRadius).toBeGreaterThanOrEqual(28);
    expect(flatStyle.borderTopRightRadius).toBeGreaterThanOrEqual(28);
  });

  test('RED-EDGE-03: RegisterScreen card anchors to the bottom as a seamless Bottom Sheet (zero bottom radius)', () => {
    const { getByTestId } = render(<RegisterScreen navigation={{ navigate: jest.fn() }} />);

    const card = getByTestId('register-card');
    const flatStyle = Array.isArray(card.props.style)
      ? Object.assign({}, ...card.props.style)
      : card.props.style;

    expect(flatStyle.borderBottomLeftRadius).toBe(0);
    expect(flatStyle.borderBottomRightRadius).toBe(0);
    expect(flatStyle.borderTopLeftRadius).toBeGreaterThanOrEqual(28);
    expect(flatStyle.borderTopRightRadius).toBeGreaterThanOrEqual(28);
  });
});
