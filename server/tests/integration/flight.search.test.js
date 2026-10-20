const request = require('supertest');
const app = require('../../src/app');

describe('Integration Test: GET /api/v1/flights/search (TDD RED Phase)', () => {
  // Use dates far enough in the future for deterministic tests
  const validFutureDate = '2026-11-20';

  test('RED-BK-06: should return 200 OK with flight offers for valid query parameters', async () => {
    const res = await request(app)
      .get('/api/v1/flights/search')
      .query({
        origin: 'HAN',
        destination: 'DAD',
        departureDate: validFutureDate,
        passengers: 1,
        cabinClass: 'ECONOMY',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.flights).toBeInstanceOf(Array);
    expect(res.body.data.flights.length).toBeGreaterThan(0);
    expect(res.body.meta).toBeDefined();
    expect(res.body.meta.totalResults).toBeDefined();
  });

  test('RED-BK-07: should return 400 Bad Request when departureDate is in the past', async () => {
    const res = await request(app)
      .get('/api/v1/flights/search')
      .query({
        origin: 'HAN',
        destination: 'DAD',
        departureDate: '2020-01-01',
        passengers: 1,
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
    expect(res.body.error.message).toMatch(/departureDate/i);
  });

  test('RED-BK-08: should return 400 Bad Request when origin and destination are identical', async () => {
    const res = await request(app)
      .get('/api/v1/flights/search')
      .query({
        origin: 'HAN',
        destination: 'HAN',
        departureDate: validFutureDate,
        passengers: 1,
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
    expect(res.body.error.message).toMatch(/identical|same/i);
  });

  test('RED-BK-09: should filter flights by directOnly and maxPrice', async () => {
    const res = await request(app)
      .get('/api/v1/flights/search')
      .query({
        origin: 'HAN',
        destination: 'DAD',
        departureDate: validFutureDate,
        passengers: 1,
        directOnly: 'true',
        maxPrice: '1500000',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    const { flights } = res.body.data;
    flights.forEach((flight) => {
      expect(flight.stops).toBe(0);
      expect(flight.price.amount).toBeLessThanOrEqual(1500000);
    });
  });
});
