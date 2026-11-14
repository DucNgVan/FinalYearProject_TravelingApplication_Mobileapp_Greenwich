const request = require('supertest');
const app = require('../../src/app');
const itineraryService = require('../../src/services/itinerary.service');
const { generateAccessToken } = require('../../src/services/token.service');

describe('Integration Test: /api/v1/itineraries/:tripId/packing-list', () => {
  let tripId;
  let token;

  beforeEach(async () => {
    token = generateAccessToken({ id: 'user-pck-test', role: 'USER' });
    const trip = await itineraryService.createItinerary({
      userId: 'user-pck-test',
      title: 'Hoi An Ancient Town Trip',
      destination: 'Hoi An',
      startDate: '2026-11-20',
      endDate: '2026-11-23',
    });
    tripId = trip.id;
  });

  it('RED-PCK-04: POST /api/v1/itineraries/:tripId/packing-list should add item with 201 Created', async () => {
    const res = await request(app)
      .post(`/api/v1/itineraries/${tripId}/packing-list`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Sunscreen SPF 50+',
        category: 'Personal',
        assignee: 'Alex',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe('Sunscreen SPF 50+');
  });

  it('RED-PCK-05: GET /api/v1/itineraries/:tripId/packing-list should return items array', async () => {
    await request(app)
      .post(`/api/v1/itineraries/${tripId}/packing-list`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Camera', category: 'Gear', assignee: 'Duc' });

    const res = await request(app)
      .get(`/api/v1/itineraries/${tripId}/packing-list`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(1);
  });
});
