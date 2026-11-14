import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import OtpVerificationModal from '../../src/components/auth/OtpVerificationModal';

describe('Component Test: OtpVerificationModal Demo Features', () => {
  test('RED-FE-OTP-DEMO-01: OtpVerificationModal should default devOtp to "123456" and display autofill banner', () => {
    const { getByTestId, getByText } = render(
      <OtpVerificationModal
        visible={true}
        identifier="demo.tester@nomadix.vn"
        onClose={jest.fn()}
        onVerify={jest.fn()}
      />
    );

    const banner = getByTestId('otp-autofill-banner');
    expect(banner).toBeTruthy();
    expect(getByText(/123456/)).toBeTruthy();
  });

  test('RED-FE-OTP-DEMO-02: Tapping otp-autofill-banner should auto-fill 123456 into cells and trigger onVerify on confirm', () => {
    const handleVerify = jest.fn();
    const { getByTestId, getByText } = render(
      <OtpVerificationModal
        visible={true}
        identifier="demo.tester@nomadix.vn"
        onClose={jest.fn()}
        onVerify={handleVerify}
      />
    );

    // Tap the demo banner
    const banner = getByTestId('otp-autofill-banner');
    fireEvent.press(banner);

    // Press confirm button
    const confirmBtn = getByTestId('otp-submit-btn');
    fireEvent.press(confirmBtn);

    expect(handleVerify).toHaveBeenCalledWith('123456');
  });
});
