const PlacesService = require('../services/places.service');

const placesService = new PlacesService();

class PlacesController {
  async search(req, res, next) {
    try {
      const places = await placesService.searchPlaces(req.query);
      return res.status(200).json({
        success: true,
        data: places,
      });
    } catch (err) {
      next(err);
    }
  }

  async generateAiPlan(req, res, next) {
    try {
      const { places, durationDays } = req.body;
      const plan = placesService.clusterPlacesIntoDays(places, durationDays);
      return res.status(200).json({
        success: true,
        data: plan,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new PlacesController();
