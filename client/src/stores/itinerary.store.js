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
      set({ trips: tripsList, isLoading: false });
      return tripsList;
    } catch (err) {
      set({ error: err.message || 'Failed to load trips', isLoading: false });
      throw err;
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
      throw err;
    }
  },

  createTrip: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const res = await apiClient.post('/itineraries', payload);
      const createdTrip = res?.itinerary || res;
      set((state) => ({
        trips: [createdTrip, ...state.trips],
        currentTrip: createdTrip,
        isLoading: false,
      }));
      return createdTrip;
    } catch (err) {
      set({ error: err.message || 'Failed to create new trip', isLoading: false });
      throw err;
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
}));
