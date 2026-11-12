import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import PlanMapDiscovery from '../../src/components/plan/PlanMapDiscovery';

describe('Component Test: PlanMapDiscovery Multi-City Redesign (TDD RED Phase)', () => {
  const mockPlaces = [
    // Da Nang
    {
      id: 'dn-01',
      name: 'Dragon Bridge Da Nang',
      city: 'Da Nang',
      lat: 16.061,
      lng: 108.2272,
      category: 'landmark',
      categoryName: 'Landmark',
      rating: 4.8,
      address: 'Nguyen Van Linh, Da Nang',
      image: 'https://example.com/dn1.jpg',
    },
    {
      id: 'dn-02',
      name: 'My Khe Beach',
      city: 'Da Nang',
      lat: 16.0595,
      lng: 108.2464,
      category: 'beach',
      categoryName: 'Beach',
      rating: 4.7,
      address: 'Vo Nguyen Giap, Da Nang',
      image: 'https://example.com/dn2.jpg',
    },
    // Tokyo
    {
      id: 'tky-01',
      name: 'Shibuya Crossing',
      city: 'Tokyo',
      lat: 35.6595,
      lng: 139.7004,
      category: 'landmark',
      categoryName: 'Landmark',
      rating: 4.9,
      address: 'Shibuya, Tokyo, Japan',
      image: 'https://example.com/tky1.jpg',
    },
    // Paris
    {
      id: 'prs-01',
      name: 'Eiffel Tower',
      city: 'Paris',
      lat: 48.8584,
      lng: 2.2945,
      category: 'landmark',
      categoryName: 'Landmark',
      rating: 4.9,
      address: 'Champ de Mars, Paris, France',
      image: 'https://example.com/prs1.jpg',
    },
  ];

  it('RED-FE-PLAN-MC-01: renders the Journey Route bar with initial cities and + Add City button', () => {
    const { getByTestId, getByText } = render(
      <PlanMapDiscovery places={mockPlaces} onGenerateAiPlan={jest.fn()} />
    );

    // Journey route bar container
    expect(getByTestId('journey-route-bar')).toBeTruthy();
    // Quick Add City trigger
    expect(getByTestId('journey-add-city-btn')).toBeTruthy();
    expect(getByText(/\+ Add City|\+ Add Destination/i)).toBeTruthy();
  });

  it('RED-FE-PLAN-MC-02: allows switching active city in the route and updates recommended places', () => {
    const { getByTestId, getByText, queryByText } = render(
      <PlanMapDiscovery places={mockPlaces} onGenerateAiPlan={jest.fn()} />
    );

    // Initial city is Da Nang, should display Dragon Bridge
    expect(getByText('Dragon Bridge Da Nang')).toBeTruthy();
    expect(queryByText('Shibuya Crossing')).toBeNull();

    // Tap on Tokyo in the journey route bar
    const tokyoChip = getByTestId('journey-city-tokyo');
    fireEvent.press(tokyoChip);

    // Now Tokyo places should be visible, Da Nang places should be filtered out
    expect(getByText('Shibuya Crossing')).toBeTruthy();
    expect(queryByText('Dragon Bridge Da Nang')).toBeNull();
  });

  it('RED-FE-PLAN-MC-03: preserves place selections across multiple cities and accumulates count', () => {
    const onToggle = jest.fn();
    const { getByTestId, getByText } = render(
      <PlanMapDiscovery places={mockPlaces} onTogglePlace={onToggle} onGenerateAiPlan={jest.fn()} />
    );

    // 1. In Da Nang, select Dragon Bridge
    const dnSelectBtn = getByTestId('place-select-btn-dn-01');
    fireEvent.press(dnSelectBtn);

    // Check counter shows 1 place selected
    expect(getByText(/1.*selected/i)).toBeTruthy();

    // 2. Switch to Tokyo
    fireEvent.press(getByTestId('journey-city-tokyo'));

    // In Tokyo, select Shibuya Crossing
    const tokyoSelectBtn = getByTestId('place-select-btn-tky-01');
    fireEvent.press(tokyoSelectBtn);

    // Total counter should accumulate to 2 places selected
    expect(getByText(/2.*selected/i)).toBeTruthy();
  });

  it('RED-FE-PLAN-MC-04: renders place recommendation cards with category badge, rating and address', () => {
    const { getByText, getByTestId } = render(
      <PlanMapDiscovery places={mockPlaces} onGenerateAiPlan={jest.fn()} />
    );

    expect(getByTestId('carousel-place-card-dn-01')).toBeTruthy();
    expect(getByText('Dragon Bridge Da Nang')).toBeTruthy();
    expect(getByText(/★.*4\.8/)).toBeTruthy();
    expect(getByText('Nguyen Van Linh, Da Nang')).toBeTruthy();
  });

  it('RED-FE-PLAN-MC-05: passes accumulated multi-city places to onGenerateAiPlan callback', () => {
    const handleAiPlan = jest.fn();
    const { getByTestId, getByText } = render(
      <PlanMapDiscovery places={mockPlaces} onGenerateAiPlan={handleAiPlan} />
    );

    // Select Da Nang place
    fireEvent.press(getByTestId('place-select-btn-dn-01'));

    // Switch to Tokyo and select Tokyo place
    fireEvent.press(getByTestId('journey-city-tokyo'));
    fireEvent.press(getByTestId('place-select-btn-tky-01'));

    // Press AI Planning button
    const aiBtn = getByText(/✨ AI Itinerary Planning/i);
    fireEvent.press(aiBtn);

    // Must be called with both places from Da Nang and Tokyo
    expect(handleAiPlan).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ id: 'dn-01' }),
        expect.objectContaining({ id: 'tky-01' }),
      ]),
      expect.anything()
    );
  });

  it('RED-FE-PLAN-MC-06: allows adding a new city (e.g. Paris) to the active Journey Route', () => {
    const { getByTestId, getByText } = render(
      <PlanMapDiscovery places={mockPlaces} onGenerateAiPlan={jest.fn()} />
    );

    // Open Add City picker
    const addCityBtn = getByTestId('journey-add-city-btn');
    fireEvent.press(addCityBtn);

    // Select Paris from the city picker
    const parisOption = getByTestId('city-picker-option-paris');
    fireEvent.press(parisOption);

    // Paris should now be present in the Journey Route
    expect(getByTestId('journey-city-paris')).toBeTruthy();
  });
});
