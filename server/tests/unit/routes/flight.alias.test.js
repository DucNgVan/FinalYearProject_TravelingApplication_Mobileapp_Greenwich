const request = require('supertest');
const app = require('../../../src/app');

describe('Flight Route Alias (RED Phase)', () => {
  it('RED-FLIGHT-01: should support GET /api/v1/flights as an alias for /search', async () => {
    const res = await request(app)
      .get('/api/v1/flights')
      .query({
        origin: 'SGN',
        destination: 'HAN',
        departureDate: '2026-11-20',
        passengers: 1,
      });

    // Should not return 404
    expect(res.status).not.toBe(404);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.flights)).toBe(true);
  });
});
