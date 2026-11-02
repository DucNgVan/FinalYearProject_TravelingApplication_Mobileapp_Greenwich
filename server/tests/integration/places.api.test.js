const request = require('supertest');
const app = require('../../src/app');

describe('Integration Test: /api/v1/places Endpoints', () => {
  it('RED-PLC-05: GET /api/v1/places/search should return 200 with places list', async () => {
    const res = await request(app)
      .get('/api/v1/places/search')
      .query({ city: 'Da Nang' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0]).toHaveProperty('id');
    expect(res.body.data[0]).toHaveProperty('name');
    expect(res.body.data[0]).toHaveProperty('lat');
    expect(res.body.data[0]).toHaveProperty('lng');
  });

  it('RED-PLC-05b: GET /api/v1/places/search should return 400 when city query parameter is missing', async () => {
    const res = await request(app)
      .get('/api/v1/places/search');

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body.error).toHaveProperty('code', 'VALIDATION_ERROR');
  });

  it('RED-PLC-06: POST /api/v1/places/ai-plan should cluster selected places into multi-day itinerary', async () => {
    const payload = {
      places: [
        { id: 'dn-01', name: 'Dragon Bridge', lat: 16.0610, lng: 108.2272 },
        { id: 'dn-02', name: 'Ba Na Hills', lat: 15.9980, lng: 107.9940 },
        { id: 'dn-03', name: 'My Khe Beach', lat: 16.0595, lng: 108.2464 }
      ],
      durationDays: 2
    };

    const res = await request(app)
      .post('/api/v1/places/ai-plan')
      .send(payload);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body.data).toHaveProperty('days');
    expect(Object.keys(res.body.data.days).length).toBe(2);
  });
});
