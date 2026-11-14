const request = require('supertest');
const app = require('../../src/app');
const tokenService = require('../../src/services/token.service');

describe('Integration Test: /api/v1/gamification Endpoints', () => {
  let authToken;
  const testUser = {
    id: 'gam-user-test-id-1',
    email: 'traveler@nomadix.app',
    role: 'USER',
  };

  beforeAll(() => {
    authToken = tokenService.generateAccessToken(testUser);
  });

  describe('GET /api/v1/gamification/landmarks', () => {
    it('RED-GAM-API-01: returns 200 with list of cultural landmarks', async () => {
      const res = await request(app)
        .get('/api/v1/gamification/landmarks')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.data[0]).toHaveProperty('name');
      expect(res.body.data[0]).toHaveProperty('latitude');
      expect(res.body.data[0]).toHaveProperty('longitude');
    });
  });

  describe('POST /api/v1/gamification/checkin', () => {
    it('RED-GAM-API-02: returns 422 when GPS is outside 100m geofence', async () => {
      const res = await request(app)
        .post('/api/v1/gamification/checkin')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          landmarkId: 'lm-danang-dragon',
          latitude: 10.762622, // Ho Chi Minh City coordinates
          longitude: 106.660172,
        });

      expect(res.status).toBe(422);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body.error).toHaveProperty('message');
    });

    it('RED-GAM-API-03: returns 201 Created when GPS is verified within geofence', async () => {
      const res = await request(app)
        .post('/api/v1/gamification/checkin')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          landmarkId: 'lm-danang-dragon',
          latitude: 16.0611,
          longitude: 108.2238,
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toHaveProperty('xpEarned', 150);
      expect(res.body.data).toHaveProperty('currentLevel');
    });
  });

  describe('GET /api/v1/gamification/badges & profile', () => {
    it('RED-GAM-API-04: returns 200 with badges catalog and user profile', async () => {
      const resBadges = await request(app)
        .get('/api/v1/gamification/badges')
        .set('Authorization', `Bearer ${authToken}`);

      expect(resBadges.status).toBe(200);
      expect(resBadges.body).toHaveProperty('success', true);
      expect(Array.isArray(resBadges.body.data)).toBe(true);

      const resProfile = await request(app)
        .get('/api/v1/gamification/profile')
        .set('Authorization', `Bearer ${authToken}`);

      expect(resProfile.status).toBe(200);
      expect(resProfile.body.data).toHaveProperty('level');
      expect(resProfile.body.data).toHaveProperty('xp');
    });
  });
});
