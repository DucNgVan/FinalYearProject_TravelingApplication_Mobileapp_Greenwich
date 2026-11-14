import { create } from 'zustand';
import apiClient from '../api/client';

export const useItineraryStore = create((set, get) => ({
  trips: [],
  currentTrip: null,
  isLoading: false,
  error: null,

  fetchTrips: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await apiClient.get('/itineraries');
      const tripsList = Array.isArray(data) ? data : (data?.itineraries || []);
      set((state) => {
        // Merge remote trips with existing local/unsaved trips so newly created trips are NEVER lost!
        const existingLocalTrips = state.trips || [];
        const combined = [...tripsList];
        for (const localT of existingLocalTrips) {
          const localId = localT.id || localT._id;
          const exists = combined.some((r) => (r.id || r._id) === localId);
          if (!exists) {
            combined.push(localT);
          }
        }
        return {
          trips: combined,
          currentTrip: state.currentTrip || combined[0] || null,
          isLoading: false,
        };
      });
      return tripsList;
    } catch (err) {
      set({ error: err.message || 'Failed to load trips', isLoading: false });
      return get().trips || [];
    }
  },

  fetchTripDetails: async (tripId) => {
    set({ isLoading: true, error: null });
    try {
      const res = await apiClient.get(`/itineraries/${tripId}`);
      const trip = res?.itinerary || res;
      set({ currentTrip: trip, isLoading: false });
      return trip;
    } catch (err) {
      set({ error: err.message || 'Failed to load itinerary details', isLoading: false });
      return get().currentTrip || null;
    }
  },

  createTrip: async (payload) => {
    set({ isLoading: true, error: null });
    const localFallbackTrip = {
      id: payload.id || `trip-${Date.now()}`,
      ...payload,
      createdAt: new Date().toISOString(),
    };
    try {
      const res = await apiClient.post('/itineraries', payload);
      const createdTrip = res?.itinerary || res || localFallbackTrip;
      set((state) => ({
        trips: [createdTrip, ...(state.trips || []).filter((t) => (t.id || t._id) !== (createdTrip.id || createdTrip._id))],
        currentTrip: createdTrip,
        isLoading: false,
      }));
      return createdTrip;
    } catch (err) {
      // Offline/Guest fallback: keep trip active in local state!
      set((state) => ({
        trips: [localFallbackTrip, ...(state.trips || []).filter((t) => (t.id || t._id) !== localFallbackTrip.id)],
        currentTrip: localFallbackTrip,
        isLoading: false,
      }));
      return localFallbackTrip;
    }
  },

  addStop: async (tripId, stopPayload) => {
    set({ isLoading: true, error: null });
    try {
      const addedItem = await apiClient.post(`/itineraries/${tripId}/items`, stopPayload);
      set((state) => {
        if (!state.currentTrip) return { isLoading: false };
        const updatedDays = state.currentTrip.days.map((day) => {
          if (day.dayIndex === stopPayload.dayIndex) {
            return {
              ...day,
              items: [...(day.items || []), addedItem],
            };
          }
          return day;
        });

        return {
          currentTrip: {
            ...state.currentTrip,
            days: updatedDays,
          },
          isLoading: false,
        };
      });
      return addedItem;
    } catch (err) {
      set({ error: err.message || 'Failed to add stop', isLoading: false });
      throw err;
    }
  },

  inviteCompanion: async (tripId, { email, role }) => {
    set({ isLoading: true, error: null });
    try {
      const invitedMember = await apiClient.post(`/itineraries/${tripId}/collaborators`, {
        email,
        role,
      });

      set((state) => {
        if (!state.currentTrip) return { isLoading: false };
        return {
          currentTrip: {
            ...state.currentTrip,
            collaborators: [...(state.currentTrip.collaborators || []), invitedMember],
          },
          isLoading: false,
        };
      });
      return invitedMember;
    } catch (err) {
      set({ error: err.message || 'Failed to invite companion', isLoading: false });
      throw err;
    }
  },

  applyAiPlan: (tripId, aiPlanDays) => {
    set((state) => {
      if (!state.currentTrip) return state;

      let newDays = [];
      if (aiPlanDays && typeof aiPlanDays === 'object') {
        const keys = Object.keys(aiPlanDays);
        newDays = keys.map((key) => {
          const dayIndex = parseInt(key, 10);
          const rawStops = aiPlanDays[key] || [];
          const items = rawStops.map((stop, sIdx) => ({
            id: stop.id || `stop-${dayIndex}-${sIdx + 1}`,
            name: stop.name,
            arrivalTime: stop.timeSlot?.split(' - ')?.[0] || '09:00',
            durationMinutes: 90,
            transitToNext: {
              mode: 'DRIVING',
              distanceKm: stop.transitKm || 2.5,
              durationMinutes: 15,
            },
          }));
          return {
            dayIndex,
            date: state.currentTrip.startDate || '2026-10-15',
            items,
          };
        });
      }

      const updatedTrip = {
        ...state.currentTrip,
        days: newDays.length > 0 ? newDays : state.currentTrip.days,
      };

      const updatedTrips = state.trips.map((t) =>
        t.id === tripId ? updatedTrip : t
      );

      return {
        currentTrip: updatedTrip,
        trips: updatedTrips,
      };
    });
  },

  setCurrentTrip: (trip) => {
    set({ currentTrip: trip });
  },

  addPackingItem: async (tripId, itemData) => {
    const newItem = {
      id: itemData.id || `pck-${Date.now()}`,
      title: itemData.title,
      category: itemData.category || 'General',
      assignee: itemData.assignee || 'All Squad',
      checked: !!itemData.checked,
    };
    set((state) => {
      if (!state.currentTrip) return {};
      const currentList = Array.isArray(state.currentTrip.packingList)
        ? [...state.currentTrip.packingList]
        : [];
      const updatedList = [...currentList, newItem];
      const updatedTrip = { ...state.currentTrip, packingList: updatedList };
      return {
        currentTrip: updatedTrip,
        trips: state.trips.map((t) => (t.id === tripId ? updatedTrip : t)),
      };
    });
    try {
      await apiClient.post(`/itineraries/${tripId}/packing-list`, newItem);
    } catch (e) {
      // offline/fallback tolerant
    }
  },

  togglePackingItem: async (tripId, itemId) => {
    set((state) => {
      if (!state.currentTrip || !Array.isArray(state.currentTrip.packingList)) return {};
      const updatedList = state.currentTrip.packingList.map((item) =>
        item.id === itemId ? { ...item, checked: !item.checked } : item
      );
      const updatedTrip = { ...state.currentTrip, packingList: updatedList };
      return {
        currentTrip: updatedTrip,
        trips: state.trips.map((t) => (t.id === tripId ? updatedTrip : t)),
      };
    });
    try {
      await apiClient.patch(`/itineraries/${tripId}/packing-list/${itemId}/toggle`);
    } catch (e) {
      // offline/fallback tolerant
    }
  },
}));
