import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import HomeScreen from '../../src/screens/home/HomeScreen';

describe('Frontend Test: HomeScreen Live Weather Integration', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    globalThis.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({
        success: true,
        data: {
          city: 'Da Nang',
          temp: '28°C',
          condition: 'Sunny',
          icon: '☀️',
          forecast: [
            { day: 'Today', temp: '28°', icon: '☀️', condition: 'Sunny' },
            { day: 'Sat', temp: '29°', icon: '⛅', condition: 'Partly Cloudy' },
            { day: 'Sun', temp: '26°', icon: '🌧️', condition: 'Showers' },
            { day: 'Mon', temp: '28°', icon: '🌤️', condition: 'Pleasant' },
          ],
        },
      }),
    });
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('RED-FE-WTH-01: fetches and renders live weather from weather endpoint on mount', async () => {
    const { getByText, getByTestId } = render(<HomeScreen />);

    await waitFor(() => {
      expect(getByTestId('gps-weather-card')).toBeTruthy();
      expect(getByText('Da Nang')).toBeTruthy();
    });
  });
});
