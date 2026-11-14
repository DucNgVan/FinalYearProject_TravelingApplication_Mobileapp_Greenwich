const gamificationService = require('../services/gamification.service');

class GamificationController {
  async getLandmarks(req, res, next) {
    try {
      const city = req.query.city;
      const userId = req.user?.id;
      const landmarks = await gamificationService.getLandmarks({ city, userId });
      return res.status(200).json({
        success: true,
        data: landmarks,
      });
    } catch (err) {
      next(err);
    }
  }

  async checkIn(req, res, next) {
    try {
      const userId = req.user?.id || req.body.userId || 'anonymous-traveler';
      const { landmarkId, latitude, longitude } = req.body;
      const result = await gamificationService.checkIn({
        userId,
        landmarkId,
        latitude: Number(latitude),
        longitude: Number(longitude),
      });
      return res.status(201).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async getBadges(req, res, next) {
    try {
      const userId = req.user?.id;
      const badges = await gamificationService.getBadges(userId);
      return res.status(200).json({
        success: true,
        data: badges,
      });
    } catch (err) {
      next(err);
    }
  }

  async getProfile(req, res, next) {
    try {
      const userId = req.user?.id || 'anonymous-traveler';
      const profile = await gamificationService.getUserProfile(userId);
      return res.status(200).json({
        success: true,
        data: profile,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new GamificationController();
