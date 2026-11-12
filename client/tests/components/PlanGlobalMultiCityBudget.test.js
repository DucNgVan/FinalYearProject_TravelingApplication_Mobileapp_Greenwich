import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import PlanMapDiscovery from '../../src/components/plan/PlanMapDiscovery';

describe('Component Test: PlanMapDiscovery Global Search, Budget & Duration Steppers (TDD RED Phase)', () => {
  const mockPlaces = [
    {
      id: 'dn-01',
      name: 'Dragon Bridge Da Nang',
      city: 'Da Nang',
      category: 'landmark',
      rating: 4.8,
      address: 'Nguyen Van Linh, Da Nang',
    },
    {
      id: 'bkk-01',
      name: 'Grand Palace Bangkok',
      city: 'Bangkok',
      category: 'landmark',
      rating: 4.9,
      address: 'Na Phra Lan Rd, Bangkok',
    },
  ];

  it('RED-FE-PLAN-GLOBAL-01: allows searching and adding any destination worldwide into the dynamic journey route', () => {
    const { getByPlaceholderText, getByTestId, getByText } = render(
      <PlanMapDiscovery places={mockPlaces} onGenerateAiPlan={jest.fn()} />
    );

    // Search for Bangkok in the destination search input
    const searchInput = getByPlaceholderText(/e\.g\..*Ba Na Hills|search/i);
    fireEvent.changeText(searchInput, 'Bangkok');

    // Click quick add Bangkok suggestion / button
    const addDestinationBtn = getByTestId('journey-add-city-btn');
    fireEvent.press(addDestinationBtn);

    const bangkokOption = getByTestId('city-picker-option-bangkok');
    fireEvent.press(bangkokOption);

    // Bangkok should now be added to the journey route
    expect(getByTestId('journey-city-bangkok')).toBeTruthy();
  });

  it('RED-FE-PLAN-GLOBAL-02: allows removing a city from the journey route via the remove button', () => {
    const { getByTestId, queryByTestId } = render(
      <PlanMapDiscovery places={mockPlaces} onGenerateAiPlan={jest.fn()} />
    );

    // Initial journey contains cities
    expect(getByTestId('journey-city-hoian')).toBeTruthy();

    // Tap remove button for Hoi An
    const removeHoiAnBtn = getByTestId('journey-remove-city-hoian');
    fireEvent.press(removeHoiAnBtn);

    // Hoi An should be removed from the journey route
    expect(queryByTestId('journey-city-hoian')).toBeNull();
  });

  it('RED-FE-PLAN-GLOBAL-03: renders clean map canvas without glitchy floating Stop pill buttons', () => {
    const { queryByText, queryByTestId } = render(
      <PlanMapDiscovery places={mockPlaces} onGenerateAiPlan={jest.fn()} />
    );

    // Clean canvas should NOT render the red/green floating Stop pills
    expect(queryByText(/Stop 1/i)).toBeNull();
    expect(queryByTestId('map-pin-marker-dn-01')).toBeNull();
  });

  it('RED-FE-PLAN-GLOBAL-04: renders per-city stay duration steppers and computes total trip days', () => {
    const { getByTestId, getByText } = render(
      <PlanMapDiscovery places={mockPlaces} onGenerateAiPlan={jest.fn()} />
    );

    // Trip configuration panel should be present
    expect(getByTestId('trip-duration-config-panel')).toBeTruthy();

    // Increase stay duration for active city (Da Nang)
    const incBtn = getByTestId('city-duration-inc-danang');
    fireEvent.press(incBtn);

    // Total days indicator should update
    expect(getByText(/Total:.*days/i)).toBeTruthy();
  });

  it('RED-FE-PLAN-GLOBAL-05: renders total budget selector and displays AI smart budget distribution per city', () => {
    const { getByTestId, getByText } = render(
      <PlanMapDiscovery places={mockPlaces} onGenerateAiPlan={jest.fn()} />
    );

    // Budget selector panel
    expect(getByTestId('trip-budget-config-panel')).toBeTruthy();

    // Select standard tier or enter budget
    const budgetStandardBtn = getByTestId('budget-tier-standard');
    fireEvent.press(budgetStandardBtn);

    // AI smart budget breakdown per destination should be displayed
    expect(getByTestId('ai-budget-allocation-breakdown')).toBeTruthy();
    expect(getByText(/AI Budget (Allocation|Distribution)/i)).toBeTruthy();
  });

  it('RED-FE-PLAN-GLOBAL-06: passes full plan config (cities, stay durations, budget, places) to onGenerateAiPlan callback', () => {
    const handleAiPlan = jest.fn();
    const { getByTestId, getByText } = render(
      <PlanMapDiscovery places={mockPlaces} onGenerateAiPlan={handleAiPlan} />
    );

    // Press AI Planning button
    const aiBtn = getByText(/✨ AI Itinerary Planning/i);
    fireEvent.press(aiBtn);

    expect(handleAiPlan).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        cities: expect.any(Array),
        durations: expect.any(Object),
        totalBudget: expect.any(Number),
        budgetBreakdown: expect.any(Object),
      })
    );
  });
});
