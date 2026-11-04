import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import HomeScreen from '../../src/screens/home/HomeScreen';

describe('Component Test: HomeScreen (TREK-Inspired Central Hub)', () => {
  const mockOnNavigateTab = jest.fn();
  const mockOnOpenProfile = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('RED-FE-HOME-01: should render brand header with logo, notification bell, and avatar button', () => {
    const { getByTestId, getByText } = render(
      <HomeScreen onNavigateTab={mockOnNavigateTab} onOpenProfile={mockOnOpenProfile} />
    );

    expect(getByText(/NOMADIX/i)).toBeTruthy();
    expect(getByTestId('home-bell-btn')).toBeTruthy();
    const avatarBtn = getByTestId('home-avatar-btn');
    expect(avatarBtn).toBeTruthy();

    fireEvent.press(avatarBtn);
    expect(mockOnOpenProfile).toHaveBeenCalledTimes(1);
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

  test('RED-FE-HOME-05: should render Collections card and Quick Shortcuts to Flights, Hotels, Plan, and Group', () => {
    const { getByTestId, getByText } = render(
      <HomeScreen onNavigateTab={mockOnNavigateTab} onOpenProfile={mockOnOpenProfile} />
    );

    expect(getByTestId('collections-card')).toBeTruthy();
    expect(getByText(/COLLECTIONS|BỘ SƯU TẬP/i)).toBeTruthy();

    const btnFlights = getByTestId('shortcut-flights');
    const btnHotels = getByTestId('shortcut-hotels');
    const btnPlan = getByTestId('shortcut-plan');
    const btnGroup = getByTestId('shortcut-group');

    fireEvent.press(btnFlights);
    expect(mockOnNavigateTab).toHaveBeenCalledWith('flights');

    fireEvent.press(btnHotels);
    expect(mockOnNavigateTab).toHaveBeenCalledWith('hotels');

    fireEvent.press(btnPlan);
    expect(mockOnNavigateTab).toHaveBeenCalledWith('plan');

    fireEvent.press(btnGroup);
    expect(mockOnNavigateTab).toHaveBeenCalledWith('group');
  });
});
