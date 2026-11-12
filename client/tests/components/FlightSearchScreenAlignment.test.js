import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import FlightSearchScreen from '../../src/screens/booking/FlightSearchScreen';
import { useBookingStore } from '../../src/stores/booking.store';

jest.mock('../../src/stores/booking.store');

describe('Component Test: FlightSearchScreen Layout Alignment & Transit Label (RED Phase)', () => {
  const mockSearchFlights = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useBookingStore.mockReturnValue({
      flights: [],
      isLoadingFlights: false,
      flightError: null,
      searchFlights: mockSearchFlights,
      selectFlight: jest.fn(),
    });
  });

  test('RED-UI-ALIGN-01: labels are From (Origin) and To (Destination) with concise clean placeholders', () => {
    const { getByText, getByPlaceholderText } = render(<FlightSearchScreen />);
    fireEvent.press(getByText('Edit'));

    // Labels should be concise to ensure single-line rendering and vertical alignment
    expect(getByText('From (Origin)')).toBeTruthy();
    expect(getByText('To (Destination)')).toBeTruthy();

    // Placeholders should be clean and not truncated
    expect(getByPlaceholderText(/e\.g\..*SGN.*Ho Chi Minh/i)).toBeTruthy();
    expect(getByPlaceholderText(/e\.g\..*HAN/i)).toBeTruthy();
    expect(getByPlaceholderText('YYYY-MM-DD')).toBeTruthy();
  });

  test('RED-UI-TRANSIT-01: preference chip displays Transit with balanced width', () => {
    const { getByText, getByTestId } = render(<FlightSearchScreen />);
    fireEvent.press(getByText('Edit'));

    expect(getByTestId('pref-checkbox-transit')).toBeTruthy();
    // Label should be Transit for clean symmetry with Direct and Baggage
    expect(getByText('Transit')).toBeTruthy();
  });

  test('RED-UI-CATCH-01: route chip press and swap handle rejected promises without unhandled rejection', async () => {
    // Simulate failing network search
    mockSearchFlights.mockRejectedValue(new Error('Network error'));

    const { getByTestId } = render(<FlightSearchScreen />);

    // Press route chip
    const routeChip = getByTestId('route-chip-SGN-HAN');
    expect(() => fireEvent.press(routeChip)).not.toThrow();

    // Press swap button
    const swapBtn = getByTestId('flight-swap-btn');
    expect(() => fireEvent.press(swapBtn)).not.toThrow();

    await waitFor(() => {
      expect(mockSearchFlights).toHaveBeenCalled();
    });
  });
});
