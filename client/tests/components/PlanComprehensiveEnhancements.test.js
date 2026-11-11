import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AccordionTripWizardModal from '../../src/components/plan/AccordionTripWizardModal';
import PlanScreen from '../../src/screens/plan/PlanScreen';
import { useItineraryStore } from '../../src/stores/itinerary.store';
import { usePlacesStore } from '../../src/stores/places.store';
import { useExpenseStore } from '../../src/stores/expense.store';

describe('Plan Comprehensive Enhancements (TDD RED Phase)', () => {
  const mockTripWithStops = {
    id: 'trip-danang-1',
    title: 'Da Nang Squad Adventure',
    destinationCity: 'Da Nang',
    destination: 'Da Nang, Vietnam',
    startDate: '2026-11-15',
    endDate: '2026-11-18',
    budget: 5000000,
    collaborators: [
      { userId: 'u1', name: 'Duc (You)', role: 'OWNER' },
      { userId: 'u2', name: 'Alex', role: 'EDITOR' },
      { userId: 'u3', name: 'Sarah', role: 'VIEWER' },
    ],
    days: [
      {
        dayIndex: 1,
        date: '2026-11-15',
        items: [
          {
            id: 'stop-1',
            name: 'Khai Tri Basecamp Hotel',
            category: 'hotel',
            categoryName: 'Basecamp',
            isBasecamp: true,
            lat: 16.0678,
            lng: 108.2208,
            transitToNext: {
              distanceKm: 24.5,
              durationMinutes: 38,
              mode: 'drive',
            },
          },
          {
            id: 'stop-2',
            name: 'Ba Na Hills & Golden Bridge',
            category: 'landmark',
            lat: 15.9953,
            lng: 107.9866,
            transitToNext: {
              distanceKm: 28.0,
              durationMinutes: 42,
              mode: 'drive',
            },
          },
          {
            id: 'stop-3',
            name: 'Dragon Bridge',
            category: 'landmark',
            lat: 16.0611,
            lng: 108.2272,
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
      selectedCity: 'Đà Nẵng',
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
        totalExpense: 4200000,
        memberBalances: [
          { userId: 'u1', fullName: 'Duc (You)', netBalance: 1200000 },
          { userId: 'u2', fullName: 'Alex', netBalance: -800000 },
          { userId: 'u3', fullName: 'Sarah', netBalance: -400000 },
        ],
        simplifiedSettlements: [],
      },
      addExpense: jest.fn(),
      settleDebt: jest.fn(),
    });
  });

  // TEST 1: Accordion Wizard Step 4 (Spots) 2-column grid, 2 featured spots limit & See All expander
  test('RED-ENH-01: Accordion Wizard Step 4 limits categories to 2 featured spots and reveals all upon tapping See all', () => {
    const { getByTestId, queryByTestId } = render(
      <AccordionTripWizardModal
        visible={true}
        onClose={jest.fn()}
        onComplete={jest.fn()}
      />
    );

    // Navigate to Step 4 (Spots)
    fireEvent.press(getByTestId('trending-destination-danang'));
    fireEvent.press(getByTestId('when-next-btn'));
    fireEvent.press(getByTestId('preferences-next-btn'));

    // Check that category 'landmarks' has See All button
    const seeAllBtn = getByTestId('category-see-all-landmarks');
    expect(seeAllBtn).toBeTruthy();

    // In default state, only top 2 spots are visible, third spot (Ba Na Hills) should NOT be rendered yet
    expect(getByTestId('spot-card-dragon-bridge')).toBeTruthy();
    expect(getByTestId('spot-card-cham-museum')).toBeTruthy();
    expect(queryByTestId('spot-card-ba-na')).toBeNull();

    // Click See all
    fireEvent.press(seeAllBtn);

    // Now all spots should be visible
    expect(getByTestId('spot-card-ba-na')).toBeTruthy();
  });

  // TEST 2: Shared Packing Checklist 2-field input & squad member assignee tagging
  test('RED-ENH-02: Shared Packing Checklist provides task title input and squad member assignee selector', () => {
    const { getByTestId, getByText, getAllByText, queryByTestId } = render(<PlanScreen />);

    // Switch to Itinerary & Squad tab
    fireEvent.press(getByTestId('plan-subtab-itinerary'));

    // Open add gear section if collapsed
    const openFormBtn = queryByTestId('packing-open-add-form-btn');
    if (openFormBtn) fireEvent.press(openFormBtn);

    // Verify presence of 2-field add gear section
    const titleInput = getByTestId('packing-input-title');
    expect(titleInput).toBeTruthy();

    const assigneeSelector = getByTestId('packing-assignee-selector');
    expect(assigneeSelector).toBeTruthy();

    // Enter title
    fireEvent.changeText(titleInput, 'First Aid Kit & Sunscreen');

    // Select assignee 'Alex'
    const alexChip = getByTestId('packing-assignee-chip-Alex');
    expect(alexChip).toBeTruthy();
    fireEvent.press(alexChip);

    // Press Add button
    const addBtn = getByTestId('packing-add-item-btn');
    fireEvent.press(addBtn);

    // Expect item added with assignee
    expect(getByText('First Aid Kit & Sunscreen')).toBeTruthy();
    expect(getAllByText(/Alex/i).length).toBeGreaterThanOrEqual(1);
  });

  // TEST 3: Itinerary Timeline Chronological Times & Realistic Transit & Safe Bottom Padding
  test('RED-ENH-03: Itinerary timeline displays progressive chronological start times, driving transit for long distances, and safe padding', () => {
    const { getByTestId, getByText, queryAllByText } = render(<PlanScreen />);

    fireEvent.press(getByTestId('plan-subtab-itinerary'));

    // Stop 1 is Basecamp hotel: should have early morning start time (e.g. 08:30)
    // Stop 2 is Ba Na Hills: should have later time (e.g. 10:30) rather than duplicate 09:00
    expect(getByText(/08:30/i)).toBeTruthy();
    expect(getByText(/10:30/i)).toBeTruthy();

    // Transit from Basecamp to Ba Na Hills is 24.5 km: should show driving car icon/text instead of default 0.8 km walk
    expect(getByText(/🚗 24.5 km · 38 min drive/i)).toBeTruthy();

    // Scroll container has safe bottom padding (>= 100) to avoid dock occlusion
    const scrollContainer = getByTestId('itinerary-scroll-container');
    expect(scrollContainer.props.contentContainerStyle.paddingBottom).toBeGreaterThanOrEqual(100);
  });

  // TEST 4: Expenses Tab Total Estimated Banner, Bill Receipt Upload, Category, and Member Split Checkboxes
  test('RED-ENH-04: Expenses tab renders estimated total banner, bill receipt upload button, category picker, and member split checkboxes', () => {
    const { getByTestId, getByText } = render(<PlanScreen />);

    // Switch to Expenses & Splits tab
    fireEvent.press(getByTestId('plan-subtab-expenses'));

    // 1. Total Estimated Trip Expenses Banner
    const totalBanner = getByTestId('expense-total-estimated-banner');
    expect(totalBanner).toBeTruthy();
    expect(getByText(/Estimated Trip Budget/i)).toBeTruthy();

    // 2. Receipt photo upload button
    const uploadReceiptBtn = getByTestId('expense-upload-receipt-btn');
    expect(uploadReceiptBtn).toBeTruthy();

    // 3. Category picker
    const categoryPicker = getByTestId('expense-category-picker');
    expect(categoryPicker).toBeTruthy();

    // 4. Squad members checkbox split list
    const splitMembersList = getByTestId('expense-split-members-list');
    expect(splitMembersList).toBeTruthy();
    expect(getByTestId('expense-member-checkbox-u1')).toBeTruthy();
    expect(getByTestId('expense-member-checkbox-u2')).toBeTruthy();
    expect(getByTestId('expense-member-checkbox-u3')).toBeTruthy();
  });

  // TEST 5: Map & Places Tab embeds real Mapbox route canvas
  test('RED-ENH-05: Map & Places tab renders real Mapbox route canvas with stops and route line', () => {
    const { getByTestId } = render(<PlanScreen />);

    // Switch to Map & Places tab
    fireEvent.press(getByTestId('plan-subtab-map'));

    // Verify presence of Mapbox route canvas
    const mapboxCanvas = getByTestId('itinerary-route-mapbox-canvas');
    expect(mapboxCanvas).toBeTruthy();
  });
});
