import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import AccordionTripWizardModal from '../../src/components/plan/AccordionTripWizardModal';
import PlanScreen from '../../src/screens/plan/PlanScreen';
import { useItineraryStore } from '../../src/stores/itinerary.store';
import { useExpenseStore } from '../../src/stores/expense.store';
import { useThemeStore } from '../../src/stores/theme.store';
import { CITY_COVERS } from '../../src/components/plan/TripCardHero';

jest.mock('../../src/stores/itinerary.store');
jest.mock('../../src/stores/expense.store');
jest.mock('../../src/stores/theme.store');

describe('TDD RED Phase: Spot Detail Gallery, Hotel Deduplication & Hero Card Fill', () => {
  const mockOnClose = jest.fn();
  const mockOnComplete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useThemeStore.mockReturnValue({
      mode: 'light',
      colors: {
        background: '#F8FAFC',
        card: '#FFFFFF',
        text: '#0F172A',
        textMuted: '#64748B',
        border: '#E2E8F0',
        primary: '#0F172A',
      },
    });

    useItineraryStore.mockReturnValue({
      currentTrip: null,
      trips: [],
      isLoading: false,
      error: null,
      fetchTripDetails: jest.fn(),
      inviteCompanion: jest.fn(),
    });

    useExpenseStore.mockReturnValue({
      expenses: [],
      debtSummary: null,
      isLoading: false,
      error: null,
      fetchTripExpenses: jest.fn(),
      fetchDebtSummary: jest.fn(),
      settleDebt: jest.fn(),
    });
  });

  const navigateToStep5Stay = (utils) => {
    // 1. Where -> Pick Da Nang
    fireEvent.press(utils.getByTestId('trending-destination-danang'));
    // 2. When -> Next
    fireEvent.press(utils.getByTestId('when-next-btn'));
    // 3. Preferences -> Next
    fireEvent.press(utils.getByTestId('preferences-next-btn'));
    // 4. Spots -> Continue to Stay
    fireEvent.press(utils.getByTestId('spots-continue-btn'));
  };

  test('RED-HOTEL-DEDUP-01: Assigned hotel in Step 5 does not duplicate inside the suggestions list', () => {
    const utils = render(
      <AccordionTripWizardModal
        visible={true}
        onClose={mockOnClose}
        onComplete={mockOnComplete}
      />
    );

    navigateToStep5Stay(utils);

    // Hotel option is selected by default
    expect(utils.getByTestId('stay-option-hotel')).toBeTruthy();

    // Assigned hotel card is rendered
    const assignedCard = utils.queryByTestId('assigned-hotel-card');
    expect(assignedCard).toBeTruthy();

    // Check hotel suggestions container
    const suggestionsContainer = utils.getByTestId('hotel-search-suggestions');
    expect(suggestionsContainer).toBeTruthy();

    // The assigned hotel name must NOT appear inside the suggestions container
    // Currently, "Novotel Danang Premier Han River" (or assigned hotel) is rendered twice
    const assignedCardTexts = utils
      .getByTestId('assigned-hotel-card')
      .findAllByType('Text')
      .map((t) => t.props.children);
    const assignedName = assignedCardTexts.find(
      (txt) => typeof txt === 'string' && (txt.includes('Novotel') || txt.includes('Hotel') || txt.includes('Ritz'))
    );
    expect(assignedName).toBeTruthy();

    // Inside suggestionsContainer, there should NOT be any hotel row with the same name
    const suggestionTexts = suggestionsContainer.findAllByType('Text').map((t) => t.props.children);
    expect(suggestionTexts).not.toContain(assignedName);
  });

  test('RED-HERO-FILL-02: Da Lat hero card renders dedicated Da Lat cover image and fills entire frame without padding gap', () => {
    const mockDaLatTrip = {
      id: 'trip-dalat-1',
      title: 'Đà Lạt Expedition',
      destination: 'Đà Lạt',
      destinationCity: 'Đà Lạt',
      country: 'Việt Nam',
      daysCount: 3,
      status: 'Ready',
      totalDistanceKm: 15.2,
      days: [
        {
          dayIndex: 1,
          dayNumber: 1,
          distanceKm: 5.0,
          items: [],
        },
      ],
      collaborators: [],
    };

    useItineraryStore.mockReturnValue({
      currentTrip: mockDaLatTrip,
      isLoading: false,
      error: null,
      fetchTripDetails: jest.fn(),
      inviteCompanion: jest.fn(),
    });

    const utils = render(<PlanScreen />);

    const heroCard = utils.getByTestId('itinerary-hero-card');
    expect(heroCard).toBeTruthy();

    // CITY_COVERS must define dalat
    expect(CITY_COVERS.dalat).toBeDefined();

    // Image source must be the authentic Da Lat cover image (not default camera photo)
    const imageElement = heroCard.findByType('Image');
    expect(imageElement.props.source.uri).toContain('photo-1596394516093-501ba68a0ba6');

    // heroCardContainer must not apply padding directly that constrains the image height
    const containerStyle = [heroCard.props.style].flat();
    const hasConstrainingPadding = containerStyle.some((s) => s && s.padding && s.padding > 0);
    expect(hasConstrainingPadding).toBe(false);
  });

  test('RED-SPOT-GALLERY-03: Spot detail modal displays 3-4 images with gallery pagination and thumbnail selector', () => {
    const utils = render(
      <AccordionTripWizardModal
        visible={true}
        onClose={mockOnClose}
        onComplete={mockOnComplete}
      />
    );

    // 1. Where -> Pick Da Nang
    fireEvent.press(utils.getByTestId('trending-destination-danang'));
    // 2. When -> Next
    fireEvent.press(utils.getByTestId('when-next-btn'));
    // 3. Preferences -> Next
    fireEvent.press(utils.getByTestId('preferences-next-btn'));

    // Open Dragon Bridge details
    const detailsBtn = utils.getByTestId('spot-details-btn-spot-dragon-bridge');
    expect(detailsBtn).toBeTruthy();
    fireEvent.press(detailsBtn);

    // Modal is opened
    expect(utils.getByTestId('spot-detail-modal')).toBeTruthy();

    // Should have gallery photo counter (e.g. 1/4)
    const photoCounter = utils.getByTestId('spot-detail-photo-counter');
    expect(photoCounter).toBeTruthy();

    // Should have at least 3 distinct gallery photos
    expect(utils.getByTestId('spot-detail-gallery-image-0')).toBeTruthy();
    expect(utils.getByTestId('spot-detail-gallery-image-1')).toBeTruthy();
    expect(utils.getByTestId('spot-detail-gallery-image-2')).toBeTruthy();

    // Should have thumbnail strip with at least 3 thumbnails
    expect(utils.getByTestId('spot-detail-thumb-0')).toBeTruthy();
    expect(utils.getByTestId('spot-detail-thumb-1')).toBeTruthy();
    expect(utils.getByTestId('spot-detail-thumb-2')).toBeTruthy();
  });
});
