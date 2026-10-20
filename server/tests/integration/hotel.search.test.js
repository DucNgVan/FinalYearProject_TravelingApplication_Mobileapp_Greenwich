const request = require('supertest');
const app = require('../../src/app');

describe('Integration Test: GET /api/v1/hotels/search (TDD RED Phase)', () => {
  const validCheckIn = '2026-11-15';
  const validCheckOut = '2026-11-18'; // 3 nights

  test('RED-BK-10: should return 200 OK with hotel options for valid query parameters', async () => {
    const res = await request(app)
      .get('/api/v1/hotels/search')
      .query({
        city: 'DaNang',
        checkIn: validCheckIn,
        checkOut: validCheckOut,
        guests: 2,
        rooms: 1,
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.hotels).toBeInstanceOf(Array);
    expect(res.body.data.hotels.length).toBeGreaterThan(0);

    const firstHotel = res.body.data.hotels[0];
    expect(firstHotel.name).toBeDefined();
    expect(firstHotel.pricePerNight).toBeGreaterThan(0);
    expect(firstHotel.totalPrice).toBe(firstHotel.pricePerNight * 3);
    expect(firstHotel.nights).toBe(3);
  });

  test('RED-BK-11: should return 400 Bad Request when checkOut is earlier than or equal to checkIn', async () => {
    const res = await request(app)
      .get('/api/v1/hotels/search')
      .query({
        city: 'DaNang',
        checkIn: validCheckIn,
        checkOut: validCheckIn, // 0 nights
        guests: 2,
        rooms: 1,
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
    expect(res.body.error.message).toMatch(/checkOut|after/i);
  });

  test('RED-BK-12: should return 400 Bad Request when guests exceed capacity (maximum 4 guests per room)', async () => {
    const res = await request(app)
      .get('/api/v1/hotels/search')
      .query({
        city: 'DaNang',
        checkIn: validCheckIn,
        checkOut: validCheckOut,
        guests: 6, // 6 guests in 1 room exceeds 4
        rooms: 1,
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
    expect(res.body.error.message).toMatch(/capacity|room|guest/i);
  });

  test('should filter hotels by minRating and maxPrice', async () => {
    const res = await request(app)
      .get('/api/v1/hotels/search')
      .query({
        city: 'DaNang',
        checkIn: validCheckIn,
        checkOut: validCheckOut,
        guests: 2,
        rooms: 1,
        minRating: 4,
        maxPrice: 3000000,
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    const { hotels } = res.body.data;
    hotels.forEach((hotel) => {
      expect(hotel.starRating).toBeGreaterThanOrEqual(4);
      expect(hotel.pricePerNight).toBeLessThanOrEqual(3000000);
    });
  });
});
