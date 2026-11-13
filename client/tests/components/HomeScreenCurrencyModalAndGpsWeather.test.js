import React from 'react';
import { render, fireEvent, within } from '@testing-library/react-native';
import HomeScreen from '../../src/screens/home/HomeScreen';
import HotelSearchScreen from '../../src/screens/booking/HotelSearchScreen';
import App from '../../App';
import { useCurrencyStore } from '../../src/stores/currency.store';
import { useItineraryStore } from '../../src/stores/itinerary.store';
import { useThemeStore } from '../../src/stores/theme.store';
import { useAuthStore } from '../../src/stores/auth.store';

describe('Component Test: Currency Modal Picker, GPS Weather 4-Day Forecast & Badges Removal', () => {
  beforeEach(() => {
    useThemeStore.getState().setThemeMode('light');
    useItineraryStore.setState({ trips: [] });
    useAuthStore.setState({
      user: { id: 'usr-1', fullName: 'Duc Nguyen', email: 'ducnva.wk@gmail.com' },
      isAuthenticated: true,
      isGuest: false,
    });
    useCurrencyStore.setState({
      base: 'USD',
      rates: {
        USD: 1,
        EUR: 0.8661,
        VND: 25400,
        JPY: 154.2,
        GBP: 0.78,
        SGD: 1.34,
        THB: 34.5,
        AUD: 1.52,
      },
      lastUpdated: '2026-11-13',
      isLoading: false,
      error: null,
      isLive: true,
    });
  });

  test('RED-CURR-MODAL-01: Tapping From and To currency badges opens Currency Picker Modal to choose currencies', () => {
    const { getByTestId, getByText, queryByTestId } = render(<HomeScreen />);

    // Initially currency picker modal is not open
    expect(queryByTestId('currency-picker-modal')).toBeNull();

    // 1. Tap From currency button (e.g. from USD or EUR)
    const fromSelectBtn = getByTestId('currency-from-select');
    expect(fromSelectBtn).toBeTruthy();
    fireEvent.press(fromSelectBtn);

    // Modal is now visible with available currencies
    expect(getByTestId('currency-picker-modal')).toBeTruthy();
    expect(getByTestId('currency-option-USD')).toBeTruthy();
    expect(getByTestId('currency-option-EUR')).toBeTruthy();
    expect(getByTestId('currency-option-VND')).toBeTruthy();
    expect(getByTestId('currency-option-JPY')).toBeTruthy();

    // Select USD as FROM
    fireEvent.press(getByTestId('currency-option-USD'));

    // Modal should close
    expect(queryByTestId('currency-picker-modal')).toBeNull();

    // 2. Tap TO currency button
    const toSelectBtn = getByTestId('currency-to-select');
    expect(toSelectBtn).toBeTruthy();
    fireEvent.press(toSelectBtn);

    expect(getByTestId('currency-picker-modal')).toBeTruthy();
    // Select VND as TO
    fireEvent.press(getByTestId('currency-option-VND'));
    expect(queryByTestId('currency-picker-modal')).toBeNull();

    // Verify badges display USD and VND
    expect(getByText('USD')).toBeTruthy();
    expect(getByText('VND')).toBeTruthy();
  });

  test('RED-CURR-CALC-02: Entering amount dynamically recalculates converted value based on selected currencies', () => {
    const { getByTestId, getByText } = render(<HomeScreen />);

    // Set From to USD, To to VND
    fireEvent.press(getByTestId('currency-from-select'));
    fireEvent.press(getByTestId('currency-option-USD'));

    fireEvent.press(getByTestId('currency-to-select'));
    fireEvent.press(getByTestId('currency-option-VND'));

    const fromInput = getByTestId('currency-from-input');
    // Enter 10 USD -> 10 * 25400 = 254,000 VND
    fireEvent.changeText(fromInput, '10');

    expect(getByText('254,000')).toBeTruthy();
    expect(getByText(/1 USD = 25,400 VND/i)).toBeTruthy();

    // Swap currency -> From VND, To USD
    fireEvent.press(getByTestId('currency-swap-btn'));
    // 10 VND -> ~0.00 USD
    expect(getByText(/1 VND =/i)).toBeTruthy();
  });

  test('RED-WEATHER-GPS-03: Travel Radar displays ONLY GPS city (Da Nang) with 3 to 4 day weather forecast', () => {
    const { getByTestId, queryByText } = render(<HomeScreen />);

    const radarWidget = getByTestId('home-travel-radar-widget');
    expect(radarWidget).toBeTruthy();

    // Displays GPS city (Da Nang • GPS Location) inside radar widget
    expect(within(radarWidget).getByText(/Da Nang/i)).toBeTruthy();
    expect(within(radarWidget).getByText(/GPS Location|Current Location/i)).toBeTruthy();

    // Displays 4-day weather forecast items
    expect(getByTestId('weather-forecast-day-0')).toBeTruthy();
    expect(getByTestId('weather-forecast-day-1')).toBeTruthy();
    expect(getByTestId('weather-forecast-day-2')).toBeTruthy();
    expect(getByTestId('weather-forecast-day-3')).toBeTruthy();

    // Must NOT contain separate foreign city cards (Tokyo, Paris, Bangkok)
    expect(queryByText('Tokyo')).toBeNull();
    expect(queryByText('Paris')).toBeNull();
    expect(queryByText('Bangkok')).toBeNull();
  });

  test('RED-BADGES-REMOVAL-04: Badges (Live Rate, LIVE, GPS Active) and bottom dock Home outer circle are removed', () => {
    // 1. HomeScreen badges: "Live Rate • RateAPI" and "LIVE" removed
    const { queryByTestId: queryHomeTestId, queryByText: queryHomeText } = render(<HomeScreen />);
    expect(queryHomeTestId('currency-live-badge')).toBeNull();
    expect(queryHomeText(/Live Rate/i)).toBeNull();
    expect(queryHomeText(/^LIVE$/i)).toBeNull();

    // 2. HotelSearchScreen badge: "● GPS Active" removed
    const { queryByText: queryHotelText } = render(<HotelSearchScreen />);
    expect(queryHotelText(/GPS Active/i)).toBeNull();

    // 3. App Dock Home Button: outer circle border removed
    const { getByTestId: getAppTestId } = render(<App initialHasCompletedOnboarding={true} />);
    const homeTabBtn = getAppTestId('tab-btn-home');
    const flatStyle = Array.isArray(homeTabBtn.props.style)
      ? Object.assign({}, ...homeTabBtn.props.style.filter(Boolean))
      : homeTabBtn.props.style || {};

    // Outer circle border must be removed or 0
    expect(flatStyle.borderWidth || 0).toBe(0);
  });
});
