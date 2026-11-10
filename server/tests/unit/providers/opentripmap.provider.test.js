const OpenTripMapProvider = require('../../../src/providers/opentripmap.provider');

describe('Unit Test: OpenTripMapProvider (Sync-and-Serve Provider)', () => {
  let provider;
  const mockApiKey = '5ae2e3f221c38a28845f05b6f24ffb45029bc3e75018d74e96a32315';

  beforeEach(() => {
    provider = new OpenTripMapProvider({ apiKey: mockApiKey });
  });

  test('RED-OTM-01: searchPlacesByCity queries geoname and radius endpoints', async () => {
    const mockGeonameData = {
      name: 'danang',
      country: 'VN',
      lat: 16.06778,
      lon: 108.22083,
      status: 'OK',
    };

    const mockRadiusData = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          id: '4987230',
          geometry: { type: 'Point', coordinates: [108.2207413, 16.0688438] },
          properties: {
            xid: 'W295178327',
            name: 'Nhà hát Trưng Vương',
            dist: 118.19,
            rate: 2,
            kinds: 'cultural,theatres_and_entertainments',
          },
        },
      ],
    };

    const mockFetch = jest.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockGeonameData,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockRadiusData,
      });

    provider.fetchClient = mockFetch;

    const places = await provider.searchPlacesByCity('Danang', { radius: 5000 });

    expect(places).toBeInstanceOf(Array);
    expect(places.length).toBe(1);
    expect(places[0].name).toBe('Nhà hát Trưng Vương');
    expect(places[0].lat).toBe(16.0688438);
    expect(places[0].lng).toBe(108.2207413);
    expect(places[0].city).toBe('Danang');
  });

  test('RED-OTM-02: normalizePlace maps OpenTripMap feature to UnifiedPlace schema', () => {
    const feature = {
      geometry: { coordinates: [108.2232971, 16.0666752] },
      properties: {
        xid: 'Q74723',
        name: 'Da Nang Cathedral',
        rate: 3,
        kinds: 'religion,other_temples,interesting_places',
      },
    };

    const details = {
      address: { road: 'Trần Phú', town: 'Hải Châu', state: 'Đà Nẵng' },
      preview: { source: 'https://upload.wikimedia.org/cathedral.jpg' },
      wikipedia_extracts: { text: 'Sacred Heart Cathedral in Da Nang' },
    };

    const normalized = provider.normalizePlace(feature, 'Danang', details);

    expect(normalized).toEqual(
      expect.objectContaining({
        id: 'otm-Q74723',
        name: 'Da Nang Cathedral',
        city: 'Danang',
        lat: 16.0666752,
        lng: 108.2232971,
        category: 'religion',
        rating: 4.5, // 3 * 1.5 or mapped from rate
        image: 'https://upload.wikimedia.org/cathedral.jpg',
        address: 'Trần Phú, Hải Châu, Đà Nẵng',
        description: 'Sacred Heart Cathedral in Da Nang',
      })
    );
  });

  test('RED-OTM-03: falls back safely to curated catalog when API throws or key is invalid', async () => {
    provider.fetchClient = jest.fn().mockRejectedValue(new Error('Network error'));

    const places = await provider.searchPlacesByCity('Danang');

    expect(places).toBeInstanceOf(Array);
    expect(places.length).toBeGreaterThan(0);
    expect(places[0]).toHaveProperty('name');
    expect(places[0]).toHaveProperty('lat');
    expect(places[0]).toHaveProperty('lng');
  });

  test('RED-OTM-04: normalizePlace uses authentic landmark photo from registry when detail preview is missing', () => {
    const feature = {
      geometry: { coordinates: [108.2272, 16.061] },
      properties: {
        xid: 'W123456',
        name: 'Dragon Bridge (Cầu Rồng)',
        rate: 3,
        kinds: 'historic,bridges',
      },
    };

    // No preview provided in details
    const normalized = provider.normalizePlace(feature, 'Danang', {});
    expect(normalized.image).not.toBe('https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=600&q=80');
    expect(
      normalized.image.includes('Cau_Rong') ||
      normalized.image.includes('Dragon_Bridge') ||
      normalized.image.includes('dragon')
    ).toBe(true);
  });
});
