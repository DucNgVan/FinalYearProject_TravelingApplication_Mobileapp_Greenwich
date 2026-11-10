import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { MOCK_SPOTS_BY_CITY } from '../../src/data/mockPlanData';
import AccordionTripWizardModal from '../../src/components/plan/AccordionTripWizardModal';

// Mock usePlacesStore
let mockApiPlaces = [];
const mockFetchPlaces = jest.fn().mockResolvedValue([]);

jest.mock('../../src/stores/places.store', () => ({
  usePlacesStore: () => ({
    places: mockApiPlaces,
    fetchPlaces: mockFetchPlaces,
  }),
}));

describe('TDD RED Phase: Spot Real Photos Verification', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockApiPlaces = [];
  });

  test('RED-REAL-PHOTO-01: Da Nang top landmarks have authentic, distinct image URLs (not generic stock photos)', () => {
    const danangSpots = MOCK_SPOTS_BY_CITY['Đà Nẵng']?.categories?.flatMap((c) => c.spots) || [];
    expect(danangSpots.length).toBeGreaterThanOrEqual(10);

    const cauRong = danangSpots.find((s) => s.name.includes('Dragon Bridge') || s.name.includes('Cầu Rồng'));
    const baNa = danangSpots.find((s) => s.name.includes('Ba Na') || s.name.includes('Bà Nà') || s.name.includes('Cầu Vàng'));
    const linhUng = danangSpots.find((s) => s.name.includes('Linh Ứng') || s.name.includes('Sơn Trà'));
    const nguHanhSon = danangSpots.find((s) => s.name.includes('Ngũ Hành Sơn') || s.name.includes('Marble Mountains'));
    const myKhe = danangSpots.find((s) => s.name.includes('Mỹ Khê') || s.name.includes('My Khe'));

    expect(cauRong).toBeDefined();
    expect(baNa).toBeDefined();
    expect(linhUng).toBeDefined();
    expect(nguHanhSon).toBeDefined();
    expect(myKhe).toBeDefined();

    // Must NOT use generic placeholder photo-1559592413-7cec4d0cae2b
    expect(cauRong.image).not.toContain('photo-1559592413-7cec4d0cae2b');
    expect(nguHanhSon.image).not.toContain('photo-1559592413-7cec4d0cae2b');

    // Specific landmark images must contain authentic photo identifiers / Wikimedia / landmark keywords
    expect(
      cauRong.image.includes('Cau_Rong') ||
      cauRong.image.includes('Dragon_Bridge') ||
      cauRong.image.includes('dragon-bridge') ||
      cauRong.image.includes('cau-rong')
    ).toBe(true);

    expect(
      baNa.image.includes('Golden_Bridge') ||
      baNa.image.includes('Ba_Na') ||
      baNa.image.includes('golden-bridge') ||
      baNa.image.includes('bana-hills')
    ).toBe(true);
  });

  test('RED-REAL-PHOTO-02: No two distinct landmarks in Da Nang share the identical image URL', () => {
    const danangSpots = MOCK_SPOTS_BY_CITY['Đà Nẵng']?.categories?.flatMap((c) => c.spots) || [];
    const imageUrls = danangSpots.map((s) => s.image).filter(Boolean);
    const uniqueUrls = new Set(imageUrls);

    // Each spot must have its own distinct, real photo
    expect(uniqueUrls.size).toBe(imageUrls.length);
  });

  test('RED-REAL-PHOTO-03: AccordionTripWizardModal renders real image URI for spot cards without overriding with generic fallback', () => {
    const realPhotoUri = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4a/Cau_Rong.jpg/330px-Cau_Rong.jpg';
    mockApiPlaces = [
      {
        id: 'real-spot-01',
        name: 'Địa Điểm Thực Tế Cầu Rồng',
        category: 'landmark',
        rating: 4.9,
        image: realPhotoUri,
        address: 'Đà Nẵng',
      },
    ];

    const { getByTestId } = render(
      <AccordionTripWizardModal
        visible={true}
        onClose={jest.fn()}
        onComplete={jest.fn()}
      />
    );

    // Navigate to Step 4 (Spots Grid)
    fireEvent.press(getByTestId('trending-destination-danang'));
    fireEvent.press(getByTestId('when-next-btn'));
    fireEvent.press(getByTestId('preferences-next-btn'));

    const realSpotCard = getByTestId('spot-card-real-spot-01');
    expect(realSpotCard).toBeTruthy();

    const imageElement = realSpotCard.findByType('Image');
    expect(imageElement.props.source).toEqual({ uri: realPhotoUri });
  });
});
