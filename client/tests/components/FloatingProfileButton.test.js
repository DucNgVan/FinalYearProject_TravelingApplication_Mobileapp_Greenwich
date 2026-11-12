import React from 'react';
import { render } from '@testing-library/react-native';
import App from '../../App';
import { useAuthStore } from '../../src/stores/auth.store';
import { useItineraryStore } from '../../src/stores/itinerary.store';
import { useThemeStore } from '../../src/stores/theme.store';

jest.mock('../../src/stores/auth.store');
jest.mock('../../src/stores/itinerary.store');

describe('TDD Suite: Floating Profile Button Removal (Eliminate Clutter from Navigation Viewport)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.mockReturnValue({
      user: { id: 'test-user-01', fullName: 'Duc Nguyen', email: 'ducnva.wk@gmail.com' },
      isAuthenticated: true,
      isGuest: false,
      login: jest.fn(),
      register: jest.fn(),
      continueAsGuest: jest.fn(),
      logout: jest.fn(),
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

  test('RED-REMOVE-BTN-01: Floating profile button is completely removed from the DOM (queryByTestId is null)', () => {
    const { queryByTestId } = render(<App initialHasCompletedOnboarding={true} />);

    // Must be completely removed
    expect(queryByTestId('floating-profile-btn')).toBeNull();
    expect(queryByTestId('floating-settings-btn')).toBeNull();
  });
});
