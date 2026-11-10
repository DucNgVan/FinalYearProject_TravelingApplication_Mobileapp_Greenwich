import { create } from 'zustand';
import apiClient from '../api/client';

export const usePlacesStore = create((set, get) => ({
  places: [],
  selectedPlaceIds: new Set(),
  searchQuery: '',
  activeCategory: 'all',
  isLoading: false,
  error: null,
  aiPlan: null,

  togglePlaceSelection: (placeId) => {
    const current = new Set(get().selectedPlaceIds);
    if (current.has(placeId)) {
      current.delete(placeId);
    } else {
      current.add(placeId);
    }
    set({ selectedPlaceIds: current });
  },

  setActiveCategory: (activeCategory) => set({ activeCategory }),

  setSearchQuery: (searchQuery) => set({ searchQuery }),

  fetchPlaces: async (city, category = 'all') => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get('/places/search', {
        params: {
          city,
          category: category !== 'all' ? category : undefined,
        },
      });
      const places = response.data || response || [];
      set({ places, isLoading: false });
      return places;
    } catch (err) {
      set({
        error: err.response?.data?.error?.message || err.message || 'Failed to fetch places',
        isLoading: false,
      });
      return [];
    }
  },

  generateAiPlan: async (durationDays = 2, customSelectedPlaces = null) => {
    const state = get();
    const selected =
      customSelectedPlaces && customSelectedPlaces.length > 0
        ? customSelectedPlaces
        : state.places.filter((p) => state.selectedPlaceIds.has(p.id));

    if (selected.length === 0) {
      return null;
    }

    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post('/places/ai-plan', {
        places: selected,
        durationDays,
      });
      const aiPlan = response.data || response;
      set({ aiPlan, isLoading: false });
      return aiPlan;
    } catch (err) {
      set({
        error: err.response?.data?.error?.message || err.message || 'Failed to generate AI plan',
        isLoading: false,
      });
      return null;
    }
  },

  clearSelection: () => set({ selectedPlaceIds: new Set() }),

  reset: () =>
    set({
      places: [],
      selectedPlaceIds: new Set(),
      searchQuery: '',
      activeCategory: 'all',
      isLoading: false,
      error: null,
      aiPlan: null,
    }),
}));
