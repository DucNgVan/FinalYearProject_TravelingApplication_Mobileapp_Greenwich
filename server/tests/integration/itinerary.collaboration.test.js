const request = require('supertest');
const app = require('../../src/app');
const { generateAccessToken } = require('../../src/services/token.service');

describe('Integration Test: Squad Collaboration & Permissions', () => {
  const owner = { userId: 'squad-owner-uuid', email: 'owner@nomadix.vn', role: 'traveler' };
  const ownerToken = generateAccessToken(owner);

  const editor = { userId: 'squad-editor-uuid', email: 'editor@nomadix.vn', role: 'traveler' };
  const editorToken = generateAccessToken(editor);

  const viewer = { userId: 'squad-viewer-uuid', email: 'viewer@nomadix.vn', role: 'traveler' };
  const viewerToken = generateAccessToken(viewer);

  let tripId;

  beforeAll(async () => {
    // Create base trip
    const res = await request(app)
      .post('/api/v1/itineraries')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        title: 'Chuyen Di Cung Ban Be',
        destinationCity: 'DaNang',
        startDate: '2026-11-20',
        endDate: '2026-11-23',
        visibility: 'PRIVATE',
      });

    tripId = res.body.data.itinerary.id || res.body.data.itinerary._id;
  });

  test('RED-IT-09: POST /:id/collaborators should allow OWNER to invite squad members with PENDING status', async () => {
    // Invite editor
    const res = await request(app)
      .post(`/api/v1/itineraries/${tripId}/collaborators`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        userId: editor.userId,
        role: 'EDITOR',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.collaborators).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          userId: editor.userId,
          role: 'EDITOR',
          status: 'PENDING',
        }),
      ])
    );

    // Also invite viewer
    await request(app)
      .post(`/api/v1/itineraries/${tripId}/collaborators`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        userId: viewer.userId,
        role: 'VIEWER',
      });
  });

  test('RED-IT-11: PATCH /:id/collaborators/:userId/status should allow invited user to accept invitation', async () => {
    const res = await request(app)
      .patch(`/api/v1/itineraries/${tripId}/collaborators/${editor.userId}/status`)
      .set('Authorization', `Bearer ${editorToken}`)
      .send({ status: 'ACCEPTED' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    const updatedEditor = res.body.data.collaborators.find((c) => c.userId === editor.userId);
    expect(updatedEditor.status).toBe('ACCEPTED');
  });

  test('RED-IT-10: VIEWER role should be blocked from adding stops (403 Forbidden)', async () => {
    const stopPayload = {
      title: 'Diem Den Thu Nghiem',
      activityType: 'ATTRACTION',
      location: {
        name: 'Cau Rong',
        address: 'Nguyen Van Linh, Hai Chau, Da Nang',
        coordinates: { lat: 16.0601, lng: 108.2269 },
      },
    };

    const res = await request(app)
      .post(`/api/v1/itineraries/${tripId}/days/1/items`)
      .set('Authorization', `Bearer ${viewerToken}`)
      .send(stopPayload);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('FORBIDDEN');
  });

  test('should return 403 when VIEWER attempts to invite collaborators', async () => {
    const res = await request(app)
      .post(`/api/v1/itineraries/${tripId}/collaborators`)
      .set('Authorization', `Bearer ${viewerToken}`)
      .send({ userId: 'random-uuid', role: 'VIEWER' });

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  test('should return 404 when updating status for non-member', async () => {
    const res = await request(app)
      .patch(`/api/v1/itineraries/${tripId}/collaborators/non-existent-user/status`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ status: 'ACCEPTED' });

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  test('should return 404 when adding stop to non-existent day or trip', async () => {
    const res = await request(app)
      .post(`/api/v1/itineraries/${tripId}/days/999/items`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        title: 'Ghost Day Stop',
        location: { name: 'X', address: 'Y', coordinates: { lat: 10, lng: 10 } },
      });

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});
