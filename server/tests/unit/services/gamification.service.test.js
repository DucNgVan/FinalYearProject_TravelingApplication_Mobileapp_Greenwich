const gamificationService = require('../../../src/services/gamification.service');

describe('Unit Test: GamificationService (Module 5 - Geolocation & Cultural Badges)', () => {
  const mockLandmarkDaNang = {
    id: 'lm-danang-dragon',
    name: 'Dragon Bridge (Cầu Rồng)',
    city: 'Da Nang',
    latitude: 16.0611,
    longitude: 108.2238,
    geofence_radius_meters: 100,
    xp_reward: 150,
  };

  describe('RED-GAM-01: GPS distance & Geofence Verification', () => {
    it('calculates distance and returns within range when GPS is within 100 meters', () => {
      // Very close to Dragon Bridge (~25 meters)
      const userLat = 16.0612;
      const userLng = 108.2239;
      const distance = gamificationService.calculateDistance(
        userLat,
        userLng,
        mockLandmarkDaNang.latitude,
        mockLandmarkDaNang.longitude
      );

      expect(distance).toBeLessThanOrEqual(100);
    });

    it('RED-GAM-02: rejects check-in and throws error when GPS is outside geofence radius', async () => {
      // User is ~5 km away in My Khe Beach
      const farLat = 16.0600;
      const farLng = 108.2450;

      await expect(
        gamificationService.checkIn({
          userId: 'user-gam-1',
          landmarkId: mockLandmarkDaNang.id,
          latitude: farLat,
          longitude: farLng,
        })
      ).rejects.toThrow(/outside geofence|out of range/i);
    });
  });

  describe('RED-GAM-03: Valid Check-in & Badge Unlock', () => {
    it('accepts check-in within range, awards XP, and returns updated level info', async () => {
      // Exactly at the landmark
      const result = await gamificationService.checkIn({
        userId: 'user-gam-2',
        landmarkId: mockLandmarkDaNang.id,
        latitude: 16.0611,
        longitude: 108.2238,
      });

      expect(result).toHaveProperty('success', true);
      expect(result).toHaveProperty('xpEarned', 150);
      expect(result).toHaveProperty('currentLevel');
      expect(result.currentLevel).toHaveProperty('level');
      expect(result.currentLevel).toHaveProperty('title');
    });
  });

  describe('RED-GAM-04: Level Threshold Calculation', () => {
    it('calculates correct level and titles across XP tiers', () => {
      expect(gamificationService.calculateLevel(100)).toEqual({
        level: 1,
        title: 'Novice Explorer',
        nextLevelXp: 300,
      });

      expect(gamificationService.calculateLevel(450)).toEqual({
        level: 2,
        title: 'Trail Scout',
        nextLevelXp: 700,
      });

      expect(gamificationService.calculateLevel(850)).toEqual({
        level: 3,
        title: 'Pathfinder',
        nextLevelXp: 1500,
      });

      expect(gamificationService.calculateLevel(1600)).toEqual({
        level: 4,
        title: 'Voyager',
        nextLevelXp: 3000,
      });

      expect(gamificationService.calculateLevel(3500)).toEqual({
        level: 5,
        title: 'Nomad Legend',
        nextLevelXp: null,
      });
    });
  });
});
