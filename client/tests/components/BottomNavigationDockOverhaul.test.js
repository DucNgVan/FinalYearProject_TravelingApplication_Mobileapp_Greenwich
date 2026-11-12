import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import App from '../../App';
import { useAuthStore } from '../../src/stores/auth.store';
import { useItineraryStore } from '../../src/stores/itinerary.store';
import { useThemeStore } from '../../src/stores/theme.store';

jest.mock('../../src/stores/auth.store');
jest.mock('../../src/stores/itinerary.store');

describe('TDD Suite: Bottom Navigation Dock Overhaul (1-Color Vector Icons & White Home Button)', () => {
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

  test('RED-NAV-01: Center Home button must have elevated white background (#FFFFFF), subtle ring border, and dark text', () => {
    const { getByTestId, getByText } = render(<App initialHasCompletedOnboarding={true} />);

    const homeBtn = getByTestId('tab-btn-home');
    const homeBtnStyle = Array.isArray(homeBtn.props.style)
      ? Object.assign({}, ...homeBtn.props.style)
      : homeBtn.props.style;

    // Home button background must be #FFFFFF in light mode
    expect(homeBtnStyle.backgroundColor).toBe('#FFFFFF');
    expect(homeBtnStyle.borderColor).toBe('#E2E8F0');

    // Label must be dark text #0F172A
    const homeLabel = getByText('Home');
    const labelStyle = Array.isArray(homeLabel.props.style)
      ? Object.assign({}, ...homeLabel.props.style)
      : homeLabel.props.style;
    expect(labelStyle.color).toBe('#0F172A');
  });

  test('RED-NAV-02: Bottom navigation must render 1-color vector LucideIcon components instead of raw emoji characters', () => {
    const { getByTestId, getAllByTestId } = render(<App initialHasCompletedOnboarding={true} />);

    expect(getByTestId('lucide-icon-plane')).toBeTruthy();
    expect(getByTestId('lucide-icon-hotel')).toBeTruthy();
    expect(getByTestId('lucide-icon-map')).toBeTruthy();
    expect(getAllByTestId('lucide-icon-users').length).toBeGreaterThanOrEqual(1);
  });

  test('RED-NAV-03: Active tab uses slate-900 (#0F172A) and inactive tabs use muted slate (#64748B)', () => {
    const { getByTestId } = render(<App initialHasCompletedOnboarding={true} />);

    // Switch to Flights tab
    fireEvent.press(getByTestId('tab-btn-flights'));

    const flightsLabel = getByTestId('tab-label-flights');
    const flightsStyle = Array.isArray(flightsLabel.props.style)
      ? Object.assign({}, ...flightsLabel.props.style)
      : flightsLabel.props.style;
    expect(flightsStyle.color).toBe('#0F172A');

    // Hotels is inactive
    const hotelsLabel = getByTestId('tab-label-hotels');
    const hotelsStyle = Array.isArray(hotelsLabel.props.style)
      ? Object.assign({}, ...hotelsLabel.props.style)
      : hotelsLabel.props.style;
    expect(hotelsStyle.color).toBe('#64748B');
  });
});
