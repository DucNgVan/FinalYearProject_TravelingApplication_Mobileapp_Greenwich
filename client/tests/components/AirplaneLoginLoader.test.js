import React from 'react';
import { render, act } from '@testing-library/react-native';
import LoginScreen from '../../src/screens/auth/LoginScreen';
import { useAuthStore } from '../../src/stores/auth.store';
import AirplaneLoader from '../../src/components/common/AirplaneLoader';

describe('Frontend Test: Airplane Flight Loading Animation on Login', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
    act(() => {
      useAuthStore.setState({ isLoading: false });
    });
  });

  it('RED-LOGIN-AIRPLANE-01: AirplaneLoader renders animated airplane and flight status message', () => {
    const { getByTestId, getByText } = render(
      <AirplaneLoader visible={true} message="Authenticating Nomadix Traveler..." />
    );

    expect(getByTestId('airplane-loading-animation')).toBeTruthy();
    expect(getByTestId('airplane-loading-glyph')).toBeTruthy();
    expect(getByText('Authenticating Nomadix Traveler...')).toBeTruthy();
  });

  it('RED-LOGIN-AIRPLANE-02: LoginScreen displays NomadixLoadingModal when isLoading is true', () => {
    useAuthStore.setState({ isLoading: true });

    const { getByTestId } = render(
      <LoginScreen navigation={{ navigate: jest.fn() }} />
    );

    expect(getByTestId('nomadix-loading-modal')).toBeTruthy();
  });
});
