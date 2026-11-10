import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import AccordionTripWizardModal from '../../src/components/plan/AccordionTripWizardModal';

describe('AccordionTripWizardModal Component (TDD RED Phase - IMG_7823 to 7828)', () => {
  const mockOnClose = jest.fn();
  const mockOnComplete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('RED-WIZ-ACC-01: Renders Step 1 "Where?" with destination search, Saved, Trending destinations and collapsed pills', () => {
    const { getByTestId, getByText, getAllByText, getByPlaceholderText } = render(
      <AccordionTripWizardModal
        visible={true}
        onClose={mockOnClose}
        onComplete={mockOnComplete}
      />
    );

    // Header & Step 1 title
    expect(getByText(/Create Trip/i)).toBeTruthy();
    expect(getByText(/Where\?/i)).toBeTruthy();

    // Destination search input
    expect(getByPlaceholderText(/Search for a destination/i)).toBeTruthy();

    // Saved & Trending destinations
    expect(getByText(/Saved/i)).toBeTruthy();
    expect(getAllByText(/Việt Nam/i).length).toBeGreaterThanOrEqual(1);
    expect(getByText(/Trending/i)).toBeTruthy();
    expect(getByText(/Đà Nẵng/i)).toBeTruthy();
    expect(getByText(/Tokyo/i)).toBeTruthy();

    // Collapsed pills
    expect(getByText(/When/i)).toBeTruthy();
    expect(getByText(/Add dates/i)).toBeTruthy();
    expect(getByText(/Preferences/i)).toBeTruthy();
    expect(getByText(/Add interests/i)).toBeTruthy();
  });

  test('RED-WIZ-ACC-02: Selecting destination advances to Step 2 "When?" and adjusts duration', () => {
    const { getByTestId, getByText } = render(
      <AccordionTripWizardModal
        visible={true}
        onClose={mockOnClose}
        onComplete={mockOnComplete}
      />
    );

    // Click Đà Nẵng
    const daNangOption = getByTestId('trending-destination-danang');
    fireEvent.press(daNangOption);

    // Should now be on Step 2 "When?"
    expect(getByText(/When\?/i)).toBeTruthy();
    expect(getByTestId('when-toggle-flexible')).toBeTruthy();
    expect(getByTestId('when-toggle-specific')).toBeTruthy();

    // Days counter/stepper
    expect(getByTestId('when-days-display')).toBeTruthy();
    const nextBtn = getByTestId('when-next-btn');
    expect(nextBtn).toBeTruthy();
  });

  test('RED-WIZ-ACC-03: Advances to Step 3 (IMG_7828) with spot categories, square cards and interactive selection', () => {
    const { getByTestId, getByText } = render(
      <AccordionTripWizardModal
        visible={true}
        onClose={mockOnClose}
        onComplete={mockOnComplete}
      />
    );

    // Pick destination -> Step 2
    fireEvent.press(getByTestId('trending-destination-danang'));

    // Press When Next -> Step 3 (Preferences)
    fireEvent.press(getByTestId('when-next-btn'));

    // Press Preferences Next -> Step 4 (Spots Grid - IMG_7828)
    fireEvent.press(getByTestId('preferences-next-btn'));

    // Toolbar
    expect(getByTestId('spots-mode-grid')).toBeTruthy();
    expect(getByTestId('spots-mode-map')).toBeTruthy();

    // Category stacks & Spot cards
    expect(getByText(/Beaches & Nature/i)).toBeTruthy();
    expect(getByText(/My Khe Beach/i)).toBeTruthy();
    expect(getByText(/Dragon Bridge/i)).toBeTruthy();

    // Select/Deselect spot card
    const spotCard1 = getByTestId('spot-card-my-khe');
    fireEvent.press(spotCard1);

    // Continue button shows selected count
    expect(getByTestId('spots-continue-btn')).toBeTruthy();
  });

  test('RED-WIZ-ACC-04: Toggles between Grid View and Map View in Step 3', () => {
    const { getByTestId } = render(
      <AccordionTripWizardModal
        visible={true}
        onClose={mockOnClose}
        onComplete={mockOnComplete}
      />
    );

    // Navigate to Step 3
    fireEvent.press(getByTestId('trending-destination-danang'));
    fireEvent.press(getByTestId('when-next-btn'));
    fireEvent.press(getByTestId('preferences-next-btn'));

    // Toggle to map view
    const mapToggleBtn = getByTestId('spots-mode-map');
    fireEvent.press(mapToggleBtn);

    expect(getByTestId('spots-map-canvas')).toBeTruthy();

    // Toggle back to grid view
    const gridToggleBtn = getByTestId('spots-mode-grid');
    fireEvent.press(gridToggleBtn);

    expect(getByTestId('spots-grid-container')).toBeTruthy();
  });

  test('RED-WIZ-ACC-05: Completes Stay choice (IMG_7825/7826), Boarding Pass Invite (IMG_7827) and calls onComplete', () => {
    const { getByTestId, queryByTestId, getByText } = render(
      <AccordionTripWizardModal
        visible={true}
        onClose={mockOnClose}
        onComplete={mockOnComplete}
      />
    );

    // 1. Where -> Pick Da Nang
    fireEvent.press(getByTestId('trending-destination-danang'));
    // 2. When -> Press Next
    fireEvent.press(getByTestId('when-next-btn'));
    // 3. Preferences -> Press Next
    fireEvent.press(getByTestId('preferences-next-btn'));
    // 4. Spots -> Pick spots & press continue
    fireEvent.press(getByTestId('spot-card-my-khe'));
    fireEvent.press(getByTestId('spots-continue-btn'));

    // 4. Stay choice view (IMG_7825)
    expect(getByText(/Where are you staying\?/i)).toBeTruthy();
    expect(getByTestId('stay-option-hotel')).toBeTruthy();
    expect(getByTestId('stay-option-airbnb')).toBeTruthy();
    expect(getByTestId('stay-option-friends')).toBeTruthy();
    expect(getByTestId('stay-option-skip')).toBeTruthy();

    // Pick hotel
    fireEvent.press(getByTestId('stay-option-hotel'));
    // Confirmed hotel card should be completely removed
    expect(queryByTestId('hotel-confirmed-card')).toBeNull();
    fireEvent.press(getByTestId('stay-continue-btn'));

    // 5. Invite Friends Boarding Pass (IMG_7827)
    expect(getByText(/Invite Friends/i)).toBeTruthy();
    expect(getByTestId('invite-ticket-card')).toBeTruthy();
    expect(getByTestId('invite-role-selector')).toBeTruthy();

    // Submit / Share and view plan
    fireEvent.press(getByTestId('invite-share-view-plan-btn'));

    expect(mockOnComplete).toHaveBeenCalledWith(
      expect.objectContaining({
        destination: expect.any(String),
        daysCount: expect.any(Number),
        selectedSpots: expect.any(Array),
      })
    );
  });

  test('RED-WIZ-ACC-06: Expands Preferences card right after When with interest chips selection', () => {
    const { getByTestId, getByText } = render(
      <AccordionTripWizardModal
        visible={true}
        onClose={mockOnClose}
        onComplete={mockOnComplete}
      />
    );

    // Pick destination -> Step 2 "When"
    fireEvent.press(getByTestId('trending-destination-danang'));
    expect(getByText(/When\?/i)).toBeTruthy();

    // Below When, collapsed Preferences pill is displayed
    const prefPill = getByTestId('accordion-pill-preferences');
    expect(prefPill).toBeTruthy();

    // Advance to Preferences (pressing when-next-btn)
    fireEvent.press(getByTestId('when-next-btn'));

    // Preferences step should now be expanded
    expect(getByText(/Preferences/i)).toBeTruthy();
    expect(getByText(/What are your interests\?/i)).toBeTruthy();

    // Select interest chips
    const chipBeaches = getByTestId('pref-chip-beaches');
    const chipFood = getByTestId('pref-chip-food');
    expect(chipBeaches).toBeTruthy();
    expect(chipFood).toBeTruthy();
    fireEvent.press(chipBeaches);

    // Continue to Spots
    const prefNextBtn = getByTestId('preferences-next-btn');
    expect(prefNextBtn).toBeTruthy();
    fireEvent.press(prefNextBtn);

    // Now in Spots Step
    expect(getByTestId('spots-continue-btn')).toBeTruthy();
  });

  test('RED-WIZ-ACC-07: Supports inline={true} rendering without full-screen Modal overlay', () => {
    const { getByTestId } = render(
      <AccordionTripWizardModal
        visible={true}
        inline={true}
        onClose={mockOnClose}
        onComplete={mockOnComplete}
      />
    );

    // Should render container with inline testID
    const inlineContainer = getByTestId('accordion-wizard-inline-container');
    expect(inlineContainer).toBeTruthy();
  });
});
