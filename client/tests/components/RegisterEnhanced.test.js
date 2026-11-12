import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import RegisterScreen from '../../src/screens/auth/RegisterScreen';
import { useAuthStore } from '../../src/stores/auth.store';

jest.mock('../../src/stores/auth.store');

describe('Component Test: RegisterScreen Enhanced (DOB Dropdown, Confirm Password, Password Criteria)', () => {
  const mockRegister = jest.fn();
  const mockSendOtp = jest.fn();
  const mockLogin = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.mockReturnValue({
      register: mockRegister,
      sendOtp: mockSendOtp,
      login: mockLogin,
      isLoading: false,
      error: null,
    });
  });

  test('RED-REG-DOB-01: should allow selecting Date of Birth via Day, Month, Year dropdowns', async () => {
    const { getByTestId, queryByTestId } = render(<RegisterScreen />);

    // Expect dropdown selector triggers for Day, Month, Year to exist
    const dayDropdown = getByTestId('dob-dropdown-day');
    const monthDropdown = getByTestId('dob-dropdown-month');
    const yearDropdown = getByTestId('dob-dropdown-year');

    expect(dayDropdown).toBeTruthy();
    expect(monthDropdown).toBeTruthy();
    expect(yearDropdown).toBeTruthy();

    // Select Day 15, Month 08, Year 1998
    fireEvent.press(dayDropdown);
    // After opening modal or selecting option
    const dayOption = getByTestId('dob-option-day-15');
    fireEvent.press(dayOption);

    fireEvent.press(monthDropdown);
    const monthOption = getByTestId('dob-option-month-8');
    fireEvent.press(monthOption);

    fireEvent.press(yearDropdown);
    const yearOption = getByTestId('dob-option-year-1998');
    fireEvent.press(yearOption);

    expect(getByTestId('dob-display-value').props.children).toContain('1998-08-15');
  });

  test('RED-REG-NO-CHANNEL-02: should remove channel selector row from form body and auto-verify to email', async () => {
    mockSendOtp.mockResolvedValueOnce({
      identifier: 'wanderer@nomadix.vn',
      devOtp: '123456',
    });

    const { queryByTestId, getByPlaceholderText, getByText, findByTestId } = render(
      <RegisterScreen />
    );

    // Old manual channel buttons should NO LONGER be present in the registration form body
    expect(queryByTestId('channel-selector-row')).toBeNull();

    // Fill valid form
    fireEvent.changeText(getByPlaceholderText(/full name/i), 'Alex Explorer');
    fireEvent.changeText(getByPlaceholderText(/email/i), 'wanderer@nomadix.vn');
    fireEvent.changeText(getByPlaceholderText(/enter your password/i), 'ValidPass123!');
    fireEvent.changeText(getByPlaceholderText(/confirm your password|re-enter/i), 'ValidPass123!');

    // Submit
    fireEvent.press(getByText(/sign up|register/i));

    await waitFor(() => {
      // Must automatically target user email without requiring manual radio channel selection
      expect(mockSendOtp).toHaveBeenCalledWith('wanderer@nomadix.vn', 'email');
    });

    // Otp modal pops up directly
    const otpModal = await findByTestId('otp-verification-modal');
    expect(otpModal).toBeTruthy();
  });

  test('RED-REG-PWD-CRITERIA-03: should validate password strength criteria (>= 8 chars, uppercase, special char)', async () => {
    const { getByPlaceholderText, getByText, findByText, findAllByText, getByTestId } = render(<RegisterScreen />);

    // Criteria checklist badges should be visible
    expect(getByTestId('pwd-rule-length')).toBeTruthy();
    expect(getByTestId('pwd-rule-uppercase')).toBeTruthy();
    expect(getByTestId('pwd-rule-special')).toBeTruthy();

    fireEvent.changeText(getByPlaceholderText(/full name/i), 'Jane Doe');
    fireEvent.changeText(getByPlaceholderText(/email/i), 'jane@nomadix.vn');

    // 1. Password without uppercase letter ('validpass123!')
    fireEvent.changeText(getByPlaceholderText(/enter your password/i), 'lowercase123!');
    fireEvent.changeText(getByPlaceholderText(/confirm your password|re-enter/i), 'lowercase123!');
    fireEvent.press(getByText(/sign up|register/i));

    const upperErrors = await findAllByText(/chữ hoa|uppercase/i);
    expect(upperErrors.length).toBeGreaterThanOrEqual(1);
    expect(mockSendOtp).not.toHaveBeenCalled();

    // 2. Password without special character ('ValidPass123')
    fireEvent.changeText(getByPlaceholderText(/enter your password/i), 'ValidPass123');
    fireEvent.changeText(getByPlaceholderText(/confirm your password|re-enter/i), 'ValidPass123');
    fireEvent.press(getByText(/sign up|register/i));

    const specialErrors = await findAllByText(/ký tự đặc biệt|special character/i);
    expect(specialErrors.length).toBeGreaterThanOrEqual(1);
    expect(mockSendOtp).not.toHaveBeenCalled();
  });

  test('RED-REG-CONFIRM-PWD-04: should require confirm password to match original password', async () => {
    const { getByPlaceholderText, getByText, findByText } = render(<RegisterScreen />);

    fireEvent.changeText(getByPlaceholderText(/full name/i), 'Jane Doe');
    fireEvent.changeText(getByPlaceholderText(/email/i), 'jane@nomadix.vn');
    fireEvent.changeText(getByPlaceholderText(/enter your password/i), 'ValidPass123!');

    // 1. Empty confirm password
    fireEvent.changeText(getByPlaceholderText(/confirm your password|re-enter/i), '');
    fireEvent.press(getByText(/sign up|register/i));

    const emptyError = await findByText(/please confirm your password/i);
    expect(emptyError).toBeTruthy();
    expect(mockSendOtp).not.toHaveBeenCalled();

    // 2. Mismatched confirm password
    fireEvent.changeText(getByPlaceholderText(/confirm your password|re-enter/i), 'DifferentPass123!');
    fireEvent.press(getByText(/sign up|register/i));

    const mismatchError = await findByText(/passwords do not match/i);
    expect(mismatchError).toBeTruthy();
    expect(mockSendOtp).not.toHaveBeenCalled();
  });

  test('RED-REG-I18N-01: should render all labels, dropdown triggers, and criteria in pure English', () => {
    const { getByTestId, getByText, queryByText } = render(<RegisterScreen />);

    // Dropdown triggers must be in English
    expect(getByText('Day ▾')).toBeTruthy();
    expect(getByText('Month ▾')).toBeTruthy();
    expect(getByText('Year ▾')).toBeTruthy();

    // Password criteria checklist must be in pure English
    expect(getByText('At least 8 characters')).toBeTruthy();
    expect(getByText('At least 1 uppercase letter')).toBeTruthy();
    expect(getByText('At least 1 special character')).toBeTruthy();

    // Vietnamese strings must NOT appear
    expect(queryByText(/Ngày ▾/)).toBeNull();
    expect(queryByText(/Tháng ▾/)).toBeNull();
    expect(queryByText(/Năm ▾/)).toBeNull();
    expect(queryByText(/Ít nhất 8 ký tự/)).toBeNull();
  });
});
