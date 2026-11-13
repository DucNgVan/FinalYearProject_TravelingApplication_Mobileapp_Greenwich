import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import App from '../../App';
import { useAuthStore } from '../../src/stores/auth.store';
import { useItineraryStore } from '../../src/stores/itinerary.store';
import { useThemeStore } from '../../src/stores/theme.store';

jest.mock('../../src/stores/auth.store');
jest.mock('../../src/stores/itinerary.store');

describe('TDD Suite: Floating Profile Button Removal (Eliminate Clutter from Viewport)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.mockReturnValue({
      user: { id: 'test-user', fullName: 'Tester' },
      isAuthenticated: true,
      isGuest: false,
      login: jest.fn(),
      register: jest.fn(),
      continueAsGuest: jest.fn(),
    });
    useItineraryStore.mockReturnValue({
      currentTrip: null,
      trips: [],
      isLoading: false,
      error: null,
      fetchTripDetails: jest.fn(),
      fetchUserTrips: jest.fn(),
      createTrip: jest.fn(),
      addStop: jest.fn(),
      reorderStops: jest.fn(),
      inviteCollaborator: jest.fn(),
      applyAiPlan: jest.fn(),
    });
    useThemeStore.getState().setThemeMode('light');
  });

  test('RED-PROF-POS-01: Floating profile button is removed from the DOM', () => {
    const { queryByTestId } = render(<App initialHasCompletedOnboarding={true} />);
    expect(queryByTestId('floating-profile-btn')).toBeNull();
  });

  test('RED-PROF-POS-02: Profile is cleanly accessible via bottom dock profile button', () => {
    const { getByTestId, getAllByText } = render(<App initialHasCompletedOnboarding={true} />);
    const profileBtn = getByTestId('tab-btn-profile');
    expect(profileBtn).toBeTruthy();
    fireEvent.press(profileBtn);
    expect(getAllByText(/Profile/i).length).toBeGreaterThan(0);
  });
});
