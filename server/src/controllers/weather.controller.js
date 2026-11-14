const weatherService = require('../services/weather.service');

class WeatherController {
  async getForecast(req, res, next) {
    try {
      const { lat, lng, city } = req.query;
      const forecast = await weatherService.getForecast({ lat, lng, city });

      return res.status(200).json({
        success: true,
        data: forecast,
        meta: {
          timestamp: new Date().toISOString(),
          source: 'OPEN_METEO_LIVE',
        },
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new WeatherController();
