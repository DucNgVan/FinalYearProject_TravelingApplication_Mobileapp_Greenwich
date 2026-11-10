import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AccordionTripWizardModal from '../../src/components/plan/AccordionTripWizardModal';
import { usePlacesStore } from '../../src/stores/places.store';

jest.mock('../../src/stores/places.store');

describe('AccordionTripWizardModal OpenTripMap API Integration (TDD RED Phase)', () => {
  const mockOnClose = jest.fn();
  const mockOnComplete = jest.fn();
  const mockFetchPlaces = jest.fn();

  const mockApiPlaces = [
    {
      id: 'otm-dragon-bridge',
      name: 'Dragon Bridge (Cầu Rồng)',
      category: 'landmark',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=600&q=80',
      address: 'Cầu Rồng, Hải Châu, Đà Nẵng',
      description: 'The Dragon Bridge is an iconic bridge over the River Hàn.',
      suggestedDuration: 1.5,
      lat: 16.061,
      lng: 108.227,
    },
    {
      id: 'otm-cham-museum',
      name: 'Museum of Cham Sculpture',
      category: 'cultural',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=600&q=80',
      address: 'Số 2 đường 2 Tháng 9, Hải Châu, Đà Nẵng',
      description: 'World largest collection of Cham stone sculpture.',
      suggestedDuration: 1.5,
      lat: 16.06,
      lng: 108.223,
    },
    {
      id: 'otm-trung-vuong',
      name: 'Trưng Vương Theatre',
      category: 'cultural',
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=600&q=80',
      address: '84 Hùng Vương, Hải Châu, Đà Nẵng',
      description: 'Historic performance theatre in central Da Nang.',
      suggestedDuration: 2.0,
      lat: 16.068,
      lng: 108.22,
    },
    {
      id: 'otm-marble-mountains',
      name: 'Marble Mountains (Ngũ Hành Sơn)',
      category: 'nature',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80',
      address: 'Hòa Hải, Ngũ Hành Sơn, Đà Nẵng',
      description: 'Cluster of 5 limestone hills with caves and Buddhist shrines.',
      suggestedDuration: 3.0,
      lat: 16.004,
      lng: 108.263,
    },
    {
      id: 'otm-linh-ung-pagoda',
      name: 'Linh Ung Pagoda (Chùa Linh Ứng Sơn Trà)',
      category: 'religion',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=600&q=80',
      address: 'Bán đảo Sơn Trà, Thọ Quang, Đà Nẵng',
      description: 'Famous 67-meter Lady Buddha overlooking Da Nang bay.',
      suggestedDuration: 2.0,
      lat: 16.102,
      lng: 108.277,
    },
    {
      id: 'otm-thuan-phuoc',
      name: 'Thuận Phước Bridge',
      category: 'architecture',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=600&q=80',
      address: 'Hải Châu - Sơn Trà, Đà Nẵng',
      description: 'Longest suspension bridge in Vietnam.',
      suggestedDuration: 1.0,
      lat: 16.092,
      lng: 108.222,
    },
    {
      id: 'otm-con-market',
      name: 'Chợ Cồn (Con Market Food Haven)',
      category: 'food',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80',
      address: 'Góc Hùng Vương - Ông Ích Khiêm, Hải Châu, Đà Nẵng',
      description: 'Premier food court market with hundreds of street delicacies.',
      suggestedDuration: 1.5,
      lat: 16.068,
      lng: 108.214,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    mockFetchPlaces.mockResolvedValue(mockApiPlaces);

    usePlacesStore.mockReturnValue({
      places: mockApiPlaces,
      isLoading: false,
      error: null,
      fetchPlaces: mockFetchPlaces,
    });
  });

  const navigateToStep4Spots = (utils) => {
    // 1. Where -> Pick Da Nang
    fireEvent.press(utils.getByTestId('trending-destination-danang'));
    // 2. When -> Next
    fireEvent.press(utils.getByTestId('when-next-btn'));
    // 3. Preferences -> Next
    fireEvent.press(utils.getByTestId('preferences-next-btn'));
  };

  test('RED-WIZ-SPOTS-API-01: Automatically triggers fetchPlaces from API on mount/destination selection', async () => {
    const utils = render(
      <AccordionTripWizardModal
        visible={true}
        onClose={mockOnClose}
        onComplete={mockOnComplete}
      />
    );

    // Click Đà Nẵng
    fireEvent.press(utils.getByTestId('trending-destination-danang'));

    await waitFor(() => {
      expect(mockFetchPlaces).toHaveBeenCalledWith('Đà Nẵng');
    });
  });

  test('RED-WIZ-SPOTS-API-02: Renders rich list of spots loaded from API into Step 4', async () => {
    const utils = render(
      <AccordionTripWizardModal
        visible={true}
        onClose={mockOnClose}
        onComplete={mockOnComplete}
      />
    );

    navigateToStep4Spots(utils);

    // Expand categories if collapsed to reveal all spots loaded from API
    const seeAllBeaches = utils.queryByTestId('category-see-all-beaches');
    if (seeAllBeaches) fireEvent.press(seeAllBeaches);
    const seeAllLandmarks = utils.queryByTestId('category-see-all-landmarks');
    if (seeAllLandmarks) fireEvent.press(seeAllLandmarks);
    const seeAllDining = utils.queryByTestId('category-see-all-dining');
    if (seeAllDining) fireEvent.press(seeAllDining);

    // Step 4 should display places from API
    await waitFor(() => {
      expect(utils.getByTestId('spot-card-otm-marble-mountains')).toBeTruthy();
      expect(utils.getByTestId('spot-card-otm-trung-vuong')).toBeTruthy();
      expect(utils.getByTestId('spot-card-otm-con-market')).toBeTruthy();
    });
  });

  test('RED-WIZ-SPOTS-API-03: API place cards support [ℹ️ Details] modal with full Wikipedia data', async () => {
    const utils = render(
      <AccordionTripWizardModal
        visible={true}
        onClose={mockOnClose}
        onComplete={mockOnComplete}
      />
    );

    navigateToStep4Spots(utils);

    // Expand category to reveal Marble Mountains details button
    const seeAllBeaches = utils.queryByTestId('category-see-all-beaches');
    if (seeAllBeaches) fireEvent.press(seeAllBeaches);

    // Click Details on Marble Mountains
    const detailsBtn = utils.getByTestId('spot-details-btn-otm-marble-mountains');
    expect(detailsBtn).toBeTruthy();
    fireEvent.press(detailsBtn);

    // Spot detail modal opens
    expect(utils.getByTestId('spot-detail-modal')).toBeTruthy();
    expect(utils.getByTestId('spot-detail-description')).toBeTruthy();
    expect(utils.getByText(/Cluster of 5 limestone hills/i)).toBeTruthy();
  });
});
