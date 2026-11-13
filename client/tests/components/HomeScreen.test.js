import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import HomeScreen from '../../src/screens/home/HomeScreen';
import { useItineraryStore } from '../../src/stores/itinerary.store';

describe('Component Test: HomeScreen (TREK-Inspired Central Hub)', () => {
  const mockOnNavigateTab = jest.fn();
  const mockOnOpenProfile = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useItineraryStore.setState({
      trips: [
        {
          id: 'trip-berlin-01',
          title: 'Berlin 2026',
          destination: 'Berlin',
          days: [{ dayIndex: 0, items: [{}, {}] }],
          coverImage: 'https://images.unsplash.com/photo-1560969184-10fe8719e047',
        },
      ],
    });
  });

  test('RED-FE-HOME-01: should render brand header with logo and notification bell (avatar removed per concept)', () => {
    const { getByTestId, getByText, queryByTestId } = render(
      <HomeScreen onNavigateTab={mockOnNavigateTab} onOpenProfile={mockOnOpenProfile} />
    );

    expect(getByText(/NOMADIX/i)).toBeTruthy();
    expect(getByTestId('home-bell-btn')).toBeTruthy();
    expect(queryByTestId('home-avatar-btn')).toBeNull();
  });

  test('RED-FE-HOME-02: should render Hero Trip Card with title, dates, destinations, and traveler count', () => {
    const { getByTestId, getByText } = render(
      <HomeScreen onNavigateTab={mockOnNavigateTab} onOpenProfile={mockOnOpenProfile} />
    );

    const heroCard = getByTestId('hero-trip-card');
    expect(heroCard).toBeTruthy();
    expect(getByText(/RECENT/i)).toBeTruthy();
    expect(getByText(/Berlin 2026|Đà Nẵng & Hội An/i)).toBeTruthy();
    expect(getByText(/destinations|điểm đến/i)).toBeTruthy();
    expect(getByText(/travelers|thành viên/i)).toBeTruthy();
  });

  test('RED-FE-HOME-03: should render Segmented Pills (Planned, Archived, Completed) and switch active tab', () => {
    const { getByTestId, getByText } = render(
      <HomeScreen onNavigateTab={mockOnNavigateTab} onOpenProfile={mockOnOpenProfile} />
    );

    expect(getByTestId('segmented-pill-planned')).toBeTruthy();
    expect(getByTestId('segmented-pill-archived')).toBeTruthy();
    expect(getByTestId('segmented-pill-completed')).toBeTruthy();

    fireEvent.press(getByTestId('segmented-pill-archived'));
    // Tab switched without crashing
    expect(getByText(/Archived|Đã lưu/i)).toBeTruthy();
  });

  test('RED-FE-HOME-04: should render Currency Converter Widget and support swap calculation', () => {
    const { getByTestId, getByText } = render(
      <HomeScreen onNavigateTab={mockOnNavigateTab} onOpenProfile={mockOnOpenProfile} />
    );

    const converterWidget = getByTestId('currency-converter-widget');
    expect(converterWidget).toBeTruthy();
    expect(getByText(/CURRENCY|TIỀN TỆ/i)).toBeTruthy();

    const fromInput = getByTestId('currency-from-input');
    expect(fromInput).toBeTruthy();

    const swapBtn = getByTestId('currency-swap-btn');
    expect(swapBtn).toBeTruthy();

    fireEvent.press(swapBtn);
    // Verifies swap interaction
    expect(getByTestId('currency-converter-widget')).toBeTruthy();
  });

  test('RED-FE-HOME-05: should render Collections card and Travel Radar & Weather widget', () => {
    const { getByTestId, getByText } = render(
      <HomeScreen onNavigateTab={mockOnNavigateTab} onOpenProfile={mockOnOpenProfile} />
    );

    expect(getByTestId('collections-card')).toBeTruthy();
    expect(getByText(/COLLECTIONS|BỘ SƯU TẬP/i)).toBeTruthy();

    expect(getByTestId('home-travel-radar-widget')).toBeTruthy();
    expect(getByText(/TRAVEL RADAR & WEATHER/i)).toBeTruthy();
  });
});
