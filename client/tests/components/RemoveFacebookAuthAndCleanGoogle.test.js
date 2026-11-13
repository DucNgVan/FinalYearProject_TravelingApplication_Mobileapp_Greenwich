import React from 'react';
import { render } from '@testing-library/react-native';
import LoginScreen from '../../src/screens/auth/LoginScreen';
import RegisterScreen from '../../src/screens/auth/RegisterScreen';

describe('TDD RED Phase: Removal of Facebook Auth and Google Button Polish', () => {
  test('RED-FB-DEL-01: LoginScreen must NOT render Facebook login button', () => {
    const { queryByTestId, queryByText } = render(<LoginScreen navigation={{ navigate: jest.fn() }} />);

    expect(queryByTestId('facebook-login-btn')).toBeNull();
    expect(queryByText(/facebook/i)).toBeNull();
  });

  test('RED-FB-DEL-02: LoginScreen renders prominent "Continue with Google" button', () => {
    const { getByTestId, getByText } = render(<LoginScreen navigation={{ navigate: jest.fn() }} />);

    expect(getByTestId('google-login-btn')).toBeTruthy();
    expect(getByText(/Continue with Google/i)).toBeTruthy();
  });

  test('RED-FB-DEL-03: RegisterScreen must NOT render Facebook register button', () => {
    const { queryByTestId, queryByText } = render(<RegisterScreen navigation={{ navigate: jest.fn() }} />);

    expect(queryByTestId('facebook-register-btn')).toBeNull();
    expect(queryByText(/facebook/i)).toBeNull();
  });
});
