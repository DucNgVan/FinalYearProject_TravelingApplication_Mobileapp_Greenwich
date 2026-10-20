const bookingService = require('../../../src/services/booking.service');
const cacheService = require('../../../src/services/cache.service');

describe('Unit Test: Booking Aggregator & Cache-Aside Service', () => {
  beforeEach(async () => {
    await cacheService.flush();
  });

  test('RED-04: searchFlights should fall back to MockBookingProvider and return localized Vietnam flights', async () => {
    const query = {
      origin: 'HAN',
      destination: 'DAD',
      departureDate: '2026-11-20',
      passengers: 1,
      cabinClass: 'ECONOMY',
    };

    const result = await bookingService.searchFlights(query);

    expect(result).toBeDefined();
    expect(result.flights).toBeInstanceOf(Array);
    expect(result.flights.length).toBeGreaterThan(0);
    expect(result.meta.dataSource).toBe('MOCK_FALLBACK');
    expect(result.meta.totalResults).toBe(result.flights.length);

    // Verify first flight structure
    const first = result.flights[0];
    expect(first.origin).toBe('HAN');
    expect(first.destination).toBe('DAD');
    expect(first.price.amount).toBeGreaterThan(0);
  });

  test('RED-05: CacheService should store and return cached flight results on subsequent queries', async () => {
    const query = {
      origin: 'SGN',
      destination: 'HAN',
      departureDate: '2026-12-01',
      passengers: 2,
      cabinClass: 'ECONOMY',
    };

    // First search - Cache Miss
    const firstResult = await bookingService.searchFlights(query);
    expect(firstResult.meta.cached).toBe(false);

    // Second search - Cache Hit
    const cachedResult = await bookingService.searchFlights(query);
    expect(cachedResult.meta.cached).toBe(true);
    expect(cachedResult.flights.length).toBe(firstResult.flights.length);
  });

  test('should sort flights by price:asc, price:desc, and duration:asc', async () => {
    const baseQuery = {
      origin: 'HAN',
      destination: 'DAD',
      departureDate: '2026-11-20',
      passengers: 1,
    };

    const ascResult = await bookingService.searchFlights({ ...baseQuery, sortBy: 'price:asc' });
    for (let i = 0; i < ascResult.flights.length - 1; i++) {
      expect(ascResult.flights[i].price.amount).toBeLessThanOrEqual(ascResult.flights[i + 1].price.amount);
    }

    const descResult = await bookingService.searchFlights({ ...baseQuery, sortBy: 'price:desc' });
    for (let i = 0; i < descResult.flights.length - 1; i++) {
      expect(descResult.flights[i].price.amount).toBeGreaterThanOrEqual(descResult.flights[i + 1].price.amount);
    }

    const durationResult = await bookingService.searchFlights({ ...baseQuery, sortBy: 'duration:asc' });
    for (let i = 0; i < durationResult.flights.length - 1; i++) {
      expect(durationResult.flights[i].durationMinutes).toBeLessThanOrEqual(durationResult.flights[i + 1].durationMinutes);
    }
  });

  test('should search hotels, cache results, and sort by price:asc, price:desc, and rating:desc', async () => {
    const hotelQuery = {
      city: 'DaNang',
      checkIn: '2026-11-15',
      checkOut: '2026-11-18',
      guests: 2,
      rooms: 1,
    };

    // First search - Cache Miss
    const res1 = await bookingService.searchHotels(hotelQuery);
    expect(res1.meta.cached).toBe(false);
    expect(res1.hotels.length).toBeGreaterThan(0);

    // Second search - Cache Hit
    const res2 = await bookingService.searchHotels(hotelQuery);
    expect(res2.meta.cached).toBe(true);

    // Sort by price:desc
    const descHotels = await bookingService.searchHotels({ ...hotelQuery, sortBy: 'price:desc' });
    for (let i = 0; i < descHotels.hotels.length - 1; i++) {
      expect(descHotels.hotels[i].pricePerNight).toBeGreaterThanOrEqual(descHotels.hotels[i + 1].pricePerNight);
    }

    // Sort by price:asc
    const ascHotels = await bookingService.searchHotels({ ...hotelQuery, sortBy: 'price:asc' });
    for (let i = 0; i < ascHotels.hotels.length - 1; i++) {
      expect(ascHotels.hotels[i].pricePerNight).toBeLessThanOrEqual(ascHotels.hotels[i + 1].pricePerNight);
    }

    // Sort by rating:desc
    const ratingHotels = await bookingService.searchHotels({ ...hotelQuery, sortBy: 'rating:desc' });
    for (let i = 0; i < ratingHotels.hotels.length - 1; i++) {
      expect(ratingHotels.hotels[i].reviewScore).toBeGreaterThanOrEqual(ratingHotels.hotels[i + 1].reviewScore);
    }
  });

  test('should call duffelProvider when DUFFEL_API_TOKEN is present and NODE_ENV is development', async () => {
    const originalEnv = process.env.NODE_ENV;
    const duffelProvider = require('../../../src/providers/duffel.provider');
    const spy = jest.spyOn(duffelProvider, 'searchFlights').mockResolvedValue([
      {
        id: 'duffel_offer_1',
        provider: 'DUFFEL',
        airlineCode: 'VN',
        airlineName: 'Vietnam Airlines',
        flightNumber: 'VN-999',
        origin: 'HAN',
        destination: 'DAD',
        departureTime: '2026-11-20T08:00:00Z',
        durationMinutes: 90,
        stops: 0,
        price: { currency: 'VND', amount: 1200000 },
      },
    ]);

    try {
      process.env.NODE_ENV = 'development';
      const result = await bookingService.searchFlights({
        origin: 'HAN',
        destination: 'DAD',
        departureDate: '2026-11-20',
      });
      expect(result.meta.dataSource).toBe('DUFFEL_LIVE');
      expect(result.flights[0].flightNumber).toBe('VN-999');
    } finally {
      process.env.NODE_ENV = originalEnv;
      spy.mockRestore();
    }
  });

  test('should fallback to mock provider when duffelProvider throws in development', async () => {
    const originalEnv = process.env.NODE_ENV;
    const duffelProvider = require('../../../src/providers/duffel.provider');
    const spy = jest.spyOn(duffelProvider, 'searchFlights').mockRejectedValue(new Error('Network error'));

    try {
      process.env.NODE_ENV = 'development';
      const result = await bookingService.searchFlights({
        origin: 'HAN',
        destination: 'DAD',
        departureDate: '2026-11-20',
      });
      expect(result.meta.dataSource).toBe('MOCK_FALLBACK');
    } finally {
      process.env.NODE_ENV = originalEnv;
      spy.mockRestore();
    }
  });
});
