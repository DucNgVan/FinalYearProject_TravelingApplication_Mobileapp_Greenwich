const mockProvider = require('../../../src/providers/mock.provider');

describe('Unit Test: MockBookingProvider', () => {
  test('should return flights with default passengers and cabinClass when omitted', async () => {
    const flights = await mockProvider.searchFlights({
      origin: 'HAN',
      destination: 'DAD',
      departureDate: '2026-11-20',
    });

    expect(flights).toBeInstanceOf(Array);
    expect(flights.length).toBeGreaterThan(0);
    expect(flights[0].cabinClass).toBe('ECONOMY');
  });

  test('should return hotels with default guests and rooms when omitted', async () => {
    const hotels = await mockProvider.searchHotels({
      city: 'DaNang',
      checkIn: '2026-11-15',
      checkOut: '2026-11-18',
    });

    expect(hotels).toBeInstanceOf(Array);
    expect(hotels.length).toBeGreaterThan(0);
    expect(hotels[0].name).toBeDefined();
  });
});
