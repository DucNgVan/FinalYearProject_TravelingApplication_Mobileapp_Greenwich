import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import RegisterScreen from '../../src/screens/auth/RegisterScreen';
import { useAuthStore } from '../../src/stores/auth.store';

jest.mock('../../src/stores/auth.store');

describe('Component Test: RegisterScreen with OTP Verification', () => {
  const mockRegister = jest.fn();
  const mockSendOtp = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.mockReturnValue({
      register: mockRegister,
      sendOtp: mockSendOtp,
      isLoading: false,
      error: null,
    });
  });

  test('RED-FE-AUTH-OTP-02: RegisterScreen should send OTP and open OtpVerificationModal upon valid form submit', async () => {
    mockSendOtp.mockResolvedValueOnce({
      identifier: 'otpuser@nomadix.vn',
      devOtp: '654321',
      expiresInSeconds: 300,
      cooldownSeconds: 60,
    });

    const { getByPlaceholderText, getByText, getByTestId, findByTestId, queryByTestId } = render(
      <RegisterScreen />
    );

    fireEvent.changeText(getByPlaceholderText(/họ và tên|full name/i), 'Traveler OTP');
    fireEvent.changeText(getByPlaceholderText(/email/i), 'otpuser@nomadix.vn');
    fireEvent.changeText(getByPlaceholderText(/mật khẩu|password/i), 'SecretPass2026!');
    if (queryByTestId('confirm-password-input')) {
      fireEvent.changeText(getByTestId('confirm-password-input'), 'SecretPass2026!');
    }

    // Press Sign Up
    fireEvent.press(getByText(/sign up|đăng ký/i));

    await waitFor(() => {
      expect(mockSendOtp).toHaveBeenCalledWith('otpuser@nomadix.vn', 'email');
    });

    // OtpVerificationModal should be visible
    const modal = await findByTestId('otp-verification-modal');
    expect(modal).toBeTruthy();

    // Enter 6-digit OTP and submit
    fireEvent.changeText(getByTestId('otp-input'), '654321');
    fireEvent.press(getByTestId('otp-submit-btn'));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        fullName: 'Traveler OTP',
        email: 'otpuser@nomadix.vn',
        password: 'SecretPass2026!',
        otp: '654321',
      });
    });
  });
});
