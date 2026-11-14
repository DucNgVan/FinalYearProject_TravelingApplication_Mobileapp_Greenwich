const WeatherProvider = require('../providers/weather.provider');
const cacheService = require('./cache.service');

class WeatherService {
  constructor(provider = new WeatherProvider()) {
    this.provider = provider;
  }

  async getForecast({ lat = 16.0544, lng = 108.2022, city = 'Da Nang' } = {}) {
    const cleanCity = (city || 'Da Nang').trim();
    const cleanLat = parseFloat(lat) || 16.0544;
    const cleanLng = parseFloat(lng) || 108.2022;

    const cacheKey = `nomadix:weather:${cleanLat.toFixed(2)}_${cleanLng.toFixed(2)}`;
    const cached = await cacheService.get(cacheKey);
    if (cached) {
      return cached;
    }

    const forecast = await this.provider.getForecast({
      lat: cleanLat,
      lng: cleanLng,
      city: cleanCity,
    });

    // Cache in Redis / Memory for 1800s (30 mins)
    await cacheService.set(cacheKey, forecast, 1800);

    return forecast;
  }
}

module.exports = new WeatherService();
