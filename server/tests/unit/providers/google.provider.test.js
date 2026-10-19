const googleProvider = require('../../../src/providers/google.provider');

describe('Unit Test: GooglePlacesProvider', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
  });

  test('RED-GOOG-01: should throw error if GOOGLE_PLACES_API_KEY is empty', async () => {
    const GooglePlacesProviderClass = googleProvider.constructor;
    const providerWithoutKey = new GooglePlacesProviderClass('');

    await expect(
      providerWithoutKey.searchHotels({ city: 'Đà Lạt' })
    ).rejects.toThrow('GOOGLE_PLACES_API_KEY is not configured');
  });

  test('RED-GOOG-02: should map Google Places New API search response to UnifiedHotel structure', async () => {
    const mockGoogleResponse = {
      places: [
        {
          id: 'places/ChIJN1t_tDeuEmsRUsoyG83frY4',
          displayName: { text: 'Ana Mandara Villas Dalat Resort & Spa' },
          formattedAddress: 'Lê Lai, Phường 5, TP. Đà Lạt, Lâm Đồng, Việt Nam',
          rating: 4.8,
          userRatingCount: 1420,
        },
        {
          id: 'places/ChIJN2t_tDeuEmsRUsoyG83frY5',
          displayName: { text: 'Hôtel Colline Dalat' },
          formattedAddress: 'Phan Bội Châu, Phường 2, TP. Đà Lạt, Lâm Đồng',
          rating: 4.6,
          userRatingCount: 890,
        },
      ],
    };

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockGoogleResponse),
    });

    const GooglePlacesProviderClass = googleProvider.constructor;
    const provider = new GooglePlacesProviderClass('test_google_key');

    const hotels = await provider.searchHotels({
      city: 'Đà Lạt',
      checkIn: '2026-11-20',
      checkOut: '2026-11-23',
      guests: 2,
    });

    expect(hotels).toHaveLength(2);
    expect(hotels[0].provider).toBe('GOOGLE_PLACES');
    expect(hotels[0].name).toBe('Ana Mandara Villas Dalat Resort & Spa');
    expect(hotels[0].city).toBe('Đà Lạt');
    expect(hotels[0].starRating).toBe(5);
    expect(hotels[0].reviewScore).toBe(9.6); // 4.8 * 2
    expect(hotels[0].pricePerNight).toBeGreaterThan(0);
    expect(hotels[0].currency).toBe('VND');

    expect(hotels[1].name).toBe('Hôtel Colline Dalat');
    expect(hotels[1].reviewScore).toBe(9.2); // 4.6 * 2
  });

  test('RED-GOOG-03: should throw error when Google Places API returns non-200 HTTP status', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 403,
      text: jest.fn().mockResolvedValue('{"error":{"message":"API_KEY_SERVICE_BLOCKED"}}'),
    });

    const GooglePlacesProviderClass = googleProvider.constructor;
    const provider = new GooglePlacesProviderClass('blocked_key');

    await expect(
      provider.searchHotels({ city: 'Đà Lạt' })
    ).rejects.toThrow(/Google Places API returned 403/);
  });

  test('RED-GOOG-04: should return empty array when Google Places API returns no places', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({}),
    });

    const GooglePlacesProviderClass = googleProvider.constructor;
    const provider = new GooglePlacesProviderClass('test_google_key');

    const result = await provider.searchHotels({ city: 'Thành phố không tồn tại' });
    expect(result).toEqual([]);
  });
});
