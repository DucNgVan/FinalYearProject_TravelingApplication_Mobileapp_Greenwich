const WeatherProvider = require('../../../src/providers/weather.provider');

describe('Unit Test: WeatherProvider (Open-Meteo WMO Live Integration)', () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('RED-WTH-01: should fetch live weather from Open-Meteo and normalize WMO codes into weather conditions', async () => {
    const mockOpenMeteoPayload = {
      latitude: 16.0544,
      longitude: 108.2022,
      current: {
        time: '2026-11-13T12:00',
        temperature_2m: 28.4,
        relative_humidity_2m: 68,
        weather_code: 0, // Clear sky
      },
      daily: {
        time: ['2026-11-13', '2026-11-14', '2026-11-15', '2026-11-16'],
        weather_code: [0, 1, 61, 3], // Sunny, Mainly clear, Slight rain, Overcast
        temperature_2m_max: [29.5, 30.1, 26.8, 28.0],
        temperature_2m_min: [23.1, 24.0, 22.5, 23.0],
      },
    };

    globalThis.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockOpenMeteoPayload),
    });

    const provider = new WeatherProvider();
    const result = await provider.getForecast({
      lat: 16.0544,
      lng: 108.2022,
      city: 'Da Nang',
    });

    expect(result.city).toBe('Da Nang');
    expect(result.temp).toBe('28°C');
    expect(result.condition).toBe('Sunny');
    expect(result.icon).toBe('☀️');
    expect(result.forecast).toHaveLength(4);
    expect(result.forecast[0].day).toBe('Today');
    expect(result.forecast[2].condition).toBe('Showers');
    expect(result.forecast[2].icon).toBe('🌧️');
  });

  it('RED-WTH-02: should fall back safely to localized default weather on network failure', async () => {
    globalThis.fetch = jest.fn().mockRejectedValue(new Error('Open-Meteo unreachable'));

    const provider = new WeatherProvider();
    const result = await provider.getForecast({
      lat: 16.0544,
      lng: 108.2022,
      city: 'Da Nang',
    });

    expect(result.city).toBe('Da Nang');
    expect(result.temp).toBeDefined();
    expect(result.forecast).toHaveLength(4);
  });
});
