import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from '../../src/screens/auth/LoginScreen';
import { useAuthStore } from '../../src/stores/auth.store';

jest.mock('../../src/stores/auth.store');

describe('Component Test: LoginScreen', () => {
  const mockLogin = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.mockReturnValue({
      login: mockLogin,
      isLoading: false,
      error: null,
    });
  });

  test('RED-FE-07: LoginScreen should render email input, password input, and submit button', () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);

    expect(getByPlaceholderText(/email/i)).toBeTruthy();
    expect(getByPlaceholderText(/mật khẩu|password/i)).toBeTruthy();
    expect(getByText(/đăng nhập|login/i)).toBeTruthy();
  });

  test('RED-FE-08: LoginScreen should display validation error when submitting with empty or invalid email', async () => {
    const { getByText, findByText } = render(<LoginScreen />);

    const submitButton = getByText(/đăng nhập|login/i);
    fireEvent.press(submitButton);

    const errorMessage = await findByText(/vui lòng nhập email hợp lệ|invalid email/i);
    expect(errorMessage).toBeTruthy();
    expect(mockLogin).not.toHaveBeenCalled();
  });

  test('RED-FE-09: LoginScreen should trigger login store action with valid credentials', async () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);

    fireEvent.changeText(getByPlaceholderText(/email/i), 'traveler@nomadix.vn');
    fireEvent.changeText(getByPlaceholderText(/mật khẩu|password/i), 'CorrectPassword2026!');
    fireEvent.press(getByText(/đăng nhập|login/i));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('traveler@nomadix.vn', 'CorrectPassword2026!');
    });
  });

  test('should display validation error when password is empty', async () => {
    const { getByPlaceholderText, getByText, findByText } = render(<LoginScreen />);

    fireEvent.changeText(getByPlaceholderText(/email/i), 'traveler@nomadix.vn');
    fireEvent.press(getByText(/đăng nhập|login/i));

    const errorMessage = await findByText(/vui lòng nhập mật khẩu|Please enter your password/i);
    expect(errorMessage).toBeTruthy();
    expect(mockLogin).not.toHaveBeenCalled();
  });

  test('does not display quick demo login button', () => {
    const { queryByText } = render(<LoginScreen />);
    expect(queryByText(/1-Tap: Vào ngay Demo/i)).toBeNull();
  });
});
