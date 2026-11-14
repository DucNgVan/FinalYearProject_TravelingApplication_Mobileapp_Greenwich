const request = require('supertest');
const app = require('../../src/app');

describe('Integration Test: GET /api/v1/weather/forecast', () => {
  it('RED-WTH-03: should return 200 OK with verified current weather and 4-day forecast', async () => {
    const res = await request(app)
      .get('/api/v1/weather/forecast')
      .query({ lat: 16.0544, lng: 108.2022, city: 'Da Nang' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeDefined();
    expect(res.body.data.city).toBe('Da Nang');
    expect(res.body.data.temp).toBeDefined();
    expect(Array.isArray(res.body.data.forecast)).toBe(true);
    expect(res.body.data.forecast.length).toBeGreaterThanOrEqual(4);
  });
});
