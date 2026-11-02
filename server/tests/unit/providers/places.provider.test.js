const PlacesProvider = require('../../../src/providers/places.provider');

describe('Unit Test: PlacesProvider (Global Places Search & Normalization)', () => {
  let provider;

  beforeEach(() => {
    provider = new PlacesProvider({
      foursquareApiKey: 'mock_key',
      mapboxToken: 'mock_token'
    });
  });

  it('RED-PLC-01: should normalize external places response into UnifiedPlace schema', () => {
    const rawFoursquareItem = {
      fsq_id: 'fsq_dn_01',
      name: 'Dragon Bridge (Cầu Rồng)',
      geocodes: {
        main: {
          latitude: 16.0610,
          longitude: 108.2272
        }
      },
      categories: [
        { id: 16000, name: 'Landmark', icon: { prefix: 'https://ss3.4sqi.net/img/categories_v2/arts_entertainment/', suffix: '.png' } }
      ],
      location: {
        formatted_address: 'Nguyen Van Linh St, Hai Chau, Da Nang',
        locality: 'Da Nang'
      },
      rating: 9.2, // Foursquare 10-point scale
      photos: [
        { prefix: 'https://fastly.4sqi.net/img/general/', suffix: '/dragon.jpg' }
      ]
    };

    const normalized = provider.normalizePlace(rawFoursquareItem, 'Da Nang');

    expect(normalized).toHaveProperty('id', 'fsq_dn_01');
    expect(normalized).toHaveProperty('name', 'Dragon Bridge (Cầu Rồng)');
    expect(normalized).toHaveProperty('city', 'Da Nang');
    expect(normalized).toHaveProperty('lat', 16.0610);
    expect(normalized).toHaveProperty('lng', 108.2272);
    expect(normalized).toHaveProperty('category', 'landmark');
    expect(normalized).toHaveProperty('categoryName', 'Landmark');
    expect(normalized.rating).toBeCloseTo(4.6, 1); // 9.2 / 2 = 4.6 on 5-star scale
    expect(normalized).toHaveProperty('address', 'Nguyen Van Linh St, Hai Chau, Da Nang');
    expect(normalized).toHaveProperty('image');
  });

  it('RED-PLC-02: should fall back to curated global catalog when API token fails or network errors', async () => {
    // Intentionally bad fetch to simulate API failure
    provider.fetchClient = jest.fn().mockRejectedValue(new Error('Network error or invalid token'));

    const places = await provider.searchPlaces({ city: 'Da Nang', category: 'all' });

    expect(Array.isArray(places)).toBe(true);
    expect(places.length).toBeGreaterThan(0);
    expect(places[0]).toHaveProperty('id');
    expect(places[0]).toHaveProperty('name');
    expect(places[0]).toHaveProperty('lat');
    expect(places[0]).toHaveProperty('lng');
    expect(places[0].city.toLowerCase()).toContain('da nang');
  });

  it('RED-PLC-02b: should support global cities such as Tokyo and Paris in fallback catalog', async () => {
    provider.fetchClient = jest.fn().mockRejectedValue(new Error('API failure'));

    const tokyoPlaces = await provider.searchPlaces({ city: 'Tokyo', category: 'all' });
    expect(Array.isArray(tokyoPlaces)).toBe(true);
    expect(tokyoPlaces.length).toBeGreaterThan(0);
    expect(tokyoPlaces[0].city).toBe('Tokyo');

    const parisPlaces = await provider.searchPlaces({ city: 'Paris', category: 'all' });
    expect(Array.isArray(parisPlaces)).toBe(true);
    expect(parisPlaces.length).toBeGreaterThan(0);
    expect(parisPlaces[0].city).toBe('Paris');
  });

  it('RED-PLC-02c: should filter by category and query string in searchPlaces', async () => {
    provider.fetchClient = jest.fn().mockRejectedValue(new Error('Use fallback'));

    const foodPlaces = await provider.searchPlaces({ city: 'Da Nang', category: 'food' });
    expect(foodPlaces.every((p) => p.category === 'food')).toBe(true);

    const queryPlaces = await provider.searchPlaces({ city: 'Da Nang', query: 'Cầu Rồng' });
    expect(queryPlaces.some((p) => p.name.includes('Cầu Rồng'))).toBe(true);
  });

  it('RED-PLC-02d: should parse successful API results when fetchClient returns raw items', async () => {
    provider.fetchClient = jest.fn().mockResolvedValue([
      {
        id: 'ext-1',
        name: 'Hoi An Ancient Town',
        lat: 15.88,
        lng: 108.33,
        category: 'temple pagoda',
        image: 'https://example.com/hoian.jpg',
      },
      {
        id: 'ext-2',
        name: 'An Bang Beach',
        lat: 15.90,
        lng: 108.34,
        category: 'bãi biển',
      },
      {
        id: 'ext-3',
        name: 'Bach Ma National Park',
        lat: 16.20,
        lng: 107.85,
        category: 'công viên nature',
      },
    ]);

    const places = await provider.searchPlaces({ city: 'Hoi An' });
    expect(places).toHaveLength(3);
    expect(places[0].category).toBe('culture');
    expect(places[1].category).toBe('beach');
    expect(places[2].category).toBe('nature');
  });

  it('RED-PLC-02e: should support Hanoi and New York catalogs and address fallbacks', async () => {
    provider.fetchClient = jest.fn().mockRejectedValue(new Error('Fallback'));

    const hanoi = await provider.searchPlaces({ city: 'Hanoi' });
    expect(hanoi.length).toBeGreaterThan(0);

    const ny = await provider.searchPlaces({ city: 'New York' });
    expect(ny.length).toBeGreaterThan(0);

    const generic = await provider.searchPlaces({ city: 'London' });
    expect(generic.length).toBeGreaterThan(0);
  });
});
