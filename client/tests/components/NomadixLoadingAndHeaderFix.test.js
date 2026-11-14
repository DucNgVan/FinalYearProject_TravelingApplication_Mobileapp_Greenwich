import React from 'react';
import { StyleSheet } from 'react-native';
import { render } from '@testing-library/react-native';
import { NomadixLoadingModal } from '../../src/components/common/NomadixLoadingModal';
import LoginScreen from '../../src/screens/auth/LoginScreen';
import SandboxBookingModal from '../../src/components/booking/SandboxBookingModal';
import { useAuthStore } from '../../src/stores/auth.store';
import { useThemeStore } from '../../src/stores/theme.store';

describe('TDD RED: NomadixLoadingModal & SandboxBookingModal Header Harmonization', () => {
  const sampleFlight = {
    id: 'flt-vj-1513',
    airline: 'VietJet Air',
    airlineCode: 'VJ',
    flightNumber: 'VJ-1513',
    origin: 'HAN',
    originCity: 'Hà Nội',
    destination: 'DAD',
    destinationCity: 'Đà Nẵng',
    departureTime: '2026-11-14T22:25:00Z',
    arrivalTime: '2026-11-14T23:45:00Z',
    durationMinutes: 80,
    stops: 0,
    price: { amount: 1168290, currency: 'VND' },
    cabinClass: 'ECONOMY',
  };

  beforeEach(() => {
    jest.useFakeTimers();
    useThemeStore.getState().setThemeMode('light');
    useAuthStore.setState({
      isLoading: false,
      isAuthenticated: false,
      isGuest: false,
      user: null,
    });
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  test('RED-LOAD-MODAL-01: NomadixLoadingModal renders centered modal dialog with brand logo N, nomadix text and status texts', () => {
    const { getByTestId, getByText } = render(
      <NomadixLoadingModal
        visible={true}
        title="Authenticating Nomadix Traveler..."
        subtitle="Nomadix Departure Terminal • Fasten Seatbelt"
      />
    );

    // Modal root
    expect(getByTestId('nomadix-loading-modal')).toBeTruthy();
    // Brand elements
    expect(getByText('N')).toBeTruthy();
    expect(getByText('nomadix')).toBeTruthy();
    // Title and subtitle
    expect(getByText('Authenticating Nomadix Traveler...')).toBeTruthy();
    expect(getByText('Nomadix Departure Terminal • Fasten Seatbelt')).toBeTruthy();
  });

  test('RED-LOGIN-MODAL-02: LoginScreen mounts NomadixLoadingModal on loading state and eliminates old floating card', () => {
    useAuthStore.setState({ isLoading: true });

    const { getByTestId, queryByTestId } = render(<LoginScreen navigation={{ navigate: jest.fn() }} />);

    // New NomadixLoadingModal must be rendered
    expect(getByTestId('nomadix-loading-modal')).toBeTruthy();

    // Old floating bottom card must be completely removed
    expect(queryByTestId('airplane-loading-animation')).toBeNull();
  });

  test('RED-HEADER-HARMONIZE-03: SandboxBookingModal header background matches screen background and back/close buttons are 14px rounded rectangles', () => {
    const { getByTestId } = render(
      <SandboxBookingModal
        visible={true}
        flight={sampleFlight}
        initialStep="fare"
        onClose={jest.fn()}
      />
    );

    // Header container must exist and NOT have black pill styling
    const header = getByTestId('booking-modal-header');
    const flatHeaderStyle = StyleSheet.flatten(header.props.style);
    expect(flatHeaderStyle.backgroundColor).toBe('#F8FAFC'); // light background
    expect(flatHeaderStyle.borderBottomLeftRadius).toBeUndefined();

    // Back button and close button must be 14px rounded rectangle with border
    const backBtn = getByTestId('btn-booking-prev');
    const flatBackBtnStyle = StyleSheet.flatten(backBtn.props.style);
    expect(flatBackBtnStyle.borderRadius).toBe(14);
    expect(flatBackBtnStyle.borderWidth).toBe(1);

    const closeBtn = getByTestId('btn-booking-close');
    const flatCloseBtnStyle = StyleSheet.flatten(closeBtn.props.style);
    expect(flatCloseBtnStyle.borderRadius).toBe(14);
    expect(flatCloseBtnStyle.borderWidth).toBe(1);
  });
});
