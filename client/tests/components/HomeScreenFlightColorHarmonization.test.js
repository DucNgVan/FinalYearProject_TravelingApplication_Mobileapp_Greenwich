import React from 'react';
import { StyleSheet } from 'react-native';
import { render, within, act } from '@testing-library/react-native';
import HomeScreen from '../../src/screens/home/HomeScreen';
import { useThemeStore } from '../../src/stores/theme.store';
import { useItineraryStore } from '../../src/stores/itinerary.store';
import { useCurrencyStore } from '../../src/stores/currency.store';

describe('TDD RED Phase: HomeScreen Flight Color Harmonization & Dark Executive Headers', () => {
  beforeEach(() => {
    act(() => {
      useThemeStore.getState().setThemeMode('light');
    });
    useItineraryStore.setState({
      trips: [
        {
          id: 'trip-danang-01',
          title: 'Da Nang Expedition 2026',
          destination: 'Da Nang',
          days: [{ dayIndex: 0, items: [{}, {}] }],
          collaborators: [{}, {}, {}],
          coverImage: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b',
        },
      ],
    });
    useCurrencyStore.setState({
      rates: { USD: 1, EUR: 0.9083, VND: 25400 },
      isLive: true,
    });
  });

  test('RED-HOME-COLOR-01: Segmented Control pills use high-contrast flight-style capsule styling (#111827 active in light mode)', () => {
    const { getByTestId } = render(<HomeScreen />);

    const plannedPill = getByTestId('segmented-pill-planned');
    expect(plannedPill).toBeTruthy();

    const flattened = StyleSheet.flatten(plannedPill.props.style);
    // In light mode, active pill MUST be deep black/navy #111827 (not washed-out #FFFFFF)
    expect(flattened.backgroundColor).toBe('#111827');

    // Switch to dark mode to verify contrast inversion
    act(() => {
      useThemeStore.getState().setThemeMode('dark');
    });
    const { getByTestId: getByTestIdDark } = render(<HomeScreen />);
    const plannedPillDark = getByTestIdDark('segmented-pill-planned');
    const flattenedDark = StyleSheet.flatten(plannedPillDark.props.style);
    expect(flattenedDark.backgroundColor).toBe('#FFFFFF');
  });

  test('RED-HOME-COLOR-02: Currency Converter Widget renders clean dark header strip (#0E1B2C) without redundant LIVE FX badge', () => {
    const { getByTestId, queryByText } = render(<HomeScreen />);

    // Currency widget has dark header strip testID
    const headerStrip = getByTestId('currency-header-strip');
    expect(headerStrip).toBeTruthy();

    const stripStyle = StyleSheet.flatten(headerStrip.props.style);
    expect(stripStyle.backgroundColor).toBe('#0E1B2C');

    // Title within the strip
    expect(within(headerStrip).getByText(/CURRENCY EXCHANGE/i)).toBeTruthy();
    // LIVE FX badge MUST be deleted per user feedback
    expect(queryByText(/LIVE FX/i)).toBeNull();
  });

  test('RED-HOME-COLOR-03: Travel Radar & Weather Widget renders dark header strip (#0E1B2C) without overlapping GPS RADAR badge', () => {
    const { getByTestId, queryByText } = render(<HomeScreen />);

    const weatherHeaderStrip = getByTestId('weather-header-strip');
    expect(weatherHeaderStrip).toBeTruthy();

    const stripStyle = StyleSheet.flatten(weatherHeaderStrip.props.style);
    expect(stripStyle.backgroundColor).toBe('#0E1B2C');

    expect(within(weatherHeaderStrip).getByText(/DA NANG/i)).toBeTruthy();
    // GPS RADAR badge MUST be deleted to eliminate overlap on weather temp badge
    expect(queryByText(/GPS RADAR/i)).toBeNull();
    expect(getByTestId('weather-temp-badge')).toBeTruthy();
  });

  test('RED-HOME-COLOR-04: Collections card renders flight-card dark header strip and replaces teal #0B7A75 with executive palette', () => {
    const { getByTestId } = render(<HomeScreen />);

    const collectionsHeaderStrip = getByTestId('collections-header-strip');
    expect(collectionsHeaderStrip).toBeTruthy();

    const stripStyle = StyleSheet.flatten(collectionsHeaderStrip.props.style);
    expect(stripStyle.backgroundColor).toBe('#0E1B2C');

    const collectionItem = getByTestId('collection-item-card');
    expect(collectionItem).toBeTruthy();
    const itemStyle = StyleSheet.flatten(collectionItem.props.style);
    // Must NOT be outdated bright teal #0B7A75
    expect(itemStyle.backgroundColor).not.toBe('#0B7A75');
  });
});
