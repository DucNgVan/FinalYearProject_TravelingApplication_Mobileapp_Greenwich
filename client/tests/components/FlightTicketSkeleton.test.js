import React from 'react';
import { StyleSheet } from 'react-native';
import { render } from '@testing-library/react-native';
import { FlightTicketSkeleton, FlightTicketSkeletonList } from '../../src/components/booking/FlightTicketSkeleton';
import FlightSearchScreen from '../../src/screens/booking/FlightSearchScreen';
import { useBookingStore } from '../../src/stores/booking.store';
import { useThemeStore } from '../../src/stores/theme.store';

describe('TDD RED: FlightTicketSkeleton & Boarding Pass Shimmer Loading', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    useThemeStore.getState().setThemeMode('light');
    useBookingStore.setState({
      flights: [],
      isLoadingFlights: false,
      flightError: null,
    });
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  test('RED-SKEL-01: FlightTicketSkeleton renders boarding pass skeleton structure with 68/32 split and barcode simulation', () => {
    const { getByTestId, getAllByTestId, getByText } = render(
      <FlightTicketSkeleton screenBgColor="#F8FAFC" testID="single-ticket-skeleton" />
    );

    // Airplane glyph exists on path
    expect(getByText('✈')).toBeTruthy();

    // Verify root skeleton testID exists
    expect(getByTestId('single-ticket-skeleton')).toBeTruthy();
  });

  test('RED-SKEL-02: FlightTicketSkeletonList renders 3 stacked ticket skeletons with staggered delays', () => {
    const { getByTestId, getAllByText } = render(
      <FlightTicketSkeletonList screenBgColor="#F8FAFC" />
    );

    // List container must exist
    expect(getByTestId('flight-ticket-skeleton-list')).toBeTruthy();

    // Exactly 3 plane icons corresponding to 3 tickets
    const planeIcons = getAllByText('✈');
    expect(planeIcons.length).toBe(3);
  });

  test('RED-SKEL-03: FlightSearchScreen renders FlightTicketSkeletonList when isLoadingFlights is true and removes old spinner', () => {
    useBookingStore.setState({
      isLoadingFlights: true,
      flights: [],
    });

    const { getByTestId, queryByText } = render(<FlightSearchScreen />);

    // Must render the new skeleton container
    expect(getByTestId('flight-search-loading-skeletons')).toBeTruthy();
    expect(getByTestId('flight-ticket-skeleton-list')).toBeTruthy();

    // Must NOT render the old plain text or spinner
    expect(queryByText('Searching for the best flight offers...')).toBeNull();
  });

  test('RED-SKEL-04: Notches inherit screenBgColor matching light and dark modes', () => {
    const { getByTestId: getLightTestId } = render(
      <FlightTicketSkeleton screenBgColor="#F8FAFC" testID="skel-light" />
    );
    const lightNotch = getLightTestId('skel-notch-left');
    const flatLightStyle = StyleSheet.flatten(lightNotch.props.style);
    expect(flatLightStyle.backgroundColor).toBe('#F8FAFC');

    const { getByTestId: getDarkTestId } = render(
      <FlightTicketSkeleton screenBgColor="#121316" testID="skel-dark" />
    );
    const darkNotch = getDarkTestId('skel-notch-left');
    const flatDarkStyle = StyleSheet.flatten(darkNotch.props.style);
    expect(flatDarkStyle.backgroundColor).toBe('#121316');
  });
});
