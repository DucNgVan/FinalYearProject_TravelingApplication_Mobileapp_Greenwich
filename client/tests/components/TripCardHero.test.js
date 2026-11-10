import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import TripCardHero from '../../src/components/plan/TripCardHero';

describe('TripCardHero Component (RED Phase)', () => {
  const mockOnPress = jest.fn();
  const sampleTrip = {
    id: 'trip-paris-01',
    title: 'Paris',
    destinationCity: 'Paris',
    country: 'France',
    daysCount: 5,
    status: 'LIVE', // 'LIVE' | 'Ready' | 'Draft'
    currentDay: 1,
    progressPercentage: 20,
    coverImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('RED-HERO-01: Renders hero card with destination, duration, large title, and LIVE badge', () => {
    const { getByText, getByTestId } = render(
      <TripCardHero
        trip={sampleTrip}
        onPress={mockOnPress}
      />
    );

    // Hero container
    expect(getByTestId('trip-hero-card-trip-paris-01')).toBeTruthy();

    // Subtitle meta: FRANCE · 5 DAYS
    expect(getByText(/FRANCE/i)).toBeTruthy();
    expect(getByText(/5 DAYS/i)).toBeTruthy();

    // Title: Paris
    expect(getByText('Paris')).toBeTruthy();

    // Badge: LIVE
    expect(getByTestId('trip-hero-badge-live')).toBeTruthy();
    expect(getByText(/LIVE/i)).toBeTruthy();

    // Progress row: DAY 1 OF 5 and 20%
    expect(getByText('DAY 1 OF 5')).toBeTruthy();
    expect(getByText('20%')).toBeTruthy();
    expect(getByTestId('trip-hero-progress-bar')).toBeTruthy();
  });

  test('RED-HERO-02: Tapping card triggers onPress handler with trip object', () => {
    const { getByTestId } = render(
      <TripCardHero
        trip={sampleTrip}
        onPress={mockOnPress}
      />
    );

    fireEvent.press(getByTestId('trip-hero-card-trip-paris-01'));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
    expect(mockOnPress).toHaveBeenCalledWith(sampleTrip);
  });
});
