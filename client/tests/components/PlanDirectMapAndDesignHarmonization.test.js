import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import PlanScreen from '../../src/screens/plan/PlanScreen';
import PlanMapDiscovery from '../../src/components/plan/PlanMapDiscovery';
import OtpVerificationModal from '../../src/components/auth/OtpVerificationModal';
import RegisterScreen from '../../src/screens/auth/RegisterScreen';
import { useItineraryStore } from '../../src/stores/itinerary.store';
import { usePlacesStore } from '../../src/stores/places.store';
import { useAuthStore } from '../../src/stores/auth.store';

jest.mock('../../src/stores/auth.store');

describe('Plan Direct Map & Design Harmonization & OTP AutoFill (TDD RED Phase)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.mockReturnValue({
      user: null,
      register: jest.fn(),
      sendOtp: jest.fn().mockResolvedValue({ identifier: 'test@nomadix.vn', devOtp: '998877' }),
      isLoading: false,
      error: null,
    });
  });

  test('RED-FE-PLAN-DIRECT-MAP-01: PlanScreen should display saved plans empty state and enter PlanMapDiscovery on press', () => {
    useItineraryStore.setState({ currentTrip: null, trips: [] });
    const { getByTestId, queryByText, getByText } = render(<PlanScreen />);

    // Must show empty state initially
    expect(getByTestId('saved-trips-empty-state')).toBeTruthy();
    expect(queryByText('No Travel Plan Yet')).toBeNull();

    // Tap to enter map discovery
    fireEvent.press(getByText(/✨ Plan a Trip/i));
    expect(getByTestId('mapbox-canvas-image')).toBeTruthy();
  });

  test('RED-FE-PLAN-NO-BACK-BTN-02: PlanScreen creation mode has clean return to saved plans list', () => {
    useItineraryStore.setState({ currentTrip: null, trips: [] });
    const { getByText, getByTestId } = render(<PlanScreen />);

    fireEvent.press(getByText(/✨ Plan a Trip/i));
    expect(getByTestId('plan-back-to-list-btn')).toBeTruthy();

    fireEvent.press(getByTestId('plan-back-to-list-btn'));
    expect(getByTestId('saved-trips-list')).toBeTruthy();
  });

  test('RED-FE-MAP-NO-ENGINE-BAR-03: PlanMapDiscovery should NOT render the Mapbox Vector Engine or List View overlay bar', () => {
    const mockPlaces = [
      { id: 'p1', name: 'Place 1', category: 'landmark', city: 'Hanoi' },
    ];
    const { queryByText, queryByTestId } = render(
      <PlanMapDiscovery
        places={mockPlaces}
        selectedPlaceIds={new Set()}
        onTogglePlace={jest.fn()}
        onGenerateAiPlan={jest.fn()}
      />
    );

    expect(queryByText(/Mapbox Vector Engine/i)).toBeNull();
    expect(queryByTestId('map-view-mode-toggle')).toBeNull();
  });

  test('RED-FE-OTP-AUTOFILL-04: OtpVerificationModal should support 1-tap auto-fill when tapping devOtp banner', () => {
    const handleVerify = jest.fn();
    const { getByTestId } = render(
      <OtpVerificationModal
        visible={true}
        identifier="traveler@nomadix.vn"
        devOtp="887766"
        onClose={jest.fn()}
        onVerify={handleVerify}
        onResend={jest.fn()}
      />
    );

    // Tap the auto-fill banner
    const autoFillBanner = getByTestId('otp-autofill-banner');
    fireEvent.press(autoFillBanner);

    // Press Submit
    fireEvent.press(getByTestId('otp-submit-btn'));
    expect(handleVerify).toHaveBeenCalledWith('887766');
  });

  test('RED-FE-AUTH-CHANNEL-05: RegisterScreen should allow choosing verification channel (Email vs Phone Number)', () => {
    const { getByTestId, getByText } = render(<RegisterScreen />);

    expect(getByTestId('channel-email-btn')).toBeTruthy();
    expect(getByTestId('channel-phone-btn')).toBeTruthy();
  });
});
