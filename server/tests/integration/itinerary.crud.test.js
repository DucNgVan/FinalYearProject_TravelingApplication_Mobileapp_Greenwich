const request = require('supertest');
const app = require('../../src/app');
const { generateAccessToken } = require('../../src/services/token.service');

describe('Integration Test: Itinerary CRUD Endpoints', () => {
  const ownerUser = {
    userId: 'owner-uuid-1111',
    email: 'owner@nomadix.vn',
    role: 'traveler',
  };
  const ownerToken = generateAccessToken(ownerUser);

  const strangerUser = {
    userId: 'stranger-uuid-9999',
    email: 'stranger@nomadix.vn',
    role: 'traveler',
  };
  const strangerToken = generateAccessToken(strangerUser);

  let createdTripId;

  test('RED-IT-05: POST /api/v1/itineraries should create itinerary with creator as OWNER', async () => {
    const tripPayload = {
      title: 'Kham Pha Da Nang 4N3D',
      destinationCity: 'DaNang',
      startDate: '2026-11-20',
      endDate: '2026-11-23',
      visibility: 'PRIVATE',
      budget: { total: 15000000, currency: 'VND' },
    };

    const res = await request(app)
      .post('/api/v1/itineraries')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send(tripPayload);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.itinerary).toBeDefined();

    const trip = res.body.data.itinerary;
    createdTripId = trip.id || trip._id;
    expect(trip.title).toBe(tripPayload.title);
    expect(trip.totalDays).toBe(4);
    expect(trip.days).toHaveLength(4);
    expect(trip.collaborators).toHaveLength(1);
    expect(trip.collaborators[0].userId).toBe(ownerUser.userId);
    expect(trip.collaborators[0].role).toBe('OWNER');
    expect(trip.collaborators[0].status).toBe('ACCEPTED');
  });

  test('RED-IT-06: POST /api/v1/itineraries should return 400 when endDate precedes startDate', async () => {
    const invalidDatesPayload = {
      title: 'Invalid Date Trip',
      destinationCity: 'HaNoi',
      startDate: '2026-11-25',
      endDate: '2026-11-20',
    };

    const res = await request(app)
      .post('/api/v1/itineraries')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send(invalidDatesPayload);

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
    expect(res.body.error.message).toMatch(/endDate|after|greater/i);
  });

  test('RED-IT-07: GET /api/v1/itineraries should return user itineraries', async () => {
    const res = await request(app)
      .get('/api/v1/itineraries')
      .set('Authorization', `Bearer ${ownerToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.itineraries).toBeInstanceOf(Array);
    expect(res.body.data.itineraries.length).toBeGreaterThanOrEqual(1);
  });

  test('RED-IT-08: GET /api/v1/itineraries/:id should return 403 Forbidden for non-collaborator on PRIVATE trip', async () => {
    const res = await request(app)
      .get(`/api/v1/itineraries/${createdTripId}`)
      .set('Authorization', `Bearer ${strangerToken}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('FORBIDDEN');
  });

  test('should return 404 for non-existent itinerary', async () => {
    const res = await request(app)
      .get('/api/v1/itineraries/non-existent-id')
      .set('Authorization', `Bearer ${ownerToken}`);

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });

  test('should return 403 when non-owner attempts to delete itinerary', async () => {
    const res = await request(app)
      .delete(`/api/v1/itineraries/${createdTripId}`)
      .set('Authorization', `Bearer ${strangerToken}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  test('should allow OWNER to delete itinerary', async () => {
    const res = await request(app)
      .delete(`/api/v1/itineraries/${createdTripId}`)
      .set('Authorization', `Bearer ${ownerToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
