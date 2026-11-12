import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

let OtpVerificationModal;
try {
  OtpVerificationModal = require('../../src/components/auth/OtpVerificationModal').default;
} catch (e) {
  OtpVerificationModal = null;
}

describe('Component Test: OtpVerificationModal (TDD RED Phase)', () => {
  test('RED-FE-OTP-01: should render modal with 6-digit input, title, and target identifier', () => {
    expect(OtpVerificationModal).not.toBeNull();
    const { getByTestId, getByText } = render(
      <OtpVerificationModal
        visible={true}
        identifier="traveler@nomadix.vn"
        onClose={jest.fn()}
        onVerify={jest.fn()}
        onResend={jest.fn()}
      />
    );

    expect(getByTestId('otp-verification-modal')).toBeTruthy();
    expect(getByText(/traveler@nomadix.vn/i)).toBeTruthy();
    expect(getByTestId('otp-input')).toBeTruthy();
    expect(getByTestId('otp-submit-btn')).toBeTruthy();
  });

  test('RED-FE-OTP-02: should call onVerify with 6-digit OTP when submit is pressed', () => {
    expect(OtpVerificationModal).not.toBeNull();
    const handleVerify = jest.fn();
    const { getByTestId } = render(
      <OtpVerificationModal
        visible={true}
        identifier="traveler@nomadix.vn"
        onClose={jest.fn()}
        onVerify={handleVerify}
        onResend={jest.fn()}
      />
    );

    fireEvent.changeText(getByTestId('otp-input'), '123456');
    fireEvent.press(getByTestId('otp-submit-btn'));

    expect(handleVerify).toHaveBeenCalledWith('123456');
  });

  test('RED-FE-OTP-03: should call onResend when resend button is clicked', () => {
    expect(OtpVerificationModal).not.toBeNull();
    const handleResend = jest.fn();
    const { getByTestId } = render(
      <OtpVerificationModal
        visible={true}
        identifier="traveler@nomadix.vn"
        initialCooldown={0}
        onClose={jest.fn()}
        onVerify={jest.fn()}
        onResend={handleResend}
      />
    );

    fireEvent.press(getByTestId('otp-resend-btn'));
    expect(handleResend).toHaveBeenCalledTimes(1);
  });
});
