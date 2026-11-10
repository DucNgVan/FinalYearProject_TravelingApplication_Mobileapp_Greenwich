import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import AccordionTripWizardModal from '../../src/components/plan/AccordionTripWizardModal';
import { useThemeStore } from '../../src/stores/theme.store';
import { usePlacesStore } from '../../src/stores/places.store';

jest.mock('../../src/stores/theme.store');
jest.mock('../../src/stores/places.store');

describe('TDD RED Phase: Spot Card Details Button Positioned Below Card Image', () => {
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

    usePlacesStore.mockReturnValue({
      places: [],
      selectedPlaceIds: new Set(),
      isLoading: false,
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

  test('RED-SPOT-CARD-LAYOUT-01: Details button is positioned inside info area below the image, NOT overlaying the photo', () => {
    const utils = render(
      <AccordionTripWizardModal
        visible={true}
        onClose={mockOnClose}
        onComplete={mockOnComplete}
      />
    );

    navigateToStep4Spots(utils);

    const card = utils.getByTestId('spot-card-dragon-bridge');
    expect(card).toBeTruthy();

    const detailsBtn = utils.getByTestId('spot-details-btn-spot-dragon-bridge');
    expect(detailsBtn).toBeTruthy();

    // The image wrapper should be the first child container of the card
    const cardChildren = card.children;
    const imageWrap = cardChildren[0]; // spotImageWrap

    // The details button must NOT be inside the image wrapper (which used absolute top-left positioning)
    const btnInImageWrap = imageWrap.findAll(
      (node) => node.props && node.props.testID === 'spot-details-btn-spot-dragon-bridge'
    );
    expect(btnInImageWrap.length).toBe(0);

    // The details button MUST be located inside the second child container (spotCardInfo)
    const cardInfoWrap = cardChildren[1]; // spotCardInfo
    const btnInInfoWrap = cardInfoWrap.findAll(
      (node) => node.props && node.props.testID === 'spot-details-btn-spot-dragon-bridge'
    );
    expect(btnInInfoWrap.length).toBeGreaterThanOrEqual(1);
  });

  test('RED-SPOT-CARD-LAYOUT-02: Image wrapper contains only image and checkmark, leaving the photo completely clean', () => {
    const utils = render(
      <AccordionTripWizardModal
        visible={true}
        onClose={mockOnClose}
        onComplete={mockOnComplete}
      />
    );

    navigateToStep4Spots(utils);

    const card = utils.getByTestId('spot-card-dragon-bridge');
    const imageWrap = card.children[0];

    // The image wrapper must NOT contain any 'Details' text
    const textInImage = imageWrap.findAllByType('Text');
    const hasDetailsText = textInImage.some(
      (t) => typeof t.props.children === 'string' && t.props.children.includes('Details')
    );
    expect(hasDetailsText).toBe(false);
  });

  test('RED-SPOT-CARD-LAYOUT-03: Tapping details button at the bottom of the card opens spot details modal with gallery', () => {
    const utils = render(
      <AccordionTripWizardModal
        visible={true}
        onClose={mockOnClose}
        onComplete={mockOnComplete}
      />
    );

    navigateToStep4Spots(utils);

    const detailsBtn = utils.getByTestId('spot-details-btn-spot-dragon-bridge');
    fireEvent.press(detailsBtn);

    // Modal is opened
    expect(utils.getByTestId('spot-detail-modal')).toBeTruthy();
    expect(utils.getByTestId('spot-detail-photo-counter')).toBeTruthy();
  });
});
