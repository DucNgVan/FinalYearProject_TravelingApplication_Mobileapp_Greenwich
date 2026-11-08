import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import AccordionTripWizardModal from '../../src/components/plan/AccordionTripWizardModal';
import { useThemeStore } from '../../src/stores/theme.store';

jest.mock('../../src/stores/theme.store');

describe('TDD RED Phase: Palette Black/White/Gray Harmonization (Image 1 Rules)', () => {
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
  });

  test('RED-PAL-01: Wizard active elements use Solid Black (#0F172A) or White instead of green (#2E7D5B)', () => {
    const { getByTestId } = render(
      <AccordionTripWizardModal visible={true} inline={true} onClose={jest.fn()} onComplete={jest.fn()} />
    );

    // Step 1: Trending Card selection automatically advances to Step 2
    const daNangCard = getByTestId('trending-destination-danang');
    fireEvent.press(daNangCard);

    // On Step 2: When step
    const nextBtn = getByTestId('when-next-btn');

    // Button background should be dark #0F172A, not pine green #2E7D5B
    const nextBtnStyle = nextBtn.props.style;
    const flatNextStyle = Array.isArray(nextBtnStyle) ? Object.assign({}, ...nextBtnStyle) : nextBtnStyle;
    expect(flatNextStyle.backgroundColor).not.toBe('#2E7D5B');
    expect(flatNextStyle.backgroundColor).toBe('#0F172A');
  });

  test('RED-PAL-02: Segmented toggle uses Black (#0F172A) active capsule with White text per Image 1', () => {
    const { getByTestId } = render(
      <AccordionTripWizardModal visible={true} inline={true} onClose={jest.fn()} onComplete={jest.fn()} />
    );

    // Select Da Nang -> advances to Step 2: When
    fireEvent.press(getByTestId('trending-destination-danang'));

    // Check segmented control button (flexible)
    const flexibleBtn = getByTestId('when-toggle-flexible');
    const flatSegmentStyle = Array.isArray(flexibleBtn.props.style)
      ? Object.assign({}, ...flexibleBtn.props.style)
      : flexibleBtn.props.style;
    expect(flatSegmentStyle.backgroundColor).not.toBe('#2E7D5B');
    expect(flatSegmentStyle.backgroundColor).toBe('#0F172A');
  });

  test('RED-PAL-03: Interest tag when selected uses Solid Black (#0F172A) capsule with White text per Image 1', () => {
    const { getByTestId } = render(
      <AccordionTripWizardModal visible={true} inline={true} onClose={jest.fn()} onComplete={jest.fn()} />
    );

    // Step 1 -> Step 2 -> Step 3 (Preferences)
    fireEvent.press(getByTestId('trending-destination-danang'));
    fireEvent.press(getByTestId('when-next-btn'));

    const foodChip = getByTestId('pref-chip-food');
    fireEvent.press(foodChip);

    const flatChipStyle = Array.isArray(foodChip.props.style)
      ? Object.assign({}, ...foodChip.props.style)
      : foodChip.props.style;
    expect(flatChipStyle.backgroundColor).not.toBe('#2E7D5B');
    expect(flatChipStyle.backgroundColor).not.toBe('#ECFDF5');
    expect(flatChipStyle.backgroundColor).toBe('#0F172A');
  });
});
