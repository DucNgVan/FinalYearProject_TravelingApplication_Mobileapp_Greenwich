/**
 * WeatherProvider (Tier 4 External Adapter)
 * Integrates with Open-Meteo WMO Live Weather API (Free, global, no API key required)
 * and provides resilient fallback.
 */

const WMO_CODE_MAP = {
  0: { condition: 'Sunny', icon: '☀️' },
  1: { condition: 'Mainly Clear', icon: '🌤️' },
  2: { condition: 'Partly Cloudy', icon: '⛅' },
  3: { condition: 'Overcast', icon: '☁️' },
  45: { condition: 'Foggy', icon: '🌫️' },
  48: { condition: 'Depositing Rime Fog', icon: '🌫️' },
  51: { condition: 'Light Drizzle', icon: '🌦️' },
  53: { condition: 'Moderate Drizzle', icon: '🌦️' },
  55: { condition: 'Dense Drizzle', icon: '🌧️' },
  61: { condition: 'Showers', icon: '🌧️' },
  63: { condition: 'Moderate Rain', icon: '🌧️' },
  65: { condition: 'Heavy Rain', icon: '🌧️' },
  71: { condition: 'Slight Snow', icon: '❄️' },
  73: { condition: 'Moderate Snow', icon: '❄️' },
  75: { condition: 'Heavy Snow', icon: '❄️' },
  80: { condition: 'Rain Showers', icon: '🌧️' },
  81: { condition: 'Moderate Showers', icon: '🌧️' },
  82: { condition: 'Violent Showers', icon: '⛈️' },
  95: { condition: 'Thunderstorm', icon: '⛈️' },
  96: { condition: 'Thunderstorm with Hail', icon: '⛈️' },
  99: { condition: 'Severe Thunderstorm', icon: '⛈️' },
};

function parseWmoCode(code) {
  return WMO_CODE_MAP[code] || { condition: 'Pleasant', icon: '🌤️' };
}

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

class WeatherProvider {
  constructor(baseUrl = 'https://api.open-meteo.com/v1/forecast') {
    this.baseUrl = baseUrl;
  }

  async getForecast({ lat = 16.0544, lng = 108.2022, city = 'Da Nang' } = {}) {
    const fallback = {
      city,
      locationLabel: 'GPS Location',
      temp: '28°C',
      condition: 'Sunny',
      icon: '☀️',
      highLow: 'High 29° • Low 23°',
      humidity: '65%',
      forecast: [
        { day: 'Today', date: 'Fri', temp: '28°', highLow: '29° / 23°', icon: '☀️', condition: 'Sunny' },
        { day: 'Tomorrow', date: 'Sat', temp: '29°', highLow: '30° / 24°', icon: '⛅', condition: 'Partly Cloudy' },
        { day: 'Sun', date: 'Sun', temp: '26°', highLow: '27° / 22°', icon: '🌧️', condition: 'Showers' },
        { day: 'Mon', date: 'Mon', temp: '28°', highLow: '29° / 23°', icon: '🌤️', condition: 'Pleasant' },
      ],
    };

    try {
      const url = `${this.baseUrl}?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'User-Agent': 'Nomadix-Travel-App/1.0',
        },
      });

      if (!response.ok) {
        return fallback;
      }

      const data = await response.json();
      if (!data || !data.current || !data.daily) {
        return fallback;
      }

      const currentWeather = parseWmoCode(data.current.weather_code);
      const currentTemp = Math.round(data.current.temperature_2m);
      const humidity = data.current.relative_humidity_2m || 65;
      const todayMax = Math.round(data.daily.temperature_2m_max?.[0] || currentTemp + 1);
      const todayMin = Math.round(data.daily.temperature_2m_min?.[0] || currentTemp - 5);

      const forecastList = [];
      const times = data.daily.time || [];
      const count = Math.min(times.length, 4);

      for (let i = 0; i < count; i++) {
        const dObj = new Date(times[i]);
        const dayLabel = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : DAY_NAMES[dObj.getDay()];
        const wmoInfo = parseWmoCode(data.daily.weather_code?.[i]);
        const maxT = Math.round(data.daily.temperature_2m_max?.[i]);
        const minT = Math.round(data.daily.temperature_2m_min?.[i]);

        forecastList.push({
          day: dayLabel,
          date: DAY_NAMES[dObj.getDay()],
          temp: `${maxT}°`,
          highLow: `${maxT}° / ${minT}°`,
          icon: wmoInfo.icon,
          condition: wmoInfo.condition,
        });
      }

      return {
        city,
        locationLabel: 'GPS Location',
        temp: `${currentTemp}°C`,
        condition: currentWeather.condition,
        icon: currentWeather.icon,
        highLow: `High ${todayMax}° • Low ${todayMin}°`,
        humidity: `${humidity}%`,
        forecast: forecastList.length >= 4 ? forecastList : fallback.forecast,
      };
    } catch (err) {
      return fallback;
    }
  }
}

module.exports = WeatherProvider;
