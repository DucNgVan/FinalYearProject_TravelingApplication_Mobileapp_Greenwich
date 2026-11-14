import { create } from 'zustand';
import apiClient from '../api/client';

const DEFAULT_LANDMARKS = [
  {
    id: 'lm-danang-dragon',
    name: 'Dragon Bridge (Cầu Rồng)',
    city: 'Da Nang',
    latitude: 16.0611,
    longitude: 108.2238,
    geofence_radius_meters: 100,
    description: 'Iconic golden dragon bridge breathing real fire and water.',
    cover_image_url: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800',
    xpReward: 150,
    isCheckedIn: false,
  },
  {
    id: 'lm-danang-marble',
    name: 'Marble Mountains (Ngũ Hành Sơn)',
    city: 'Da Nang',
    latitude: 16.0044,
    longitude: 108.2638,
    geofence_radius_meters: 100,
    description: 'Cluster of five marble and limestone hills with sacred caves.',
    cover_image_url: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800',
    xpReward: 150,
    isCheckedIn: false,
  },
  {
    id: 'lm-danang-golden-bridge',
    name: 'Golden Bridge (Cầu Vàng)',
    city: 'Da Nang',
    latitude: 15.9950,
    longitude: 107.9967,
    geofence_radius_meters: 100,
    description: 'Pedestrian bridge held by colossal giant stone hands.',
    cover_image_url: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800',
    xpReward: 200,
    isCheckedIn: false,
  },
  {
    id: 'lm-hoian-bridge',
    name: 'Japanese Covered Bridge (Chùa Cầu)',
    city: 'Hoi An',
    latitude: 15.8771,
    longitude: 108.3262,
    geofence_radius_meters: 100,
    description: '17th-century historic covered bridge with wooden roof.',
    cover_image_url: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800',
    xpReward: 150,
    isCheckedIn: false,
  },
];

const DEFAULT_BADGES = [
  {
    id: 'bg-danang-explorer',
    name: 'Da Nang Explorer',
    city: 'Da Nang',
    icon: '🌉',
    unlocked: true,
    desc: 'Check in at 2 landmarks in Da Nang',
  },
  {
    id: 'bg-hoian-heritage',
    name: 'Hoi An Heritage',
    city: 'Hoi An',
    icon: '🏮',
    unlocked: false,
    desc: 'Check in at historic monuments in Hoi An',
  },
  {
    id: 'bg-hanoi-scholar',
    name: 'Hanoi Scholar',
    city: 'Hanoi',
    icon: '🏛️',
    unlocked: false,
    desc: 'Visit historical sites in Hanoi',
  },
  {
    id: 'bg-national-nomad',
    name: 'Nomad Legend',
    city: 'Việt Nam',
    icon: '👑',
    unlocked: false,
    desc: 'Unlock 4+ regional badges',
  },
];

export const useGamificationStore = create((set, get) => ({
  xp: 450,
  level: 2,
  levelTitle: 'Trail Scout',
  nextLevelXp: 700,
  landmarks: DEFAULT_LANDMARKS,
  badges: DEFAULT_BADGES,
  isLoading: false,
  error: null,

  fetchLandmarks: async (city) => {
    try {
      set({ isLoading: true, error: null });
      const res = await apiClient.get('/gamification/landmarks', { params: { city } });
      if (res?.data) {
        set({ landmarks: res.data });
      }
    } catch {
      // Fallback to offline defaults
    } finally {
      set({ isLoading: false });
    }
  },

  checkInLandmark: async (landmarkId, coords = { latitude: 16.0611, longitude: 108.2238 }) => {
    try {
      set({ isLoading: true });
      const res = await apiClient.post('/gamification/checkin', {
        landmarkId,
        latitude: coords.latitude,
        longitude: coords.longitude,
      });

      if (res?.data) {
        const { xpEarned, newXpTotal, currentLevel } = res.data;
        set((state) => ({
          xp: newXpTotal || state.xp + (xpEarned || 150),
          level: currentLevel?.level || state.level,
          levelTitle: currentLevel?.title || state.levelTitle,
          nextLevelXp: currentLevel?.nextLevelXp || state.nextLevelXp,
          landmarks: state.landmarks.map((l) =>
            l.id === landmarkId ? { ...l, isCheckedIn: true } : l
          ),
        }));
        return res.data;
      }
    } catch (e) {
      // Local optimistic check-in fallback
      set((state) => ({
        xp: state.xp + 150,
        landmarks: state.landmarks.map((l) =>
          l.id === landmarkId ? { ...l, isCheckedIn: true } : l
        ),
      }));
    } finally {
      set({ isLoading: false });
    }
  },

  resetGamification: () => {
    set({
      xp: 450,
      level: 2,
      levelTitle: 'Trail Scout',
      nextLevelXp: 700,
      landmarks: DEFAULT_LANDMARKS,
      badges: DEFAULT_BADGES,
      isLoading: false,
      error: null,
    });
  },
}));
