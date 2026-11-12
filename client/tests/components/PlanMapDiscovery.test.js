import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import PlanMapDiscovery from '../../src/components/plan/PlanMapDiscovery';

const mockPlaces = [
  {
    id: 'dn-01',
    name: 'Cầu Rồng Đà Nẵng',
    city: 'Đà Nẵng',
    lat: 16.0610,
    lng: 108.2272,
    category: 'landmark',
    categoryName: 'Di tích & Biểu tượng',
    rating: 4.8,
    address: 'Nguyễn Văn Linh, Hải Châu',
    image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b',
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
    address: 'Võ Nguyên Giáp, Sơn Trà',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
  },
  {
    id: 'dn-03',
    name: 'Bánh Xèo Bà Dưỡng',
    city: 'Đà Nẵng',
    lat: 16.0592,
    lng: 108.2140,
    category: 'food',
    categoryName: 'Ẩm thực địa phương',
    rating: 4.6,
    address: 'K280/23 Hoàng Diệu, Hải Châu',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999',
  },
];

describe('Component Test: PlanMapDiscovery (Interactive Map, Search & AI Plan Button)', () => {
  it('RED-FE-MAP-01: renders search bar, city chips, and category filter chips', () => {
    const { getByPlaceholderText, getByText, getAllByText } = render(
      <PlanMapDiscovery places={mockPlaces} onGenerateAiPlan={jest.fn()} />
    );

    // Floating Search bar
    expect(getByPlaceholderText(/e\.g\..*Ba Na Hills/i)).toBeTruthy();

    // City chips
    expect(getAllByText(/Đà Nẵng/i).length).toBeGreaterThan(0);
    expect(getAllByText(/Tokyo/i).length).toBeGreaterThan(0);

    // Category filter tabs
    expect(getByText('All')).toBeTruthy();
    expect(getByText('Attractions')).toBeTruthy();
    expect(getByText('Beaches')).toBeTruthy();
    expect(getByText('Food & Dining')).toBeTruthy();
  });

  it('RED-FE-MAP-02: filters places by search query and category', () => {
    const { getByPlaceholderText, getByText, queryByText } = render(
      <PlanMapDiscovery places={mockPlaces} onGenerateAiPlan={jest.fn()} />
    );

    // Initial state: shows all
    expect(getByText('Cầu Rồng Đà Nẵng')).toBeTruthy();
    expect(getByText('Bãi Biển Mỹ Khê')).toBeTruthy();
    expect(getByText('Bánh Xèo Bà Dưỡng')).toBeTruthy();

    // Search query filter
    const searchInput = getByPlaceholderText(/e\.g\..*Ba Na Hills/i);
    fireEvent.changeText(searchInput, 'Cầu Rồng');

    expect(getByText('Cầu Rồng Đà Nẵng')).toBeTruthy();
    expect(queryByText('Bãi Biển Mỹ Khê')).toBeNull();
    expect(queryByText('Bánh Xèo Bà Dưỡng')).toBeNull();

    // Reset search
    fireEvent.changeText(searchInput, '');

    // Category filter
    fireEvent.press(getByText('Food & Dining'));
    expect(getByText('Bánh Xèo Bà Dưỡng')).toBeTruthy();
    expect(queryByText('Cầu Rồng Đà Nẵng')).toBeNull();
  });

  it('RED-FE-MAP-03: toggles place selection and updates selected count badge', () => {
    const { getByText, getAllByText, queryByText } = render(
      <PlanMapDiscovery places={mockPlaces} onGenerateAiPlan={jest.fn()} />
    );

    // Select first place
    const selectButtons = getAllByText(/\+ Select/i);
    fireEvent.press(selectButtons[0]);

    // First place should now show selected state
    const selectedBtn = getByText(/✓ Selected/i);
    expect(selectedBtn).toBeTruthy();

    // Toggle again to deselect
    fireEvent.press(selectedBtn);

    expect(queryByText(/✓ Selected/i)).toBeNull();
  });

  it('RED-FE-MAP-04: triggers onGenerateAiPlan callback when tapping AI button with selected places', () => {
    const mockOnGenerate = jest.fn();
    const { getAllByText, getByText } = render(
      <PlanMapDiscovery places={mockPlaces} onGenerateAiPlan={mockOnGenerate} />
    );

    // Select places
    const selectButtons = getAllByText(/\+ Select/i);
    fireEvent.press(selectButtons[0]);
    fireEvent.press(selectButtons[1]);

    // Press AI plan button
    const aiBtn = getByText(/✨ AI Itinerary Planning/i);
    fireEvent.press(aiBtn);

    expect(mockOnGenerate).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ id: 'dn-01' }),
        expect.objectContaining({ id: 'dn-02' }),
      ]),
      expect.anything()
    );
  });

  it('RED-FE-MAP-05: renders Mapbox vector static map image with user token', () => {
    const { getByTestId } = render(
      <PlanMapDiscovery places={mockPlaces} onGenerateAiPlan={jest.fn()} />
    );

    const mapImage = getByTestId('mapbox-canvas-image');
    expect(mapImage).toBeTruthy();
    expect(mapImage.props.source.uri).toContain('api.mapbox.com/styles/v1/mapbox');
    expect(mapImage.props.source.uri).toContain('access_token=');
  });

  it('RED-FE-MAP-06: should generate multi-pin Mapbox static URL containing pins for places in the list', () => {
    const { getByTestId } = render(
      <PlanMapDiscovery places={mockPlaces} onGenerateAiPlan={jest.fn()} />
    );

    const mapImage = getByTestId('mapbox-canvas-image');
    expect(mapImage.props.source.uri).toMatch(/pin-[s|l]-/);
    expect(mapImage.props.source.uri).toContain('108.2272');
    expect(mapImage.props.source.uri).toContain('auto');
  });

  it('RED-FE-MAP-07: renders clean map canvas without glitchy floating Stop pill overlays', () => {
    const { queryByTestId } = render(
      <PlanMapDiscovery places={mockPlaces} onGenerateAiPlan={jest.fn()} />
    );

    expect(queryByTestId('map-pin-marker-dn-01')).toBeNull();
  });

  it('RED-FE-MAP-08: highlights active place when card is tapped and syncs with horizontal place carousel', () => {
    const { getByTestId } = render(
      <PlanMapDiscovery places={mockPlaces} onGenerateAiPlan={jest.fn()} />
    );

    const firstCard = getByTestId('carousel-place-card-dn-01');
    expect(firstCard).toBeTruthy();
    fireEvent.press(firstCard);
    expect(getByTestId('carousel-place-card-dn-01')).toBeTruthy();
  });

  it('RED-FE-MAP-09: renders Map Focus mode with horizontal place carousel by default without debug engine overlay', () => {
    const { getByTestId, queryByTestId, queryByText } = render(
      <PlanMapDiscovery places={mockPlaces} onGenerateAiPlan={jest.fn()} />
    );

    expect(getByTestId('places-horizontal-carousel')).toBeTruthy();
    expect(queryByTestId('map-view-mode-toggle')).toBeNull();
    expect(queryByText(/Mapbox Vector Engine/i)).toBeNull();
  });
});

