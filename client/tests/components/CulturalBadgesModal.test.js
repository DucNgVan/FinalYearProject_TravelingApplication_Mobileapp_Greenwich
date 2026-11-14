import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CulturalBadgesModal from '../../src/components/gamification/CulturalBadgesModal';
import { useGamificationStore } from '../../src/stores/gamification.store';

describe('Frontend Test: CulturalBadgesModal & useGamificationStore (Module 5)', () => {
  beforeEach(() => {
    useGamificationStore.getState().resetGamification();
  });

  it('RED-FE-GAM-01: renders traveler level, XP progress bar and cultural badges', () => {
    const { getByTestId, getByText } = render(
      <CulturalBadgesModal visible={true} onClose={jest.fn()} />
    );

    expect(getByTestId('cultural-badges-modal')).toBeTruthy();
    expect(getByTestId('gamification-xp-bar')).toBeTruthy();
    expect(getByText(/Level \d/i)).toBeTruthy();
  });

  it('RED-FE-GAM-02: allows GPS check-in at landmark and triggers checkInLandmark', async () => {
    const checkInSpy = jest.fn();
    useGamificationStore.setState({ checkInLandmark: checkInSpy });

    const { getByTestId } = render(
      <CulturalBadgesModal visible={true} onClose={jest.fn()} />
    );

    const checkInBtn = getByTestId('btn-checkin-lm-danang-dragon');
    expect(checkInBtn).toBeTruthy();
    fireEvent.press(checkInBtn);

    expect(checkInSpy).toHaveBeenCalled();
  });
});
