const request = require('supertest');
const app = require('../../src/app');
const { generateAccessToken } = require('../../src/services/token.service');

describe('Integration Test: Itinerary Timeline & Stop Reordering', () => {
  const user = { userId: 'timeline-planner-uuid', email: 'planner@nomadix.vn', role: 'traveler' };
  const userToken = generateAccessToken(user);

  let tripId;
  let firstStopId;
  let secondStopId;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/v1/itineraries')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        title: 'Timeline Test Trip',
        destinationCity: 'DaNang',
        startDate: '2026-11-20',
        endDate: '2026-11-22',
        visibility: 'PRIVATE',
      });

    tripId = res.body.data.itinerary.id || res.body.data.itinerary._id;
  });

  test('RED-IT-12: POST /:id/days/:day/items should add stop to specified day with orderIndex 0', async () => {
    const dragonBridge = {
      title: 'Tham quan Cau Rong',
      activityType: 'ATTRACTION',
      location: {
        name: 'Cau Rong Da Nang',
        address: 'Nguyen Van Linh, Da Nang',
        coordinates: { lat: 16.0601, lng: 108.2269 },
      },
    };

    const res = await request(app)
      .post(`/api/v1/itineraries/${tripId}/days/1/items`)
      .set('Authorization', `Bearer ${userToken}`)
      .send(dragonBridge);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);

    const day1 = res.body.data.itinerary.days.find((d) => d.dayNumber === 1);
    expect(day1.items).toHaveLength(1);
    expect(day1.items[0].title).toBe(dragonBridge.title);
    expect(day1.items[0].orderIndex).toBe(0);

    firstStopId = day1.items[0].id;
  });

  test('RED-IT-13: Adding second stop should calculate transitToNext distance on preceding stop', async () => {
    const marbleMountains = {
      title: 'Kham pha Ngu Hanh Son',
      activityType: 'ATTRACTION',
      location: {
        name: 'Ngu Hanh Son',
        address: 'Huyen Tran Cong Chua, Da Nang',
        coordinates: { lat: 16.0028, lng: 108.2635 }, // ~7-8 km away
      },
    };

    const res = await request(app)
      .post(`/api/v1/itineraries/${tripId}/days/1/items`)
      .set('Authorization', `Bearer ${userToken}`)
      .send(marbleMountains);

    expect(res.status).toBe(201);
    const day1 = res.body.data.itinerary.days.find((d) => d.dayNumber === 1);
    expect(day1.items).toHaveLength(2);

    // Preceding stop (Dragon Bridge) should now have transitToNext
    const stop1 = day1.items[0];
    expect(stop1.transitToNext).toBeDefined();
    expect(stop1.transitToNext.distanceMeters).toBeGreaterThan(6000);
    expect(stop1.transitToNext.durationMinutes).toBeGreaterThan(0);

    secondStopId = day1.items[1].id;
  });

  test('RED-IT-14: PUT /:id/days/:day/reorder should atomically reorder items', async () => {
    // Reverse the order of the 2 stops
    const reorderedItemIds = [secondStopId, firstStopId];

    const res = await request(app)
      .put(`/api/v1/itineraries/${tripId}/days/1/reorder`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ itemIds: reorderedItemIds });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    const day1 = res.body.data.itinerary.days.find((d) => d.dayNumber === 1);
    expect(day1.items[0].id).toBe(secondStopId);
    expect(day1.items[0].orderIndex).toBe(0);
    expect(day1.items[1].id).toBe(firstStopId);
    expect(day1.items[1].orderIndex).toBe(1);
  });
});
