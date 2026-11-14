const DEFAULT_LANDMARKS = [
  {
    id: 'lm-danang-dragon',
    name: 'Dragon Bridge (Cầu Rồng)',
    city: 'Da Nang',
    country: 'Việt Nam',
    latitude: 16.0611,
    longitude: 108.2238,
    geofence_radius_meters: 100,
    description: 'Iconic golden dragon bridge breathing real fire and water every weekend at 21:00.',
    cover_image_url: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800',
    xp_reward: 150,
  },
  {
    id: 'lm-danang-marble',
    name: 'Marble Mountains (Ngũ Hành Sơn)',
    city: 'Da Nang',
    country: 'Việt Nam',
    latitude: 16.0044,
    longitude: 108.2638,
    geofence_radius_meters: 100,
    description: 'Cluster of five marble and limestone hills named after the five elements.',
    cover_image_url: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800',
    xp_reward: 150,
  },
  {
    id: 'lm-danang-golden-bridge',
    name: 'Golden Bridge (Cầu Vàng Ba Na)',
    city: 'Da Nang',
    country: 'Việt Nam',
    latitude: 15.9950,
    longitude: 107.9967,
    geofence_radius_meters: 100,
    description: 'World-famous 150-meter-long pedestrian bridge held by giant stone hands.',
    cover_image_url: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800',
    xp_reward: 200,
  },
  {
    id: 'lm-hoian-bridge',
    name: 'Japanese Covered Bridge (Chùa Cầu)',
    city: 'Hoi An',
    country: 'Việt Nam',
    latitude: 15.8771,
    longitude: 108.3262,
    geofence_radius_meters: 100,
    description: '17th-century footbridge featuring traditional Japanese architectural elegance.',
    cover_image_url: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800',
    xp_reward: 150,
  },
  {
    id: 'lm-hanoi-temple',
    name: 'Temple of Literature (Văn Miếu)',
    city: 'Hanoi',
    country: 'Việt Nam',
    latitude: 21.0293,
    longitude: 105.8360,
    geofence_radius_meters: 100,
    description: "Vietnam's first national university founded in 1070 dedicated to Confucius.",
    cover_image_url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800',
    xp_reward: 150,
  },
];

const DEFAULT_BADGES = [
  {
    id: 'bg-danang-explorer',
    name: 'Da Nang Explorer',
    city: 'Da Nang',
    badge_tier: 'EXPLORER',
    badge_icon_url: '🌉',
    required_checkins: 2,
    xp_bonus: 300,
  },
  {
    id: 'bg-hoian-heritage',
    name: 'Hoi An Heritage Master',
    city: 'Hoi An',
    badge_tier: 'EXPERT',
    badge_icon_url: '🏮',
    required_checkins: 1,
    xp_bonus: 300,
  },
  {
    id: 'bg-hanoi-scholar',
    name: 'Hanoi Cultural Scholar',
    city: 'Hanoi',
    badge_tier: 'MASTER',
    badge_icon_url: '🏛️',
    required_checkins: 1,
    xp_bonus: 300,
  },
  {
    id: 'bg-national-nomad',
    name: 'Nomad Legend',
    city: 'Việt Nam',
    badge_tier: 'MASTER',
    badge_icon_url: '👑',
    required_checkins: 4,
    xp_bonus: 500,
  },
];

class GamificationRepository {
  constructor(pgPool = null) {
    this.pool = pgPool;
    this.landmarks = [...DEFAULT_LANDMARKS];
    this.badges = [...DEFAULT_BADGES];
    this.checkins = [];
    this.userBadges = [];
    this.userXp = new Map();
  }

  setPool(pgPool) {
    this.pool = pgPool;
  }

  async getLandmarks(city) {
    if (this.pool) {
      try {
        let query = 'SELECT * FROM landmarks WHERE is_active = true';
        const params = [];
        if (city) {
          query += ' AND city ILIKE $1';
          params.push(city);
        }
        const res = await this.pool.query(query, params);
        if (res.rows.length > 0) return res.rows;
      } catch {
        // Fallback to in-memory
      }
    }
    if (city) {
      return this.landmarks.filter((l) => l.city.toLowerCase() === city.toLowerCase());
    }
    return this.landmarks;
  }

  async findLandmarkById(id) {
    if (this.pool) {
      try {
        const res = await this.pool.query('SELECT * FROM landmarks WHERE id = $1', [id]);
        if (res.rows[0]) return res.rows[0];
      } catch {
        // Fallback
      }
    }
    return this.landmarks.find((l) => l.id === id);
  }

  async recordCheckin({ userId, landmarkId, latitude, longitude, distanceMeters }) {
    const record = {
      id: `chk-${Date.now()}`,
      userId,
      landmarkId,
      latitude,
      longitude,
      distanceMeters,
      verifiedAt: new Date().toISOString(),
    };
    this.checkins.push(record);
    return record;
  }

  async getUserCheckins(userId) {
    return this.checkins.filter((c) => c.userId === userId);
  }

  async getUserXp(userId) {
    return this.userXp.get(userId) || 0;
  }

  async addXp(userId, amount) {
    const current = await this.getUserXp(userId);
    const updated = current + amount;
    this.userXp.set(userId, updated);
    return updated;
  }

  async getBadges() {
    return this.badges;
  }

  async getUserBadges(userId) {
    const unlockedIds = this.userBadges
      .filter((ub) => ub.userId === userId)
      .map((ub) => ub.badgeId);
    return this.badges.filter((b) => unlockedIds.includes(b.id));
  }

  async unlockBadge(userId, badgeId) {
    const already = this.userBadges.some((ub) => ub.userId === userId && ub.badgeId === badgeId);
    if (!already) {
      const newUnlock = {
        id: `ub-${Date.now()}`,
        userId,
        badgeId,
        unlockedAt: new Date().toISOString(),
      };
      this.userBadges.push(newUnlock);
      return newUnlock;
    }
    return null;
  }
}

module.exports = new GamificationRepository();
