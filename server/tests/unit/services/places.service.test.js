const PlacesService = require('../../../src/services/places.service');

describe('Unit Test: PlacesService (Cache-Aside & AI Geographic Clustering)', () => {
  let placesService;
  let mockProvider;
  let mockCache;

  beforeEach(() => {
    mockProvider = {
      searchPlaces: jest.fn().mockResolvedValue([
        { id: 'p1', name: 'Dragon Bridge', city: 'Da Nang', lat: 16.0610, lng: 108.2272, category: 'landmark' },
        { id: 'p2', name: 'My Khe Beach', city: 'Da Nang', lat: 16.0595, lng: 108.2464, category: 'beach' },
        { id: 'p3', name: 'Linh Ung Pagoda', city: 'Da Nang', lat: 16.1001, lng: 108.2755, category: 'landmark' },
        { id: 'p4', name: 'Ba Na Hills', city: 'Da Nang', lat: 15.9980, lng: 107.9940, category: 'landmark' },
        { id: 'p5', name: 'Hoi An Ancient Town', city: 'Hoi An', lat: 15.8770, lng: 108.3262, category: 'landmark' }
      ])
    };

    const memoryCache = new Map();
    mockCache = {
      get: jest.fn(async (key) => memoryCache.get(key) || null),
      set: jest.fn(async (key, val, ttl) => memoryCache.set(key, val))
    };

    placesService = new PlacesService({
      provider: mockProvider,
      cache: mockCache
    });
  });

  it('RED-PLC-03: should fetch from cache on hit and call provider only on cache miss', async () => {
    // 1st call: Cache miss -> calls provider
    const res1 = await placesService.searchPlaces({ city: 'Da Nang' });
    expect(res1.length).toBe(5);
    expect(mockProvider.searchPlaces).toHaveBeenCalledTimes(1);
    expect(mockCache.set).toHaveBeenCalledTimes(1);

    // 2nd call: Cache hit -> returns directly from cache
    const res2 = await placesService.searchPlaces({ city: 'Da Nang' });
    expect(res2.length).toBe(5);
    expect(mockProvider.searchPlaces).toHaveBeenCalledTimes(1); // Provider NOT called again
  });

  it('RED-PLC-04: should cluster places geographically into N days minimizing travel distance', () => {
    const selectedPlaces = [
      { id: 'p1', name: 'Dragon Bridge', lat: 16.0610, lng: 108.2272 },
      { id: 'p2', name: 'My Khe Beach', lat: 16.0595, lng: 108.2464 },
      { id: 'p3', name: 'Linh Ung Pagoda', lat: 16.1001, lng: 108.2755 },
      { id: 'p4', name: 'Ba Na Hills', lat: 15.9980, lng: 107.9940 }, // Far west
      { id: 'p5', name: 'Hoi An Ancient Town', lat: 15.8770, lng: 108.3262 } // Far south
    ];

    const result = placesService.clusterPlacesIntoDays(selectedPlaces, 3);

    expect(result).toHaveProperty('days');
    expect(Object.keys(result.days).length).toBe(3);
    
    // Total places allocated across all days must equal 5
    const allStops = Object.values(result.days).flat();
    expect(allStops.length).toBe(5);

    // Linh Ung & My Khe (both east coastal) should be clustered together
    const day1Stops = result.days[1].map(s => s.id);
    const day2Stops = result.days[2].map(s => s.id);
    const day3Stops = result.days[3].map(s => s.id);

    // All IDs must be preserved
    expect(allStops.map(s => s.id).sort()).toEqual(['p1', 'p2', 'p3', 'p4', 'p5']);
    
    // Each stop should have assigned orderIndex, transitKm, and timeSlot
    expect(result.days[1][0]).toHaveProperty('orderIndex');
    expect(result.days[1][0]).toHaveProperty('timeSlot');
  });

  it('RED-PLC-05: should filter places by query string on cache hit and miss', async () => {
    // Non-cached with query
    const resMiss = await placesService.searchPlaces({ city: 'Da Nang', query: 'Beach' });
    expect(resMiss.length).toBe(1);
    expect(resMiss[0].name).toBe('My Khe Beach');

    // Cached with query
    const resHit = await placesService.searchPlaces({ city: 'Da Nang', query: 'Bridge' });
    expect(resHit.length).toBe(1);
    expect(resHit[0].name).toBe('Dragon Bridge');
  });

  it('RED-PLC-06: should handle empty places and places count less than durationDays', () => {
    const emptyRes = placesService.clusterPlacesIntoDays([], 2);
    expect(emptyRes.days[1]).toEqual([]);
    expect(emptyRes.days[2]).toEqual([]);

    const singlePlace = [{ id: 'p1', name: 'Place 1', lat: 16.0, lng: 108.0 }];
    const fewRes = placesService.clusterPlacesIntoDays(singlePlace, 3);
    expect(fewRes.days[1]).toHaveLength(1);
    expect(fewRes.days[2]).toHaveLength(0);
    expect(fewRes.days[3]).toHaveLength(0);
  });
});
