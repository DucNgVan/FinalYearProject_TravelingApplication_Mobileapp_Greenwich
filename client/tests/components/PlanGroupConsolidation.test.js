import React from 'react';
import { render } from '@testing-library/react-native';
import App from '../../App';
import PlanScreen from '../../src/screens/plan/PlanScreen';
import { useAuthStore } from '../../src/stores/auth.store';
import { useItineraryStore } from '../../src/stores/itinerary.store';

describe('Plan & Group Consolidation (RED Phase)', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: { id: 'usr-1', fullName: 'Duc Nguyen', email: 'duc@nomadix.app' },
      isAuthenticated: true,
      isGuest: false,
    });
  });

  test('RED-CONSOL-01: App.js renders 5 balanced bottom tabs (Flights, Hotels, Home, Plan, Profile) without an orphaned Group tab', () => {
    const { getByTestId, queryByTestId } = render(<App initialHasCompletedOnboarding={true} />);

    expect(getByTestId('tab-btn-flights')).toBeTruthy();
    expect(getByTestId('tab-btn-hotels')).toBeTruthy();
    expect(getByTestId('tab-btn-home')).toBeTruthy();
    expect(getByTestId('tab-btn-plan')).toBeTruthy();
    expect(getByTestId('tab-btn-profile')).toBeTruthy();

    // Group is consolidated into Plan, not a separate bottom tab
    expect(queryByTestId('tab-btn-group')).toBeNull();
  });

  test('RED-CONSOL-02: PlanScreen includes shared packing & squad checklist in the itinerary/squad workspace', () => {
    useItineraryStore.setState({
      currentTrip: {
        id: 'trip-1',
        title: 'Chuyến đi Đà Nẵng',
        days: [
          {
            dayNumber: 1,
            date: '2026-11-20',
            stops: [],
          },
        ],
        collaborators: [
          { userId: 'usr-1', role: 'OWNER', status: 'ACCEPTED' },
        ],
      },
    });

    const { getByTestId, getByText } = render(<PlanScreen />);
    expect(getByTestId('shared-packing-checklist')).toBeTruthy();
    expect(getByText(/Shared Packing Checklist/i)).toBeTruthy();
  });
});
