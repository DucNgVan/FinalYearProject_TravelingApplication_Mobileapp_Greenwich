import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import AccountSettingsModal from '../../src/screens/account/AccountSettingsModal';
import { useAuthStore } from '../../src/stores/auth.store';

describe('TDD RED: Account Settings Modal Profile Fields Population', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: {
        id: 'u-12345',
        fullName: 'Nguyen Van Duc',
        email: 'ducnv1792005@gmail.com',
        phoneNumber: '0901234567',
        dateOfBirth: '2000-01-15',
        role: 'traveler',
        xp: 100,
        level: 1,
      },
    });
  });

  test('RED-FE-ACCT-01: should display full name, date of birth, phone number, and email in inputs', () => {
    const { getByDisplayValue } = render(
      <AccountSettingsModal visible={true} onClose={jest.fn()} />
    );

    expect(getByDisplayValue('Nguyen Van Duc')).toBeTruthy();
    expect(getByDisplayValue('2000-01-15')).toBeTruthy();
    expect(getByDisplayValue('0901234567')).toBeTruthy();
    expect(getByDisplayValue('ducnv1792005@gmail.com')).toBeTruthy();
  });
});
