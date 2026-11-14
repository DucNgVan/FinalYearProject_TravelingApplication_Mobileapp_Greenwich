const request = require('supertest');
const app = require('../../src/app');
const { generateAccessToken } = require('../../src/services/token.service');
const itineraryRepository = require('../../src/repositories/itinerary.repository');

describe('TDD RED: Itinerary Persistence & Rich Wizard Payload (MongoDB)', () => {
  let authToken;
  const testUserId = 'usr-test-squad-1';

  beforeAll(() => {
    authToken = generateAccessToken({
      id: testUserId,
      email: 'squad.leader@nomadix.app',
      role: 'User',
    });
  });

  test('RED-ITIN-PERSIST-01: POST /api/v1/itineraries accepts rich wizard payload with number budget, days, and metadata', async () => {
    const wizardPayload = {
      title: 'Hà Nội Expedition',
      destinationCity: 'Hà Nội',
      destination: 'Hà Nội',
      country: 'Việt Nam',
      coverImage: 'https://images.unsplash.com/photo-hanoi-test',
      startDate: '2026-11-15',
      endDate: '2026-11-18',
      daysCount: 3,
      budget: 10500000, // Number budget as sent by Wizard
      budgetPerPerson: 3500000,
      travelMode: 'group',
      travelersCount: 3,
      status: 'Ready',
      days: [
        {
          dayNumber: 1,
          date: '2026-11-15',
          items: [
            {
              id: 'spot-hanoi-1',
              name: 'Văn Miếu Quốc Tử Giám',
              category: 'Heritage',
              time: '09:00',
              duration: '2h',
              cost: 70000,
            },
          ],
        },
        {
          dayNumber: 2,
          date: '2026-11-16',
          items: [
            {
              id: 'spot-hanoi-2',
              name: 'Hoàng Thành Thăng Long',
              category: 'Heritage',
              time: '09:00',
              duration: '2.5h',
              cost: 100000,
            },
          ],
        },
        {
          dayNumber: 3,
          date: '2026-11-17',
          items: [
            {
              id: 'spot-hanoi-3',
              name: 'Cà Phê Giảng',
              category: 'Cafe',
              time: '14:00',
              duration: '1h',
              cost: 45000,
            },
          ],
        },
      ],
    };

    const res = await request(app)
      .post('/api/v1/itineraries')
      .set('Authorization', `Bearer ${authToken}`)
      .send(wizardPayload);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    const created = res.body.data.itinerary || res.body.data;
    expect(created).toBeDefined();
    expect(created.title).toBe('Hà Nội Expedition');
    expect(created.destinationCity).toBe('Hà Nội');
    expect(created.country).toBe('Việt Nam');
    expect(created.travelMode).toBe('group');
    expect(created.travelersCount).toBe(3);
    expect(created.days).toHaveLength(3);
    expect(created.days[0].items[0].name).toBe('Văn Miếu Quốc Tử Giám');
  });

  test('RED-ITIN-PERSIST-02: GET /api/v1/itineraries returns created trips with full days and metadata intact', async () => {
    const res = await request(app)
      .get('/api/v1/itineraries')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    const list = res.body.data.itineraries || res.body.data;
    expect(Array.isArray(list)).toBe(true);
    expect(list.length).toBeGreaterThanOrEqual(1);

    const target = list.find((t) => t.title === 'Hà Nội Expedition');
    expect(target).toBeDefined();
    expect(target.days).toHaveLength(3);
    expect(target.travelMode).toBe('group');
  });

  test('RED-ITIN-PERSIST-03: POST /api/v1/itineraries allows guest exploration token or fallback when authenticated as guest', async () => {
    const guestToken = generateAccessToken({
      id: 'guest-explorer-99',
      email: 'guest@nomadix.app',
      role: 'Guest',
    });

    const res = await request(app)
      .post('/api/v1/itineraries')
      .set('Authorization', `Bearer ${guestToken}`)
      .send({
        title: 'Guest Exploration',
        destinationCity: 'Đà Nẵng',
        startDate: '2026-11-20',
        endDate: '2026-11-23',
        budget: 5000000,
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });
});
