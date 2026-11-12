import { useBookingStore } from '../../../src/stores/booking.store';
import apiClient from '../../../src/api/client';

jest.mock('../../../src/api/client');

describe('Unit Test: Booking Store Envelope Unwrapping', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useBookingStore.setState({
      flights: [],
      hotels: [],
      isLoadingFlights: false,
      isLoadingHotels: false,
      flightError: null,
      hotelError: null,
    });
  });

  test('RED-FE-BK-WRAP-01: searchFlights should correctly extract flights array when backend returns { flights: [...] }', async () => {
    const rawBackendEnvelope = {
      flights: [
        { id: 'f-unwrap-1', airlineCode: 'VN', flightNumber: 'VN-123' },
        { id: 'f-unwrap-2', airlineCode: 'VJ', flightNumber: 'VJ-456' },
      ],
      meta: { total: 2 },
    };

    apiClient.get.mockResolvedValueOnce(rawBackendEnvelope);

    await useBookingStore.getState().searchFlights({
      origin: 'SGN',
      destination: 'HAN',
      departureDate: '2026-10-15',
    });

    const state = useBookingStore.getState();
    expect(Array.isArray(state.flights)).toBe(true);
    expect(state.flights.length).toBe(2);
    expect(state.flights[0].id).toBe('f-unwrap-1');
  });

  test('RED-FE-BK-WRAP-02: searchHotels should correctly extract hotels array when backend returns { hotels: [...] }', async () => {
    const rawBackendEnvelope = {
      hotels: [
        { id: 'h-unwrap-1', name: 'InterContinental Danang Sun Peninsula Resort' },
      ],
      meta: { total: 1 },
    };

    apiClient.get.mockResolvedValueOnce(rawBackendEnvelope);

    await useBookingStore.getState().searchHotels({
      city: 'Da Nang',
      checkIn: '2026-10-15',
      checkOut: '2026-10-17',
    });

    const state = useBookingStore.getState();
    expect(Array.isArray(state.hotels)).toBe(true);
    expect(state.hotels.length).toBe(1);
    expect(state.hotels[0].id).toBe('h-unwrap-1');
  });
});
