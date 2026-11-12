import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import MultiCityPlanWizard from '../../src/components/plan/MultiCityPlanWizard';

const mockPlaces = [
  // Đà Nẵng
  {
    id: 'dn-01',
    name: 'Cầu Rồng Đà Nẵng',
    city: 'Đà Nẵng',
    lat: 16.0610,
    lng: 108.2272,
    category: 'landmark',
    categoryName: 'Di tích & Biểu tượng',
    rating: 4.8,
    estimatedCost: 0,
    address: 'Hải Châu, Đà Nẵng',
  },
  {
    id: 'dn-02',
    name: 'Bãi Biển Mỹ Khê',
    city: 'Đà Nẵng',
    lat: 16.0595,
    lng: 108.2464,
    category: 'beach',
    categoryName: 'Biển & Nghỉ dưỡng',
    rating: 4.7,
    estimatedCost: 50000,
    address: 'Sơn Trà, Đà Nẵng',
  },
  // Hội An
  {
    id: 'ha-01',
    name: 'Chùa Cầu Hội An',
    city: 'Hội An',
    lat: 15.8771,
    lng: 108.3260,
    category: 'landmark',
    categoryName: 'Phố Cổ',
    rating: 4.9,
    estimatedCost: 150000,
    address: 'Phố Cổ Hội An',
  },
  {
    id: 'ha-02',
    name: 'Bánh Mì Phượng',
    city: 'Hội An',
    lat: 15.8795,
    lng: 108.3320,
    category: 'food',
    categoryName: 'Ẩm thực Nổi tiếng',
    rating: 4.7,
    estimatedCost: 35000,
    address: 'Phan Châu Trinh, Hội An',
  },
];

describe('Component Test: MultiCityPlanWizard (Guided Step-by-Step Multi-City Map Journey)', () => {
  it('RED-WIZARD-01: renders initial setup stage with city choices, duration, and budget options', () => {
    const { getByText, getAllByText, getByTestId } = render(
      <MultiCityPlanWizard
        places={mockPlaces}
        onCompletePlan={jest.fn()}
        onCancel={jest.fn()}
      />
    );

    // Header & Setup screen
    expect(getByText(/Smart Multi-City Journey Planner/i)).toBeTruthy();
    expect(getByTestId('wizard-setup-stage')).toBeTruthy();

    // City selector chips
    expect(getAllByText(/Đà Nẵng|Da Nang/i).length).toBeGreaterThan(0);
    expect(getAllByText(/Hội An|Hoi An/i).length).toBeGreaterThan(0);

    // Budget options (Budget, Standard, Luxury)
    expect(getAllByText(/Budget/i).length).toBeGreaterThan(0);
    expect(getAllByText(/Standard/i).length).toBeGreaterThan(0);
    expect(getByText(/Luxury/i)).toBeTruthy();

    // Action button
    expect(getByText(/Start Stage 1/i)).toBeTruthy();
  });

  it('RED-WIZARD-02: starts journey at City A with dominant Mapbox map and city A places', () => {
    const { getByText, getAllByText, getByTestId, queryByText } = render(
      <MultiCityPlanWizard
        places={mockPlaces}
        onCompletePlan={jest.fn()}
        onCancel={jest.fn()}
      />
    );

    // Tap "Start Stage 1"
    fireEvent.press(getByText(/Start Stage 1/i));

    // Should be in stage 2: Map Stage
    expect(getByTestId('wizard-map-stage')).toBeTruthy();
    expect(getAllByText(/Stage 1/i).length).toBeGreaterThan(0);
    expect(getAllByText(/Đà Nẵng/i).length).toBeGreaterThan(0);

    // Mapbox image should be present and point to Đà Nẵng
    const mapImage = getByTestId('wizard-mapbox-canvas');
    expect(mapImage).toBeTruthy();
    expect(mapImage.props.source.uri).toContain('108.2272');

    // Should display places of City A
    expect(getByText('Cầu Rồng Đà Nẵng')).toBeTruthy();
    expect(getByText('Bãi Biển Mỹ Khê')).toBeTruthy();
    // Should NOT display places of City B yet
    expect(queryByText('Chùa Cầu Hội An')).toBeNull();
  });

  it('RED-WIZARD-03: selects places in City A and transitions map and places to City B', () => {
    const { getByText, getAllByText, getByTestId, queryByText } = render(
      <MultiCityPlanWizard
        places={mockPlaces}
        onCompletePlan={jest.fn()}
        onCancel={jest.fn()}
      />
    );

    // Advance to Stage 2
    fireEvent.press(getByText(/Start Stage 1/i));

    // Select place in City A
    fireEvent.press(getByTestId('wizard-place-select-dn-01'));
    expect(getAllByText(/1 place selected/i).length).toBeGreaterThan(0);

    // Tap "Next Stage →"
    fireEvent.press(getByText(/Next Stage/i));

    // Now should be at Stage 2 (Hội An)
    expect(getAllByText(/Stage 2/i).length).toBeGreaterThan(0);
    expect(getAllByText(/Hội An/i).length).toBeGreaterThan(0);

    // Map canvas should update coordinates to Hội An (108.326)
    const mapImage = getByTestId('wizard-mapbox-canvas');
    expect(mapImage.props.source.uri).toContain('108.326');

    // Should display places of City B
    expect(getByText('Chùa Cầu Hội An')).toBeTruthy();
    expect(getByText('Bánh Mì Phượng')).toBeTruthy();
    // City A places should not be in the current carousel
    expect(queryByText('Cầu Rồng Đà Nẵng')).toBeNull();
  });

  it('RED-WIZARD-04: completes all stages, compiles multi-city plan, and triggers onCompletePlan callback', () => {
    const mockOnComplete = jest.fn();
    const { getByText, getByTestId } = render(
      <MultiCityPlanWizard
        places={mockPlaces}
        onCompletePlan={mockOnComplete}
        onCancel={jest.fn()}
      />
    );

    // Setup -> Stage 1 (Đà Nẵng)
    fireEvent.press(getByText(/Start Stage 1/i));

    // Pick 1 in Đà Nẵng
    fireEvent.press(getByTestId('wizard-place-select-dn-01'));
    fireEvent.press(getByText(/Next Stage/i));

    // Pick 1 in Hội An
    fireEvent.press(getByTestId('wizard-place-select-ha-01'));
    fireEvent.press(getByText(/Finish & Review Plan/i));

    // Should reach Stage 3: Summary
    expect(getByTestId('wizard-summary-stage')).toBeTruthy();
    expect(getByText(/Your Custom Itinerary/i)).toBeTruthy();
    expect(getByText(/Cầu Rồng Đà Nẵng/i)).toBeTruthy();
    expect(getByText(/Chùa Cầu Hội An/i)).toBeTruthy();

    // Tap "Save Plan to Itinerary"
    fireEvent.press(getByText(/Save Plan to Itinerary/i));

    expect(mockOnComplete).toHaveBeenCalledWith(
      expect.objectContaining({
        title: expect.any(String),
        cities: expect.arrayContaining([expect.stringMatching(/Đà Nẵng|Da Nang/i), expect.stringMatching(/Hội An|Hoi An/i)]),
        places: expect.arrayContaining([
          expect.objectContaining({ id: 'dn-01' }),
          expect.objectContaining({ id: 'ha-01' }),
        ]),
        totalEstimatedCost: expect.any(Number),
      })
    );
  });
});
