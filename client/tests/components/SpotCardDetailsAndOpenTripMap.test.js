import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import AccordionTripWizardModal from '../../src/components/plan/AccordionTripWizardModal';

describe('Spot Card Details Modal & OpenTripMap Data Integration (TDD RED Phase)', () => {
  const mockOnClose = jest.fn();
  const mockOnComplete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const navigateToStep4Spots = (utils) => {
    // 1. Where -> Pick Da Nang
    fireEvent.press(utils.getByTestId('trending-destination-danang'));
    // 2. When -> Next
    fireEvent.press(utils.getByTestId('when-next-btn'));
    // 3. Preferences -> Next
    fireEvent.press(utils.getByTestId('preferences-next-btn'));
  };

  test('RED-SPOT-01: Spots for Da Nang include real OpenTripMap attractions (Dragon Bridge, Lady Buddha, Museum of Cham Sculpture)', () => {
    const utils = render(
      <AccordionTripWizardModal
        visible={true}
        onClose={mockOnClose}
        onComplete={mockOnComplete}
      />
    );

    navigateToStep4Spots(utils);

    // Verify presence of top OpenTripMap attractions
    expect(utils.getByTestId('spot-card-dragon-bridge')).toBeTruthy();
    expect(utils.getByText(/Dragon Bridge/i)).toBeTruthy();

    expect(utils.getByTestId('spot-card-son-tra')).toBeTruthy();
    expect(utils.getByText(/Son Tra/i)).toBeTruthy();

    expect(utils.getByTestId('spot-card-cham-museum')).toBeTruthy();
    expect(utils.getByText(/Museum of Cham Sculpture/i)).toBeTruthy();
  });

  test('RED-SPOT-02: Clicking [ℹ️ Details] opens Spot Detail Modal with Wikipedia description, address, and rating', () => {
    const utils = render(
      <AccordionTripWizardModal
        visible={true}
        onClose={mockOnClose}
        onComplete={mockOnComplete}
      />
    );

    navigateToStep4Spots(utils);

    // Click details button on Dragon Bridge card
    const detailsBtn = utils.getByTestId('spot-details-btn-spot-dragon-bridge');
    expect(detailsBtn).toBeTruthy();
    fireEvent.press(detailsBtn);

    // Detail modal should be visible
    expect(utils.getByTestId('spot-detail-modal')).toBeTruthy();
    expect(utils.getByTestId('spot-detail-name')).toBeTruthy();
    expect(utils.getAllByText(/Dragon Bridge/i).length).toBeGreaterThanOrEqual(2);

    // Verify Wikipedia summary and address
    expect(utils.getByTestId('spot-detail-description')).toBeTruthy();
    expect(utils.getByTestId('spot-detail-address')).toBeTruthy();
    expect(utils.getByTestId('spot-detail-rating')).toBeTruthy();
  });

  test('RED-SPOT-03: Long-pressing spot card triggers Spot Detail Modal', () => {
    const utils = render(
      <AccordionTripWizardModal
        visible={true}
        onClose={mockOnClose}
        onComplete={mockOnComplete}
      />
    );

    navigateToStep4Spots(utils);

    // Long press Cham Museum card
    const chamCard = utils.getByTestId('spot-card-cham-museum');
    fireEvent(chamCard, 'longPress');

    // Detail modal should open
    expect(utils.getByTestId('spot-detail-modal')).toBeTruthy();
    expect(utils.getAllByText(/Museum of Cham Sculpture/i).length).toBeGreaterThanOrEqual(2);
  });

  test('RED-SPOT-04: Can toggle spot selection from inside Detail Modal and close modal', () => {
    const utils = render(
      <AccordionTripWizardModal
        visible={true}
        onClose={mockOnClose}
        onComplete={mockOnComplete}
      />
    );

    navigateToStep4Spots(utils);

    // Open detail modal for Cham Museum (currently not selected by default)
    fireEvent.press(utils.getByTestId('spot-details-btn-spot-cham-museum'));

    const toggleBtn = utils.getByTestId('spot-detail-toggle-btn');
    expect(toggleBtn).toBeTruthy();

    // Select the spot
    fireEvent.press(toggleBtn);

    // Close the modal
    const closeBtn = utils.getByTestId('spot-detail-close-btn');
    fireEvent.press(closeBtn);

    // Modal is dismissed
    expect(utils.queryByTestId('spot-detail-modal')).toBeNull();

    // Spot card now shows active selection checkmark
    const chamCard = utils.getByTestId('spot-card-cham-museum');
    expect(chamCard).toBeTruthy();
  });
});
