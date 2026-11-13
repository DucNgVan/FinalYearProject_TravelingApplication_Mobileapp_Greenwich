import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import AccountSettingsModal from '../../../src/screens/account/AccountSettingsModal';
import { useAuthStore } from '../../../src/stores/auth.store';

describe('TDD RED Phase: AccountSettingsModal (Profile Info, Phone, Email, Password)', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: {
        id: 'usr-123',
        fullName: 'John Doe',
        email: 'traveler@nomadix.app',
        phone: '0901234567',
        dateOfBirth: '15/10/2002',
      },
      updateProfile: jest.fn(),
      changePassword: jest.fn(),
    });
  });

  test('RED-ACC-01: renders fields for full name, date of birth, phone, email and password', () => {
    const { getByText, getByPlaceholderText, getByTestId } = render(
      <AccountSettingsModal visible={true} onClose={() => {}} />
    );

    expect(getByText('Account Settings')).toBeTruthy();
    expect(getByPlaceholderText('Enter your full name')).toBeTruthy();
    expect(getByPlaceholderText('DD/MM/YYYY')).toBeTruthy();
    expect(getByPlaceholderText('Enter phone number')).toBeTruthy();
    expect(getByPlaceholderText('Enter your email')).toBeTruthy();
    expect(getByPlaceholderText('Current password')).toBeTruthy();
    expect(getByPlaceholderText('New password (min 8 characters)')).toBeTruthy();
    expect(getByPlaceholderText('Confirm new password')).toBeTruthy();
    expect(getByTestId('btn-save-account-settings')).toBeTruthy();
  });

  test('RED-ACC-02: updates profile fields when saving changes', () => {
    const mockUpdate = jest.fn();
    useAuthStore.setState({
      user: {
        id: 'usr-123',
        fullName: 'John Doe',
        email: 'traveler@nomadix.app',
      },
      updateProfile: mockUpdate,
    });

    const { getByTestId, getByPlaceholderText } = render(
      <AccountSettingsModal visible={true} onClose={() => {}} />
    );

    const nameInput = getByPlaceholderText('Enter your full name');
    fireEvent.changeText(nameInput, 'Nguyen Van Duc');

    const phoneInput = getByPlaceholderText('Enter phone number');
    fireEvent.changeText(phoneInput, '0987654321');

    fireEvent.press(getByTestId('btn-save-account-settings'));
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        fullName: 'Nguyen Van Duc',
        phone: '0987654321',
      })
    );
  });
});
