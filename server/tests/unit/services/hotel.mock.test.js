const bookingService = require('../../../src/services/booking.service');
const duffelProvider = require('../../../src/providers/duffel.provider');
const mockProvider = require('../../../src/providers/mock.provider');
const cacheService = require('../../../src/services/cache.service');

describe('Unit Test: Hotel Mock Provider & Resilient Fallback', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await cacheService.flush();
  });

  test('RED-HOTEL-MOCK-HOIAN-01: mockProvider.searchHotels returns exclusively Hoi An hotels with valid photo thumbnails', async () => {
    const hotels = await mockProvider.searchHotels({
      city: 'Hoi An',
      checkIn: '2026-11-14',
      checkOut: '2026-11-17',
      guests: 2,
      rooms: 1,
    });

    expect(hotels.length).toBeGreaterThanOrEqual(2);
    hotels.forEach((hotel) => {
      expect(hotel.cityKey).toBe('hoian');
      expect(hotel.thumbnailUrl).toBeDefined();
      expect(hotel.thumbnailUrl).toMatch(/^https:\/\//);
      expect(hotel.city).toMatch(/Hội An|Hoi An/i);
    });
  });

  test('RED-HOTEL-MOCK-UNKNOWN-02: mockProvider returns empty array for unmatched city, never leaking other cities', async () => {
    const hotels = await mockProvider.searchHotels({
      city: 'Atlantis City Nowhere',
      checkIn: '2026-11-14',
      checkOut: '2026-11-17',
      guests: 2,
      rooms: 1,
    });

    expect(hotels).toEqual([]);
  });

  test('RED-HOTEL-FALLBACK-03: bookingService.searchHotels falls back to mockProvider on live API error and sets dataSource MOCK_HOTEL_PROVIDER', async () => {
    const spyDuffel = jest.spyOn(duffelProvider, 'searchHotels').mockRejectedValueOnce(
      new Error('Duffel Stays API returned 403: This feature is not enabled for your account.')
    );

    const result = await bookingService.searchHotels({
      city: 'Hoi An',
      checkIn: '2026-11-14',
      checkOut: '2026-11-17',
      guests: 2,
      rooms: 1,
    });

    expect(result.hotels.length).toBeGreaterThanOrEqual(2);
    expect(result.meta.dataSource).toBe('MOCK_HOTEL_PROVIDER');
    result.hotels.forEach((h) => {
      expect(h.thumbnailUrl).toBeDefined();
      expect(h.city).toMatch(/Hội An|Hoi An/i);
    });

    spyDuffel.mockRestore();
  });
});
