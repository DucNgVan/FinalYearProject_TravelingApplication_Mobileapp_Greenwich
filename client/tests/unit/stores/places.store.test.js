import { usePlacesStore } from '../../../src/stores/places.store';
import apiClient from '../../../src/api/client';

jest.mock('../../../src/api/client');

describe('Unit Test: usePlacesStore (Client Map Places & Wishlist)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    usePlacesStore.setState({
      places: [],
      selectedPlaceIds: new Set(),
      searchQuery: '',
      activeCategory: 'all',
      isLoading: false,
      error: null,
      aiPlan: null,
    });
  });

  it('RED-PLC-07: should toggle place selection in wishlist set', () => {
    const { togglePlaceSelection } = usePlacesStore.getState();

    // Select place
    togglePlaceSelection('place_123');
    expect(usePlacesStore.getState().selectedPlaceIds.has('place_123')).toBe(true);
    expect(usePlacesStore.getState().selectedPlaceIds.size).toBe(1);

    // Deselect place
    togglePlaceSelection('place_123');
    expect(usePlacesStore.getState().selectedPlaceIds.has('place_123')).toBe(false);
    expect(usePlacesStore.getState().selectedPlaceIds.size).toBe(0);
  });

  it('RED-PLC-07b: should filter places by category and search query', () => {
    const mockPlaces = [
      { id: '1', name: 'Dragon Bridge', category: 'landmark' },
      { id: '2', name: 'My Khe Beach', category: 'beach' },
      { id: '3', name: 'Ba Na Hills', category: 'landmark' },
    ];

    usePlacesStore.setState({ places: mockPlaces });

    usePlacesStore.getState().setActiveCategory('landmark');
    expect(usePlacesStore.getState().activeCategory).toBe('landmark');

    usePlacesStore.getState().setSearchQuery('Dragon');
    expect(usePlacesStore.getState().searchQuery).toBe('Dragon');
  });

  it('RED-PLC-08: fetchPlaces should load places from API and handle category filtering', async () => {
    const mockPlacesResponse = [
      { id: 'p1', name: 'Cầu Rồng', city: 'Đà Nẵng', category: 'landmark' },
      { id: 'p2', name: 'Mỹ Khê', city: 'Đà Nẵng', category: 'beach' },
    ];

    apiClient.get.mockResolvedValueOnce(mockPlacesResponse);

    const result = await usePlacesStore.getState().fetchPlaces('Đà Nẵng', 'landmark');

    expect(apiClient.get).toHaveBeenCalledWith('/places/search', {
      params: { city: 'Đà Nẵng', category: 'landmark' },
    });
    expect(result).toEqual(mockPlacesResponse);
    expect(usePlacesStore.getState().places).toEqual(mockPlacesResponse);
    expect(usePlacesStore.getState().isLoading).toBe(false);
  });

  it('RED-PLC-09: fetchPlaces should handle API errors gracefully', async () => {
    apiClient.get.mockRejectedValueOnce(new Error('Network error'));

    const result = await usePlacesStore.getState().fetchPlaces('Tokyo');

    expect(result).toEqual([]);
    expect(usePlacesStore.getState().error).toBe('Network error');
    expect(usePlacesStore.getState().isLoading).toBe(false);
  });

  it('RED-PLC-10: generateAiPlan should return null when no places are selected', async () => {
    usePlacesStore.setState({ places: [{ id: 'p1', name: 'Test' }], selectedPlaceIds: new Set() });

    const result = await usePlacesStore.getState().generateAiPlan(3);
    expect(result).toBeNull();
    expect(apiClient.post).not.toHaveBeenCalled();
  });

  it('RED-PLC-11: generateAiPlan should call API with selected places and store aiPlan', async () => {
    const mockPlaces = [
      { id: 'p1', name: 'Cầu Rồng', lat: 16.06, lng: 108.22 },
      { id: 'p2', name: 'Bà Nà', lat: 15.99, lng: 107.99 },
    ];
    const mockAiPlan = {
      days: {
        1: [{ id: 'p1', name: 'Cầu Rồng' }],
        2: [{ id: 'p2', name: 'Bà Nà' }],
      },
    };

    usePlacesStore.setState({
      places: mockPlaces,
      selectedPlaceIds: new Set(['p1', 'p2']),
    });

    apiClient.post.mockResolvedValueOnce(mockAiPlan);

    const result = await usePlacesStore.getState().generateAiPlan(2);

    expect(apiClient.post).toHaveBeenCalledWith('/places/ai-plan', {
      places: mockPlaces,
      durationDays: 2,
    });
    expect(result).toEqual(mockAiPlan);
    expect(usePlacesStore.getState().aiPlan).toEqual(mockAiPlan);
  });

  it('RED-PLC-12: generateAiPlan should support customSelectedPlaces directly', async () => {
    const customPlaces = [{ id: 'cp1', name: 'Custom Place', lat: 16.0, lng: 108.0 }];
    const mockAiPlan = { days: { 1: customPlaces } };

    apiClient.post.mockResolvedValueOnce(mockAiPlan);

    const result = await usePlacesStore.getState().generateAiPlan(1, customPlaces);

    expect(apiClient.post).toHaveBeenCalledWith('/places/ai-plan', {
      places: customPlaces,
      durationDays: 1,
    });
    expect(result).toEqual(mockAiPlan);
  });

  it('RED-PLC-13: generateAiPlan should handle API errors gracefully', async () => {
    const mockPlaces = [{ id: 'p1', name: 'Place 1' }];
    usePlacesStore.setState({
      places: mockPlaces,
      selectedPlaceIds: new Set(['p1']),
    });

    apiClient.post.mockRejectedValueOnce(new Error('AI clustering failed'));

    const result = await usePlacesStore.getState().generateAiPlan(2);

    expect(result).toBeNull();
    expect(usePlacesStore.getState().error).toBe('AI clustering failed');
    expect(usePlacesStore.getState().isLoading).toBe(false);
  });

  it('RED-PLC-14: clearSelection and reset should restore store states', () => {
    usePlacesStore.setState({
      places: [{ id: '1' }],
      selectedPlaceIds: new Set(['1']),
      searchQuery: 'test',
      activeCategory: 'food',
      aiPlan: { days: {} },
    });

    usePlacesStore.getState().clearSelection();
    expect(usePlacesStore.getState().selectedPlaceIds.size).toBe(0);

    usePlacesStore.getState().reset();
    const state = usePlacesStore.getState();
    expect(state.places).toEqual([]);
    expect(state.searchQuery).toBe('');
    expect(state.activeCategory).toBe('all');
    expect(state.aiPlan).toBeNull();
  });
});
