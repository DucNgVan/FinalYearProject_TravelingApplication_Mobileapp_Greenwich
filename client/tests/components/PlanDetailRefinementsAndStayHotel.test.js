import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AccordionTripWizardModal from '../../src/components/plan/AccordionTripWizardModal';
import PlanScreen from '../../src/screens/plan/PlanScreen';
import { useItineraryStore } from '../../src/stores/itinerary.store';
import { usePlacesStore } from '../../src/stores/places.store';
import { useExpenseStore } from '../../src/stores/expense.store';

describe('Plan Detail Refinements & Stay Hotel Search (TDD RED Phase)', () => {
  const mockTripWithStops = {
    id: 'trip-tokyo-1',
    title: 'Tokyo Squad Adventure',
    destinationCity: 'Tokyo',
    destination: 'Tokyo, Japan',
    startDate: '2026-11-20',
    endDate: '2026-11-24',
    budget: 8000000,
    collaborators: [
      { userId: 'u1', name: 'Duc (You)', role: 'OWNER' },
      { userId: 'u2', name: 'Alex', role: 'EDITOR' },
    ],
    days: [
      {
        dayIndex: 1,
        date: '2026-11-20',
        items: [
          {
            id: 'stop-1',
            name: 'Shinjuku Prince Hotel',
            categoryName: 'Basecamp',
            isBasecamp: true,
            lat: 35.6945,
            lng: 139.7005,
          },
        ],
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();

    useItineraryStore.setState({
      trips: [mockTripWithStops],
      currentTrip: mockTripWithStops,
      isLoading: false,
      error: null,
      fetchTrips: jest.fn().mockResolvedValue([mockTripWithStops]),
      fetchTripDetails: jest.fn().mockResolvedValue(mockTripWithStops),
      createTrip: jest.fn(),
      addStop: jest.fn(),
      reorderStops: jest.fn(),
      deleteTrip: jest.fn(),
      inviteCollaborator: jest.fn(),
      updateCollaboratorStatus: jest.fn(),
      applyAiPlan: jest.fn(),
      setCurrentTrip: jest.fn((trip) => {
        useItineraryStore.setState({ currentTrip: trip });
      }),
    });

    usePlacesStore.setState({
      places: [],
      selectedPlaceIds: new Set(),
      selectedCity: 'Tokyo',
      searchQuery: '',
      selectedCategory: 'all',
      isLoading: false,
      error: null,
      fetchPlaces: jest.fn(),
      togglePlaceSelection: jest.fn(),
      clearSelectedPlaces: jest.fn(),
      setCity: jest.fn(),
      setSearchQuery: jest.fn(),
      setCategory: jest.fn(),
      generateAiPlan: jest.fn().mockResolvedValue({ days: [] }),
    });

    useExpenseStore.setState({
      expenses: [],
      debtSummary: {
        totalExpense: 3000000,
        memberBalances: [],
        simplifiedSettlements: [],
      },
      addExpense: jest.fn(),
      settleDebt: jest.fn(),
    });
  });

  // TEST 1: Tokyo has multiple categories (Landmarks, Dining, Nature/Parks), each with 2 featured spots & See all
  test('RED-REF-01: Tokyo displays multiple categories with 2 featured spots each and See all expander', () => {
    const { getByTestId, queryByTestId, getByText } = render(
      <AccordionTripWizardModal
        visible={true}
        onClose={jest.fn()}
        onComplete={jest.fn()}
      />
    );

    // Pick Tokyo in Where step
    fireEvent.press(getByTestId('trending-destination-tokyo'));
    fireEvent.press(getByTestId('when-next-btn'));
    fireEvent.press(getByTestId('preferences-next-btn'));

    // Should display Landmarks category
    expect(getByText(/Landmarks & Culture/i)).toBeTruthy();

    // Should also display Dining & Street Food category for Tokyo
    expect(getByText(/Dining & Street Food/i)).toBeTruthy();

    // Should also display Parks & Nature or Modern category
    expect(getByText(/Parks & Nature/i)).toBeTruthy();

    // Verify See all button exists for Tokyo Dining
    expect(getByTestId('category-see-all-dining')).toBeTruthy();
  });

  // TEST 2: spotCard uses percentage width (48.5%) for 2-column layout to prevent single-column bug
  test('RED-REF-02: spotCard styles use responsive 48.5% width to prevent stacking on wide viewports', () => {
    const { getByTestId } = render(
      <AccordionTripWizardModal
        visible={true}
        onClose={jest.fn()}
        onComplete={jest.fn()}
      />
    );

    fireEvent.press(getByTestId('trending-destination-tokyo'));
    fireEvent.press(getByTestId('when-next-btn'));
    fireEvent.press(getByTestId('preferences-next-btn'));

    const spotCard = getByTestId('spot-card-senso-ji');
    expect(spotCard).toBeTruthy();
    // Width should be percentage (48.5% or 48%) so cards never wrap onto single row on desktop/tablet/web
    const cardStyle = Array.isArray(spotCard.props.style)
      ? Object.assign({}, ...spotCard.props.style)
      : spotCard.props.style;
    expect(cardStyle.width).toBe('48.5%');
  });

  // TEST 3: Stay option icon containers have subtle opacity, and Hotel provides search & assign input
  test('RED-REF-03: Stay step has subdued icon opacity and allows searching and assigning hotel', () => {
    const { getByTestId, getByText, getByPlaceholderText } = render(
      <AccordionTripWizardModal
        visible={true}
        onClose={jest.fn()}
        onComplete={jest.fn()}
      />
    );

    // Navigate to Step 5 (Stay)
    fireEvent.press(getByTestId('trending-destination-tokyo'));
    fireEvent.press(getByTestId('when-next-btn'));
    fireEvent.press(getByTestId('preferences-next-btn'));
    fireEvent.press(getByTestId('spots-continue-btn'));

    // Verify Hotel option is present and click it
    const hotelOption = getByTestId('stay-option-hotel');
    expect(hotelOption).toBeTruthy();
    fireEvent.press(hotelOption);

    // Hotel search input should appear to let user search and assign hotel
    const hotelSearchInput = getByTestId('hotel-search-input');
    expect(hotelSearchInput).toBeTruthy();

    // Enter hotel name
    fireEvent.changeText(hotelSearchInput, 'Keio Plaza');

    // Click suggested hotel
    const hotelSuggestion = getByTestId('hotel-suggestion-0');
    expect(hotelSuggestion).toBeTruthy();
    fireEvent.press(hotelSuggestion);

    // Assigned hotel card should appear with confirmation
    expect(getByTestId('assigned-hotel-card')).toBeTruthy();
  });

  // TEST 4: Shared Packing Checklist has a single clean + Add Item trigger without duplicate + Add in placeholder
  test('RED-REF-04: Shared Packing Checklist provides single + Add Item trigger and clean non-duplicate input', () => {
    const { getByTestId, queryByTestId, getByText } = render(<PlanScreen />);

    // Switch to Itinerary tab
    fireEvent.press(getByTestId('plan-subtab-itinerary'));

    // Initially, form input should be collapsed, only single trigger button "+ Add Item" is visible
    const openFormBtn = getByTestId('packing-open-add-form-btn');
    expect(openFormBtn).toBeTruthy();
    expect(queryByTestId('packing-input-title')).toBeNull();

    // Click trigger to open form
    fireEvent.press(openFormBtn);

    // Now input and assignee selector appear
    const titleInput = getByTestId('packing-input-title');
    expect(titleInput).toBeTruthy();

    // Placeholder must NOT contain "+ Add" (which causes duplicate "+ Add" UI)
    expect(titleInput.props.placeholder).not.toMatch(/\+ Add/i);

    // Cancel button should close the form
    const cancelBtn = getByTestId('packing-cancel-add-btn');
    expect(cancelBtn).toBeTruthy();
    fireEvent.press(cancelBtn);

    // Form is collapsed again
    expect(queryByTestId('packing-input-title')).toBeNull();
  });
});
