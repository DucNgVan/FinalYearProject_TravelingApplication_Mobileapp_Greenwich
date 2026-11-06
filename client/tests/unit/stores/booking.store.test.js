import { useBookingStore } from '../../../src/stores/booking.store';
import apiClient from '../../../src/api/client';

jest.mock('../../../src/api/client');

describe('Unit Test: Booking Store (Zustand State Management)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useBookingStore.setState({
      flights: [],
      hotels: [],
      selectedFlight: null,
      selectedHotel: null,
      isLoadingFlights: false,
      isLoadingHotels: false,
      flightError: null,
      hotelError: null,
      flightFilters: {
        directOnly: false,
        maxPrice: null,
        sortBy: 'price:asc',
      },
      hotelFilters: {
        minRating: 0,
        maxPrice: null,
        sortBy: 'price:asc',
      },
    });
  });

  test('RED-FE-BK-01: useBookingStore should initialize with empty results, default filters, and idle loading state', () => {
    const state = useBookingStore.getState();
    expect(state.flights).toEqual([]);
    expect(state.hotels).toEqual([]);
    expect(state.isLoadingFlights).toBe(false);
    expect(state.isLoadingHotels).toBe(false);
    expect(state.flightError).toBeNull();
    expect(state.hotelError).toBeNull();
    expect(state.flightFilters.directOnly).toBe(false);
    expect(state.hotelFilters.minRating).toBe(0);
  });

  test('RED-FE-BK-02: useBookingStore.searchFlights should call /flights/search and store retrieved offers', async () => {
    const mockFlightOffers = [
      {
        id: 'flight-vn-101',
        airlineCode: 'VN',
        airlineName: 'Vietnam Airlines',
        flightNumber: 'VN-101',
        origin: 'SGN',
        destination: 'HAN',
        departureTime: '2026-10-15T08:00:00Z',
        arrivalTime: '2026-10-15T10:15:00Z',
        durationMinutes: 135,
        stops: 0,
        cabinClass: 'ECONOMY',
        price: { currency: 'VND', amount: 1550000 },
      },
    ];

    apiClient.get.mockResolvedValueOnce(mockFlightOffers);

    const query = {
      origin: 'SGN',
      destination: 'HAN',
      departureDate: '2026-10-15',
      passengers: 1,
    };

    await useBookingStore.getState().searchFlights(query);

    const state = useBookingStore.getState();
    expect(apiClient.get).toHaveBeenCalledWith('/flights/search', {
      params: expect.objectContaining({
        origin: 'SGN',
        destination: 'HAN',
        departureDate: '2026-10-15',
      }),
    });
    expect(state.flights).toEqual(mockFlightOffers);
    expect(state.isLoadingFlights).toBe(false);
    expect(state.flightError).toBeNull();
  });

  test('RED-FE-BK-03: useBookingStore.searchFlights should capture error message and reset loading flag on failure', async () => {
    apiClient.get.mockRejectedValueOnce(new Error('Origin and destination cannot be identical'));

    await expect(
      useBookingStore.getState().searchFlights({ origin: 'SGN', destination: 'SGN' })
    ).rejects.toThrow('Origin and destination cannot be identical');

    const state = useBookingStore.getState();
    expect(state.flightError).toBe('Origin and destination cannot be identical');
    expect(state.isLoadingFlights).toBe(false);
    expect(state.flights).toEqual([]);
  });

  test('RED-FE-BK-04: useBookingStore.searchHotels should call /hotels/search and store retrieved hotel options', async () => {
    const mockHotelOptions = [
      {
        id: 'hotel-vp-01',
        name: 'Vinpearl Luxury Landmark 81',
        city: 'Ho Chi Minh City',
        address: '720A Dien Bien Phu, Binh Thanh',
        starRating: 5,
        reviewScore: 9.4,
        pricePerNight: 3500000,
        currency: 'VND',
        nights: 2,
        totalPrice: 7000000,
      },
    ];

    apiClient.get.mockResolvedValueOnce(mockHotelOptions);

    const query = {
      destination: 'Ho Chi Minh City',
      checkIn: '2026-10-15',
      checkOut: '2026-10-17',
      guests: 2,
    };

    await useBookingStore.getState().searchHotels(query);

    const state = useBookingStore.getState();
    expect(apiClient.get).toHaveBeenCalledWith('/hotels/search', {
      params: expect.objectContaining({
        destination: 'Ho Chi Minh City',
        checkIn: '2026-10-15',
        checkOut: '2026-10-17',
      }),
    });
    expect(state.hotels).toEqual(mockHotelOptions);
    expect(state.isLoadingHotels).toBe(false);
    expect(state.hotelError).toBeNull();
  });

  test('RED-FE-BK-05: useBookingStore.searchHotels should handle API failure and set hotelError state', async () => {
    apiClient.get.mockRejectedValueOnce(new Error('Check-out must be after check-in'));

    await expect(
      useBookingStore.getState().searchHotels({
        destination: 'Da Nang',
        checkIn: '2026-10-20',
        checkOut: '2026-10-19',
      })
    ).rejects.toThrow('Check-out must be after check-in');

    const state = useBookingStore.getState();
    expect(state.hotelError).toBe('Check-out must be after check-in');
    expect(state.isLoadingHotels).toBe(false);
    expect(state.hotels).toEqual([]);
  });

  test('should update flightFilters and hotelFilters', () => {
    useBookingStore.getState().setFlightFilters({ directOnly: true, maxPrice: 2000000 });
    expect(useBookingStore.getState().flightFilters.directOnly).toBe(true);
    expect(useBookingStore.getState().flightFilters.maxPrice).toBe(2000000);

    useBookingStore.getState().setHotelFilters({ minRating: 4 });
    expect(useBookingStore.getState().hotelFilters.minRating).toBe(4);
  });

  test('should manage selectedFlight, selectedHotel and clearBookingSelection', () => {
    const flight = { id: 'f-1' };
    const hotel = { id: 'h-1' };

    useBookingStore.getState().selectFlight(flight);
    expect(useBookingStore.getState().selectedFlight).toEqual(flight);

    useBookingStore.getState().selectHotel(hotel);
    expect(useBookingStore.getState().selectedHotel).toEqual(hotel);

    useBookingStore.getState().clearBookingSelection();
    expect(useBookingStore.getState().selectedFlight).toBeNull();
    expect(useBookingStore.getState().selectedHotel).toBeNull();
  });

  test('should fallback to default error message when error.message is not provided', async () => {
    apiClient.get.mockRejectedValueOnce({});

    await expect(
      useBookingStore.getState().searchFlights({ origin: 'SGN', destination: 'HAN' })
    ).rejects.toBeDefined();

    expect(useBookingStore.getState().flightError).toMatch(/Failed to search flights|Lỗi khi tìm kiếm chuyến bay/);

    apiClient.get.mockRejectedValueOnce({});

    await expect(
      useBookingStore.getState().searchHotels({ destination: 'Da Nang' })
    ).rejects.toBeDefined();

    expect(useBookingStore.getState().hotelError).toMatch(/Failed to search hotels|Lỗi khi tìm kiếm khách sạn/);
  });

  test('should handle null or empty response from API without error', async () => {
    apiClient.get.mockResolvedValueOnce(null);
    await useBookingStore.getState().searchFlights({ origin: 'SGN', destination: 'HAN' });
    expect(useBookingStore.getState().flights).toEqual([]);

    apiClient.get.mockResolvedValueOnce(null);
    await useBookingStore.getState().searchHotels({ destination: 'Da Nang' });
    expect(useBookingStore.getState().hotels).toEqual([]);
  });
});
