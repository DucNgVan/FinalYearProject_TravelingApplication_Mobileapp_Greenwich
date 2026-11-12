import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import FlightSearchScreen from '../../src/screens/booking/FlightSearchScreen';
import { useBookingStore } from '../../src/stores/booking.store';

jest.mock('../../src/stores/booking.store');

describe('Component Test: FlightSearchScreen Enhanced Features (City Resolver, Calendar, Trip Type, Filters)', () => {
  const mockSearchFlights = jest.fn();
  const mockFlights = [
    {
      id: 'flight-vj-120',
      airlineCode: 'VJ',
      airlineName: 'VietJet Air',
      flightNumber: 'VJ-0120',
      origin: 'SGN',
      destination: 'HAN',
      departureTime: '2026-10-15T06:00:00Z',
      arrivalTime: '2026-10-15T08:10:00Z',
      durationMinutes: 130,
      stops: 0,
      price: { currency: 'VND', amount: 1326780 },
    },
    {
      id: 'flight-sq-178',
      airlineCode: 'SQ',
      airlineName: 'Singapore Airlines',
      flightNumber: 'SQ-178',
      origin: 'SGN',
      destination: 'HAN',
      departureTime: '2026-10-15T12:00:00Z',
      arrivalTime: '2026-10-15T18:30:00Z',
      durationMinutes: 390,
      stops: 1,
      transitCity: 'SIN (Singapore)',
      price: { currency: 'VND', amount: 6599610 },
    },
    {
      id: 'flight-vn-240',
      airlineCode: 'VN',
      airlineName: 'Vietnam Airlines',
      flightNumber: 'VN-0240',
      origin: 'SGN',
      destination: 'HAN',
      departureTime: '2026-10-15T07:00:00Z',
      arrivalTime: '2026-10-15T09:10:00Z',
      durationMinutes: 130,
      stops: 0,
      price: { currency: 'VND', amount: 2073060 },
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    useBookingStore.mockReturnValue({
      flights: mockFlights,
      isLoadingFlights: false,
      flightError: null,
      searchFlights: mockSearchFlights,
      selectFlight: jest.fn(),
      bookFlightSandbox: jest.fn().mockResolvedValue({ pnr: 'VN-123456', ticketNumber: '738-1234567890' }),
    });
  });

  test('RED-FE-FLIGHT-ENHANCED-01: toggles between One-way and Round-trip, showing return date picker', () => {
    const { getByText, queryByText } = render(<FlightSearchScreen />);

    // Default is One-way
    expect(getByText('One-way')).toBeTruthy();
    expect(getByText('Round-trip')).toBeTruthy();

    // In One-way, Return date is not visible
    expect(queryByText(/Return Date/i)).toBeNull();

    // Switch to Round-trip
    fireEvent.press(getByText('Round-trip'));
    expect(getByText(/Return Date/i)).toBeTruthy();
  });

  test('RED-FE-FLIGHT-ENHANCED-02: pressing date opens CalendarPickerModal', () => {
    const { getByText, getByTestId } = render(<FlightSearchScreen />);

    // Press date input / trigger
    fireEvent.press(getByTestId('date-picker-trigger-departure'));

    // Calendar modal title should appear
    expect(getByText(/Select Departure Date|Select Date/i)).toBeTruthy();
  });

  test('RED-FE-FLIGHT-ENHANCED-03: typing Vietnamese city names resolves to IATA codes when searching', async () => {
    const { getByPlaceholderText, getByText } = render(<FlightSearchScreen />);

    fireEvent.changeText(getByPlaceholderText(/e\.g\..*SGN|Departure/i), 'Hà Nội');
    fireEvent.changeText(getByPlaceholderText(/e\.g\..*HAN|Destination/i), 'Sài Gòn');
    fireEvent.changeText(getByPlaceholderText(/e\.g\..*2026|Departure Date/i), '2026-10-15');

    fireEvent.press(getByText('Search Flights'));

    await waitFor(() => {
      expect(mockSearchFlights).toHaveBeenCalledWith(
        expect.objectContaining({
          origin: 'HAN',
          destination: 'SGN',
        })
      );
    });
  });

  test('RED-FE-FLIGHT-ENHANCED-04: filters flights by direct, connecting, airlines, and all', () => {
    const { getByText, getByTestId, queryByText } = render(<FlightSearchScreen />);

    // Initially all flights are shown
    expect(getByText(/VJ-0120/i)).toBeTruthy();
    expect(getByText(/SQ-178/i)).toBeTruthy();

    // Press "Bay thẳng" chip
    fireEvent.press(getByTestId('quick-filter-direct'));
    expect(getByText(/VJ-0120/i)).toBeTruthy();
    expect(queryByText(/SQ-178/i)).toBeNull();

    // Press "Nối chuyến" chip
    fireEvent.press(getByTestId('quick-filter-transit'));
    expect(queryByText(/VJ-0120/i)).toBeNull();
    expect(getByText(/SQ-178/i)).toBeTruthy();

    // Press "Giá rẻ" chip
    fireEvent.press(getByTestId('quick-filter-cheap'));
    expect(getByText(/VJ-0120/i)).toBeTruthy();

    // Press "Bay sớm" chip
    fireEvent.press(getByTestId('quick-filter-early'));
    expect(getByText(/VJ-0120/i)).toBeTruthy();

    // Press "Tất cả" chip
    fireEvent.press(getByTestId('quick-filter-all'));
    expect(getByText(/VJ-0120/i)).toBeTruthy();
    expect(getByText(/SQ-178/i)).toBeTruthy();
  });

  test('RED-FE-FS-03: Search form provides checkable preferences for Bay thẳng, Nối chuyến, Có hành lý', () => {
    const { getByTestId, getByText } = render(<FlightSearchScreen />);
    expect(getByTestId('pref-checkbox-direct')).toBeTruthy();
    expect(getByTestId('pref-checkbox-transit')).toBeTruthy();
    expect(getByTestId('pref-checkbox-baggage')).toBeTruthy();

    fireEvent.press(getByTestId('pref-checkbox-direct'));
    fireEvent.press(getByTestId('pref-checkbox-baggage'));
  });

  test('should validate return date when round trip is selected without return date', async () => {
    const { getByText, getByPlaceholderText, findByText } = render(<FlightSearchScreen />);

    fireEvent.press(getByText('Round-trip'));
    fireEvent.changeText(getByPlaceholderText(/e\.g\..*SGN|Departure/i), 'SGN');
    fireEvent.changeText(getByPlaceholderText(/e\.g\..*HAN|Destination/i), 'HAN');
    fireEvent.changeText(getByPlaceholderText(/e\.g\..*2026|Departure Date/i), '2026-10-15');

    fireEvent.press(getByText('Search Flights'));

    const err = await findByText(/Please select a return date/i);
    expect(err).toBeTruthy();
  });

  test('should open flight detail modal upon selecting flight and navigate to booking modal', async () => {
    const mockNav = { navigate: jest.fn() };
    const { getByTestId, getByText } = render(<FlightSearchScreen navigation={mockNav} />);

    // Tap flight card
    fireEvent.press(getByTestId('flight-card-flight-vj-120'));
    expect(mockNav.navigate).toHaveBeenCalled();

    // Detail modal close button appears
    expect(getByTestId('close-flight-detail-btn')).toBeTruthy();

    // Tap "Book Sandbox Ticket" inside detail modal
    fireEvent.press(getByText(/Book Sandbox Ticket|Đặt Vé Sandbox/i));

    // Sandbox booking modal appears
    expect(getByText(/Duffel API Sandbox Payment/i)).toBeTruthy();

    // Close sandbox booking modal
    fireEvent.press(getByText('✕'));
  });

  test('should open filter modal, trigger reset and apply', () => {
    const { getByTestId, getByText } = render(<FlightSearchScreen />);

    fireEvent.press(getByTestId('open-flight-filter-btn'));
    expect(getByText(/Flight Filters|Bộ Lọc Chuyến Bay/i)).toBeTruthy();

    fireEvent.press(getByText(/Reset|Đặt lại/i));
    fireEvent.press(getByText(/Apply Filters|Áp dụng/i));
  });

  test('handles opening and closing departure and return calendar pickers', () => {
    const { getByTestId, getByText, getAllByText, getByPlaceholderText } = render(<FlightSearchScreen />);

    // Open departure calendar and select day 20
    fireEvent.press(getByTestId('date-picker-trigger-departure'));
    expect(getByText(/Select Departure Date|Select Date/i)).toBeTruthy();
    const day20 = getAllByText('20')[0];
    fireEvent.press(day20);

    // Switch to round-trip and open return calendar and select day 25
    fireEvent.press(getByText('Round-trip'));
    fireEvent.changeText(getByPlaceholderText(/e\.g\..*Return Date|e\.g\..*2026-10-25/i), '2026-10-25');
    fireEvent.press(getByTestId('date-picker-trigger-return'));
    expect(getByText(/Select Return Date|Select Date/i)).toBeTruthy();
    const day25Elements = getAllByText('25');
    fireEvent.press(day25Elements[0]);
  });

  test('closes flight detail modal via close button', () => {
    const { getByTestId, queryByTestId } = render(<FlightSearchScreen />);
    fireEvent.press(getByTestId('flight-card-flight-vj-120'));
    expect(getByTestId('close-flight-detail-btn')).toBeTruthy();

    fireEvent.press(getByTestId('close-flight-detail-btn'));
    expect(queryByTestId('close-flight-detail-btn')).toBeNull();
  });

  test('RED-FE-TH-01: adopts light theme background color #F8FAFC dynamically from useThemeStore', () => {
    const { getByTestId } = render(<FlightSearchScreen />);
    const rootContainer = getByTestId('flight-search-container');
    expect(rootContainer.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ backgroundColor: '#F8FAFC' }),
      ])
    );
  });

  test('handles dark mode theme background color #121316 when mode is dark', () => {
    const { useThemeStore } = require('../../src/stores/theme.store');
    useThemeStore.getState().setThemeMode('dark');

    const { getByTestId } = render(<FlightSearchScreen />);
    const rootContainer = getByTestId('flight-search-container');
    expect(rootContainer.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ backgroundColor: '#121316' }),
      ])
    );

    useThemeStore.getState().setThemeMode('light');
  });

  test('applies modal filters with sortBy duration and departure', () => {
    const { getByTestId, getByText, getAllByText } = render(<FlightSearchScreen />);
    fireEvent.press(getByTestId('open-flight-filter-btn'));

    fireEvent.press(getByText(/Fastest|Bay nhanh/i));
    fireEvent.press(getByText(/Apply Filters|Áp dụng/i));

    fireEvent.press(getByTestId('open-flight-filter-btn'));
    const earlyButtons = getAllByText(/Early Flight|Bay sớm/i);
    fireEvent.press(earlyButtons[earlyButtons.length - 1]);
    fireEvent.press(getByText(/Apply Filters|Áp dụng/i));
  });
});
