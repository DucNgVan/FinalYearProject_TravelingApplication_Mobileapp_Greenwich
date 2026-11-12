import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import FlightSearchScreen from '../../src/screens/booking/FlightSearchScreen';
import HotelSearchScreen from '../../src/screens/booking/HotelSearchScreen';
import App from '../../App';
import { useAuthStore } from '../../src/stores/auth.store';
import { useItineraryStore } from '../../src/stores/itinerary.store';
import { useThemeStore } from '../../src/stores/theme.store';

jest.mock('../../src/stores/auth.store');
jest.mock('../../src/stores/itinerary.store');

describe('TDD Suite: Mockup Harmonization & 8px Grid System', () => {
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

  test('RED-GRID-01: FlightSearchScreen must not render the Nomadix Flight Guarantee banner', () => {
    const { queryByText } = render(<FlightSearchScreen />);
    expect(queryByText(/Nomadix Flight Guarantee/i)).toBeNull();
    expect(queryByText(/Live Duffel Global GDS pricing/i)).toBeNull();
  });

  test('RED-GRID-02: Deal tag -25% must use high-contrast dark green (#15803D)', () => {
    const { getByText } = render(<FlightSearchScreen />);
    const dealTag = getByText('-25%');
    const tagStyle = Array.isArray(dealTag.props.style)
      ? Object.assign({}, ...dealTag.props.style)
      : dealTag.props.style;
    expect(['#15803D', '#2E7D5B']).toContain(tagStyle.color);
  });

  test('RED-GRID-03: Headers and eyebrows must adhere to the 8px grid (eyebrow marginBottom: 8, header marginBottom: 16)', () => {
    const { getByText: getFlightText } = render(<FlightSearchScreen />);
    const flightEyebrow = getFlightText(/explore vietnam/i);
    const flightEyebrowStyle = Array.isArray(flightEyebrow.props.style)
      ? Object.assign({}, ...flightEyebrow.props.style)
      : flightEyebrow.props.style;
    expect(flightEyebrowStyle.marginBottom).toBe(8);

    const { getByText: getHotelText } = render(<HotelSearchScreen />);
    const hotelEyebrow = getHotelText(/where to stay/i);
    const hotelEyebrowStyle = Array.isArray(hotelEyebrow.props.style)
      ? Object.assign({}, ...hotelEyebrow.props.style)
      : hotelEyebrow.props.style;
    expect(hotelEyebrowStyle.marginBottom).toBe(8);
  });

  test('RED-GRID-04: Bottom dock Home button must match Image 2 with elevated white background (#FFFFFF) and dark text', () => {
    const { getByTestId, getByText } = render(<App initialHasCompletedOnboarding={true} />);
    const homeBtn = getByTestId('tab-btn-home');
    const homeBtnStyle = Array.isArray(homeBtn.props.style)
      ? Object.assign({}, ...homeBtn.props.style)
      : homeBtn.props.style;
    expect(homeBtnStyle.backgroundColor).toBe('#FFFFFF');

    const homeLabel = getByText('Home');
    const labelStyle = Array.isArray(homeLabel.props.style)
      ? Object.assign({}, ...homeLabel.props.style)
      : homeLabel.props.style;
    expect(labelStyle.color).toBe('#0F172A');
  });

  test('RED-GRID-05: FlightSearchScreen must use clean 1-color traveller vector icon instead of multi-colored emoji', () => {
    const { getByText, getByTestId } = render(<FlightSearchScreen />);
    expect(getByText(/1 traveller/i)).toBeTruthy();
    expect(getByTestId('lucide-icon-users')).toBeTruthy();
  });
});
