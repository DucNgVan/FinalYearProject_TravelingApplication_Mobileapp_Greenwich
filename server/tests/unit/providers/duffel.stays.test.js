const duffelProvider = require('../../../src/providers/duffel.provider');

describe('Unit Test: Duffel Stays API Provider (RED Phase)', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.clearAllMocks();
  });

  test('RED-DUFFEL-STAYS-01: searchHotels should call Duffel Stays API and map response to UnifiedHotel schema', async () => {
    const mockDuffelStaysResponse = {
      data: {
        results: [
          {
            id: 'acc_0000A123',
            accommodation: {
              id: 'acc_0000A123',
              name: 'Novotel Danang Premier Han River',
              rating: 4,
              review_score: 4.6,
              location: {
                address: {
                  line_one: '36 Bach Dang Street',
                  city_name: 'Da Nang',
                  country_code: 'VN',
                },
                geographic_coordinates: {
                  latitude: 16.0748,
                  longitude: 108.2243,
                },
              },
              photos: [
                { url: 'https://assets.duffel.com/stays/photo1.jpg' },
              ],
            },
            cheapest_rate_total_amount: '120.00',
            cheapest_rate_currency: 'USD',
          },
        ],
      },
    };

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue(mockDuffelStaysResponse),
    });

    // Expect method to exist and return mapped hotels
    expect(typeof duffelProvider.searchHotels).toBe('function');

    const hotels = await duffelProvider.searchHotels({
      city: 'Da Nang',
      checkIn: '2026-11-14',
      checkOut: '2026-11-17',
      guests: 2,
      rooms: 1,
    });

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/stays/search'),
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: expect.stringContaining('Bearer'),
        }),
      })
    );

    expect(hotels).toHaveLength(1);
    expect(hotels[0]).toMatchObject({
      id: 'acc_0000A123',
      provider: 'DUFFEL_STAYS',
      name: 'Novotel Danang Premier Han River',
      city: 'Da Nang',
      starRating: 4,
      currency: 'VND',
    });
    expect(hotels[0].pricePerNight).toBeGreaterThan(0);
  });

  test('RED-DUFFEL-STAYS-02: searchHotels should throw error if Duffel API returns HTTP error', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
      text: jest.fn().mockResolvedValue('Internal Server Error in Stays Service'),
    });

    await expect(
      duffelProvider.searchHotels({
        city: 'Da Nang',
        checkIn: '2026-11-14',
        checkOut: '2026-11-17',
      })
    ).rejects.toThrow(/Duffel Stays API returned 500/);
  });
});
