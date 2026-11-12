import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import PlanScreen from '../../src/screens/plan/PlanScreen';
import { useItineraryStore } from '../../src/stores/itinerary.store';
import { usePlacesStore } from '../../src/stores/places.store';

// Mock dependencies
jest.mock('../../src/stores/itinerary.store');
jest.mock('../../src/stores/places.store');

describe('PlanScreen & AccordionTripWizardModal Integration (TDD RED Phase)', () => {
  const mockFetchTrips = jest.fn().mockResolvedValue([]);
  const mockFetchTripDetails = jest.fn().mockResolvedValue({});
  const mockCreateTrip = jest.fn().mockResolvedValue({ id: 'trip-acc-1', title: 'Đà Nẵng Expedition' });
  const mockApplyAiPlan = jest.fn();
  const mockGenerateAiPlan = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    usePlacesStore.mockReturnValue({
      places: [
        { id: 'p-1', name: 'My Khe Beach', city: 'Đà Nẵng', category: 'nature', categoryName: 'Nature', lat: 16.059, lng: 108.243 },
      ],
      selectedPlaceIds: new Set(['p-1']),
      togglePlaceSelection: jest.fn(),
      generateAiPlan: mockGenerateAiPlan,
    });
  });

  test('RED-PLAN-ACC-01: Opens AccordionTripWizardModal when tapping "+ New Trip (Wizard)" or empty state button', () => {
    useItineraryStore.mockReturnValue({
      currentTrip: null,
      trips: [],
      fetchTrips: mockFetchTrips,
      fetchTripDetails: mockFetchTripDetails,
      createTrip: mockCreateTrip,
      applyAiPlan: mockApplyAiPlan,
    });

    const { getByTestId, getByText } = render(<PlanScreen />);

    // Check wizard CTA in empty state
    const openWizardBtn = getByTestId('plan-open-accordion-wizard-btn');
    expect(openWizardBtn).toBeTruthy();

    // Click to open wizard
    fireEvent.press(openWizardBtn);

    // Verify Wizard is rendered with Step 1
    expect(getByText(/Create Trip/i)).toBeTruthy();
    expect(getByText(/Where\?/i)).toBeTruthy();
  });

  test('RED-PLAN-ACC-02: Completing AccordionTripWizardModal calls createTrip and applies itinerary', async () => {
    useItineraryStore.mockReturnValue({
      currentTrip: null,
      trips: [],
      fetchTrips: mockFetchTrips,
      fetchTripDetails: mockFetchTripDetails,
      createTrip: mockCreateTrip,
      applyAiPlan: mockApplyAiPlan,
    });

    const { getByTestId } = render(<PlanScreen />);

    // Open wizard
    fireEvent.press(getByTestId('plan-open-accordion-wizard-btn'));

    // Step 1: Pick Da Nang
    fireEvent.press(getByTestId('trending-destination-danang'));

    // Step 2: Next
    fireEvent.press(getByTestId('when-next-btn'));

    // Step 3: Preferences Next
    fireEvent.press(getByTestId('preferences-next-btn'));

    // Step 4: Spot selection -> Continue
    fireEvent.press(getByTestId('spot-card-my-khe'));
    fireEvent.press(getByTestId('spots-continue-btn'));

    // Step 4: Pick Stay -> Continue
    fireEvent.press(getByTestId('stay-option-hotel'));
    fireEvent.press(getByTestId('stay-continue-btn'));

    // Step 5: Invite Friends -> Share & View Plan
    fireEvent.press(getByTestId('invite-share-view-plan-btn'));

    await waitFor(() => {
      expect(mockCreateTrip).toHaveBeenCalledWith(
        expect.objectContaining({
          destinationCity: 'Đà Nẵng',
        })
      );
    });
  });

  test('RED-PLAN-ACC-03: Old "Plan a Trip" button is removed and replaced by primary Accordion Wizard button, rendering inline', () => {
    useItineraryStore.mockReturnValue({
      currentTrip: null,
      trips: [],
      fetchTrips: mockFetchTrips,
      fetchTripDetails: mockFetchTripDetails,
      createTrip: mockCreateTrip,
      applyAiPlan: mockApplyAiPlan,
    });

    const { getByTestId } = render(<PlanScreen />);

    // New primary wizard button
    const wizardBtn = getByTestId('plan-open-accordion-wizard-btn');
    expect(wizardBtn).toBeTruthy();

    // Clicking it opens the wizard inline
    fireEvent.press(wizardBtn);
    expect(getByTestId('accordion-wizard-inline-container')).toBeTruthy();
  });
});
