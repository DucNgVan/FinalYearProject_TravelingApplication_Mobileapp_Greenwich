const gamificationRepository = require('../repositories/gamification.repository');
const { calculateHaversineDistance } = require('../utils/geo.util');

class GamificationService {
  calculateDistance(lat1, lon1, lat2, lon2) {
    const km = calculateHaversineDistance(
      { lat: Number(lat1), lng: Number(lon1) },
      { lat: Number(lat2), lng: Number(lon2) }
    );
    return Math.round(km * 1000); // meters
  }

  calculateLevel(totalXp) {
    const xp = Number(totalXp) || 0;
    if (xp < 300) {
      return { level: 1, title: 'Novice Explorer', nextLevelXp: 300 };
    }
    if (xp < 700) {
      return { level: 2, title: 'Trail Scout', nextLevelXp: 700 };
    }
    if (xp < 1500) {
      return { level: 3, title: 'Pathfinder', nextLevelXp: 1500 };
    }
    if (xp < 3000) {
      return { level: 4, title: 'Voyager', nextLevelXp: 3000 };
    }
    return { level: 5, title: 'Nomad Legend', nextLevelXp: null };
  }

  async getLandmarks({ city, userId }) {
    const landmarks = await gamificationRepository.getLandmarks(city);
    let userCheckins = [];
    if (userId) {
      userCheckins = await gamificationRepository.getUserCheckins(userId);
    }
    const checkedInIds = new Set(userCheckins.map((c) => c.landmarkId));

    return landmarks.map((l) => ({
      ...l,
      isCheckedIn: checkedInIds.has(l.id),
    }));
  }

  async checkIn({ userId, landmarkId, latitude, longitude }) {
    const landmark = await gamificationRepository.findLandmarkById(landmarkId);
    if (!landmark) {
      const err = new Error('Cultural landmark not found');
      err.code = 'NOT_FOUND';
      err.statusCode = 404;
      throw err;
    }

    const distanceMeters = this.calculateDistance(
      latitude,
      longitude,
      landmark.latitude,
      landmark.longitude
    );

    const radius = landmark.geofence_radius_meters || 100;
    if (distanceMeters > radius) {
      const err = new Error(
        `GPS location is outside geofence radius for ${landmark.name} (${distanceMeters}m away, max allowed is ${radius}m).`
      );
      err.code = 'GEOFENCE_OUT_OF_RANGE';
      err.statusCode = 422;
      throw err;
    }

    // Record verified check-in
    await gamificationRepository.recordCheckin({
      userId,
      landmarkId,
      latitude,
      longitude,
      distanceMeters,
    });

    const xpReward = landmark.xp_reward || 150;
    let newXpTotal = await gamificationRepository.addXp(userId, xpReward);

    // Check for badge unlocks
    const userCheckins = await gamificationRepository.getUserCheckins(userId);
    const badges = await gamificationRepository.getBadges();
    let newBadgeUnlocked = null;

    for (const badge of badges) {
      const cityCheckins = userCheckins.filter(
        (c) => badge.city === 'Việt Nam' || badge.city.toLowerCase() === landmark.city.toLowerCase()
      );
      if (cityCheckins.length >= badge.required_checkins) {
        const unlocked = await gamificationRepository.unlockBadge(userId, badge.id);
        if (unlocked) {
          newBadgeUnlocked = badge;
          if (badge.xp_bonus > 0) {
            newXpTotal = await gamificationRepository.addXp(userId, badge.xp_bonus);
          }
        }
      }
    }

    const currentLevel = this.calculateLevel(newXpTotal);

    return {
      success: true,
      landmark,
      distanceMeters,
      xpEarned: xpReward,
      newXpTotal,
      currentLevel,
      newBadgeUnlocked,
    };
  }

  async getBadges(userId) {
    const allBadges = await gamificationRepository.getBadges();
    let unlockedBadges = [];
    if (userId) {
      unlockedBadges = await gamificationRepository.getUserBadges(userId);
    }
    const unlockedIds = new Set(unlockedBadges.map((b) => b.id));

    return allBadges.map((badge) => ({
      ...badge,
      unlocked: unlockedIds.has(badge.id),
    }));
  }

  async getUserProfile(userId) {
    const xp = await gamificationRepository.getUserXp(userId);
    const checkins = await gamificationRepository.getUserCheckins(userId);
    const unlockedBadges = await gamificationRepository.getUserBadges(userId);
    const levelInfo = this.calculateLevel(xp);

    return {
      xp,
      level: levelInfo.level,
      title: levelInfo.title,
      nextLevelXp: levelInfo.nextLevelXp,
      checkinsCount: checkins.length,
      unlockedBadgesCount: unlockedBadges.length,
    };
  }
}

module.exports = new GamificationService();
