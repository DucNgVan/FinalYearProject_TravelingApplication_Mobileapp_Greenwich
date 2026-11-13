import React from 'react';
import { StyleSheet } from 'react-native';
import { render, fireEvent, within } from '@testing-library/react-native';
import HomeScreen from '../../src/screens/home/HomeScreen';
import ProfileScreen from '../../src/screens/account/ProfileScreen';
import App from '../../App';
import FlightSearchScreen from '../../src/screens/booking/FlightSearchScreen';
import HotelSearchScreen from '../../src/screens/booking/HotelSearchScreen';
import { useThemeStore } from '../../src/stores/theme.store';
import { useItineraryStore } from '../../src/stores/itinerary.store';
import { useBookingStore } from '../../src/stores/booking.store';
import { useAuthStore } from '../../src/stores/auth.store';

describe('TDD RED Phase: HomeScreen, ProfileScreen, Bottom Dock & Pre-Search Harmonization', () => {
  beforeEach(() => {
    useThemeStore.getState().setThemeMode('light');
    useItineraryStore.setState({ trips: [], currentTrip: null });
    useBookingStore.setState({ flights: [], hotels: [] });
    useAuthStore.setState({
      user: { fullName: 'Alex Rivers', email: 'alex@example.com', role: 'Explorer' },
      isAuthenticated: true,
      isGuest: false,
    });
  });

  test('RED-HOME-01: HomeScreen header renders bell icon and removes profile avatar button', () => {
    const { getByTestId, queryByTestId } = render(<HomeScreen />);
    expect(getByTestId('home-bell-btn')).toBeTruthy();
    // Avatar profile button in header should be removed
    expect(queryByTestId('home-avatar-btn')).toBeNull();
  });

  test('RED-HOME-02: HomeScreen has #F8FAFC light canvas, rounded elements, and replaces shortcuts with Travel Radar & Weather', () => {
    const { getByTestId, queryByTestId, getByText, getAllByText } = render(<HomeScreen />);
    // Replaced quick shortcuts with Travel Radar & Weather widget
    expect(getByTestId('home-travel-radar-widget')).toBeTruthy();
    expect(getByText(/TRAVEL RADAR & WEATHER/i)).toBeTruthy();
    expect(getAllByText(/Da Nang|Đà Nẵng/i).length).toBeGreaterThan(0);
    expect(getAllByText(/Sunny|28°C/i).length).toBeGreaterThan(0);

    // Redundant 4 quick shortcuts should be removed
    expect(queryByTestId('quick-shortcuts')).toBeNull();
    expect(queryByTestId('home-service-flights')).toBeNull();
    expect(queryByTestId('home-service-hotels')).toBeNull();
    expect(queryByTestId('home-service-plan')).toBeNull();
    expect(queryByTestId('home-service-squad')).toBeNull();
  });

  test('RED-HOME-03: HomeScreen hero card displays suggestion when no trip exists, and active plan when trips exist', () => {
    // 1. When trips is empty -> suggestion card
    useItineraryStore.setState({ trips: [] });
    const { getByTestId, queryByText, rerender, getByText } = render(<HomeScreen />);
    expect(getByTestId('hero-suggestion-card')).toBeTruthy();
    expect(getByText(/FEATURED EXPEDITION|SUGGESTED JOURNEY|DISCOVER/i)).toBeTruthy();
    expect(getByText(/Plan This Trip|Start Planning/i)).toBeTruthy();

    // 2. When trips has a plan -> renders active user trip
    useItineraryStore.setState({
      trips: [
        {
          id: 'trip-hanoi-99',
          title: 'Hanoi Autumn Voyage',
          destination: 'Hanoi',
          days: [{ dayIndex: 0, items: [{}, {}] }, { dayIndex: 1, items: [{}] }],
          coverImage: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93',
        },
      ],
    });
    rerender(<HomeScreen />);
    expect(getByText('Hanoi Autumn Voyage')).toBeTruthy();
    expect(getByText(/2 days/i)).toBeTruthy();
  });

  test('RED-PROFILE-01: ProfileScreen renders clean ACCOUNT eyebrow and refined white personal card in light mode', () => {
    const { getByTestId, getByText } = render(<ProfileScreen />);
    
    // Header eyebrow
    const eyebrow = getByText(/^ACCOUNT$/i);
    expect(eyebrow).toBeTruthy();

    // User personal card
    const userCard = getByTestId('profile-user-card');
    expect(userCard).toBeTruthy();
    // Card in light mode should NOT be dark navy #0E1B2C
    const cardBg = StyleSheet?.flatten ? StyleSheet.flatten(userCard.props.style).backgroundColor : userCard.props.style.find(s => s?.backgroundColor)?.backgroundColor;
    // Should be #FFFFFF in light mode
    expect(cardBg).toBe('#FFFFFF');

    // Clean stats
    expect(getByTestId('profile-stat-trips')).toBeTruthy();
    expect(getByTestId('profile-stat-checkins')).toBeTruthy();
    expect(getByTestId('profile-stat-badges')).toBeTruthy();
  });

  test('RED-PROFILE-02: ProfileScreen removes obsolete duplicate My Booked Flights card and KYC list card', () => {
    const { queryByText, queryByTestId } = render(<ProfileScreen />);
    // Duplicate ✈ My Booked Flights section should be deleted
    expect(queryByText(/✈ My Booked Flights/i)).toBeNull();
    // Duplicate old KYC / Bank Account / Notifications card should be deleted
    expect(queryByText(/Identity Verification \(KYC\)/i)).toBeNull();
    expect(queryByText(/Bank Account for Debt Settlements/i)).toBeNull();
    expect(queryByText(/Notifications & Squad Invites/i)).toBeNull();
  });

  test('RED-DOCK-01: App bottom dock center Home button sits level in the dock and shows Nomadix N logo', () => {
    const { getByTestId, queryByTestId, getByText } = render(<App />);
    const homeBtn = getByTestId('tab-btn-home');
    expect(homeBtn).toBeTruthy();

    // Check style has marginTop: 0 (or no negative margin)
    const flatStyle = Array.isArray(homeBtn.props.style) ? Object.assign({}, ...homeBtn.props.style) : homeBtn.props.style;
    expect(flatStyle.marginTop === undefined || flatStyle.marginTop >= 0).toBe(true);

    // Shows Nomadix letter "N" logo badge
    const nBadge = getByTestId('center-home-logo-n');
    expect(nBadge).toBeTruthy();
    expect(within(nBadge).getByText('N')).toBeTruthy();
  });

  test('RED-SEARCH-PRE-01: FlightSearchScreen displays Popular Direct Routes & HotelSearchScreen shows Nearby Stays', () => {
    // 1. FlightSearchScreen pre-search state has Popular Direct Routes
    const { getByTestId, getByText: getFlightText } = render(<FlightSearchScreen />);
    expect(getByTestId('popular-direct-routes-section')).toBeTruthy();
    expect(getFlightText(/Popular Direct Routes/i)).toBeTruthy();

    // 2. HotelSearchScreen pre-search state displays nearby stays
    const { getByTestId: getHotelTestId, getByText: getHotelText } = render(<HotelSearchScreen />);
    expect(getHotelTestId('nearby-stays-section')).toBeTruthy();
    expect(getHotelText(/Nearby Stays Around You|Popular Stays in Da Nang/i)).toBeTruthy();
  });
});
