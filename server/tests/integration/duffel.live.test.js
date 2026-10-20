require('dotenv').config({ path: require('path').resolve(__dirname, '../../../.env') });
const duffelProvider = require('../../src/providers/duffel.provider');

describe('Integration Test: Duffel Live Sandbox API', () => {
  const token = process.env.DUFFEL_API_TOKEN;

  beforeAll(() => {
    if (!token) {
      console.warn('Skipping live Duffel test: DUFFEL_API_TOKEN is not configured');
    }
  });

  test('RED-DUFFEL-LIVE-01: searches live flights from SGN to HAN with user Duffel token', async () => {
    if (!token) return;

    // Use tomorrow's date or 30 days ahead to ensure availability
    const departureDate = '2026-11-20';

    const flights = await duffelProvider.searchFlights({
      origin: 'SGN',
      destination: 'HAN',
      departureDate,
      passengers: 1,
      cabinClass: 'economy',
    });

    expect(Array.isArray(flights)).toBe(true);
    expect(flights.length).toBeGreaterThan(0);

    const first = flights[0];
    expect(first.provider).toBe('DUFFEL');
    expect(first.origin).toBe('SGN');
    expect(first.destination).toBe('HAN');
    expect(first.flightNumber).toBeDefined();
    expect(first.durationMinutes).toBeGreaterThan(0);
    expect(first.price).toBeDefined();
    expect(first.price.currency).toBe('VND');
    expect(first.price.amount).toBeGreaterThan(0);
  }, 35000); // 35s timeout for live network call
});
