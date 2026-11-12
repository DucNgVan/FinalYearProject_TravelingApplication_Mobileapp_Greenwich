const { hotelSearchSchema } = require('../../../src/middlewares/validate.middleware');
const request = require('supertest');
const app = require('../../../src/app');
const duffelProvider = require('../../../src/providers/duffel.provider');

describe('Unit & Integration Test: Hotel Search Schema with Destination & City', () => {
  const validCheckIn = '2026-11-20';
  const validCheckOut = '2026-11-23';

  beforeEach(() => {
    jest.spyOn(duffelProvider, 'searchHotels').mockResolvedValue([
      {
        id: 'duffel-acc-01',
        provider: 'DUFFEL_STAYS',
        name: 'Vinpearl Luxury Da Nang',
        city: 'Da Nang',
        address: 'Truong Sa, Da Nang',
        starRating: 5,
        reviewScore: 9.4,
        pricePerNight: 2800000,
        currency: 'VND',
        thumbnailUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600',
      },
    ]);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('RED-HOTEL-SCHEMA-DEST-01: hotelSearchSchema allows destination alongside or instead of city', () => {
    // 1. Valid with city and destination
    const res1 = hotelSearchSchema.validate({
      city: 'Da Nang',
      destination: 'Da Nang',
      checkIn: validCheckIn,
      checkOut: validCheckOut,
      guests: 2,
      rooms: 1,
    });
    expect(res1.error).toBeUndefined();

    // 2. Valid with destination only
    const res2 = hotelSearchSchema.validate({
      destination: 'Hoi An',
      checkIn: validCheckIn,
      checkOut: validCheckOut,
      guests: 2,
      rooms: 1,
    });
    expect(res2.error).toBeUndefined();
  });

  test('RED-HOTEL-SCHEMA-DEST-02: GET /api/v1/hotels/search succeeds when passing destination', async () => {
    const res = await request(app)
      .get('/api/v1/hotels/search')
      .query({
        destination: 'DaNang',
        city: 'DaNang',
        checkIn: validCheckIn,
        checkOut: validCheckOut,
        guests: 2,
        rooms: 1,
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.hotels).toBeInstanceOf(Array);
  });
});
