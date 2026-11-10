import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import AccordionTripWizardModal from '../../src/components/plan/AccordionTripWizardModal';

describe('AccordionTripWizardModal - Step 5 Where are you staying (Image 2 Exact Match TDD RED)', () => {
  const mockOnClose = jest.fn();
  const mockOnComplete = jest.fn();

  const navigateToStayStep = () => {
    const utils = render(
      <AccordionTripWizardModal
        visible={true}
        onClose={mockOnClose}
        onComplete={mockOnComplete}
      />
    );

    // 1. Where -> Pick Da Nang
    fireEvent.press(utils.getByTestId('trending-destination-danang'));
    // 2. When -> Press Next
    fireEvent.press(utils.getByTestId('when-next-btn'));
    // 3. Preferences -> Press Next
    fireEvent.press(utils.getByTestId('preferences-next-btn'));
    // 4. Spots -> Pick spot & continue
    fireEvent.press(utils.getByTestId('spot-card-my-khe'));
    fireEvent.press(utils.getByTestId('spots-continue-btn'));

    return utils;
  };

  test('RED-STAY-01: Displays exact subtitle "Skip if you haven\'t decided yet"', () => {
    const { getByText, queryByText } = navigateToStayStep();

    expect(getByText(/Where are you staying\?/i)).toBeTruthy();
    expect(getByText(/Skip if you haven't decided yet/i)).toBeTruthy();
    expect(queryByText(/Add your accommodation to connect routes/i)).toBeNull();
  });

  test('RED-STAY-02: Renders Hotel, Airbnb, and Staying with Friends horizontal cards', () => {
    const { getByTestId, getByText } = navigateToStayStep();

    expect(getByTestId('stay-option-hotel')).toBeTruthy();
    expect(getByTestId('stay-option-airbnb')).toBeTruthy();
    expect(getByTestId('stay-option-friends')).toBeTruthy();

    expect(getByText('Hotel')).toBeTruthy();
    expect(getByText('Airbnb / Rental')).toBeTruthy();
    expect(getByText('Staying with Friends')).toBeTruthy();
  });

  test('RED-STAY-03: Renders the "OR" divider separating booked options from skip option', () => {
    const { getByTestId, getByText } = navigateToStayStep();

    expect(getByTestId('stay-or-divider')).toBeTruthy();
    expect(getByText('OR')).toBeTruthy();
  });

  test('RED-STAY-04: Renders "Skip for now" card with subtitle "Not booked yet"', () => {
    const { getByTestId, getByText } = navigateToStayStep();

    expect(getByTestId('stay-option-skip')).toBeTruthy();
    expect(getByText('Skip for now')).toBeTruthy();
    expect(getByText(/Not booked yet/i)).toBeTruthy();
  });

  test('RED-STAY-05: Applies emerald/green outline when an accommodation option is selected', () => {
    const { getByTestId } = navigateToStayStep();

    const hotelOption = getByTestId('stay-option-hotel');
    fireEvent.press(hotelOption);

    // Active state should have green outline (#2E7D5B or #15803D)
    const flattenedStyle = Array.isArray(hotelOption.props.style)
      ? Object.assign({}, ...hotelOption.props.style.filter(Boolean))
      : hotelOption.props.style;

    expect(flattenedStyle.borderColor).toMatch(/#(2E7D5B|15803D)/i);
  });
});
