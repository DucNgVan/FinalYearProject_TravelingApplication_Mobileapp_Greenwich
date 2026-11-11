import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import AccordionTripWizardModal from '../../src/components/plan/AccordionTripWizardModal';
import PlanScreen from '../../src/screens/plan/PlanScreen';
import { useItineraryStore } from '../../src/stores/itinerary.store';
import { useExpenseStore } from '../../src/stores/expense.store';
import { useThemeStore } from '../../src/stores/theme.store';
import { usePlacesStore } from '../../src/stores/places.store';

jest.mock('../../src/stores/itinerary.store');
jest.mock('../../src/stores/expense.store');
jest.mock('../../src/stores/theme.store');
jest.mock('../../src/stores/places.store');

describe('TDD RED Phase: Trip Wizard Budget Setup & Clean Expenses Display', () => {
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
      fetchPlaces: jest.fn().mockResolvedValue([]),
    });
  });

  test('RED-WIZARD-BUDGET-01: AccordionTripWizardModal Step 3 includes Solo vs Group selection and estimated cost per person input', () => {
    const { getByTestId, getByText, getAllByText } = render(
      <AccordionTripWizardModal
        visible={true}
        onClose={jest.fn()}
        onComplete={jest.fn()}
      />
    );

    // Step 1 -> Select city -> Step 2
    fireEvent.press(getByTestId('trending-destination-danang'));

    // Step 2 -> Click Next -> Step 3 (Preferences & Budget)
    fireEvent.press(getByTestId('when-next-btn'));

    // Step 3 must render travel mode toggles
    const soloBtn = getByTestId('wizard-budget-mode-solo');
    const groupBtn = getByTestId('wizard-budget-mode-group');
    expect(soloBtn).toBeTruthy();
    expect(groupBtn).toBeTruthy();

    // Must render cost per person input
    const perPersonInput = getByTestId('wizard-budget-per-person');
    expect(perPersonInput).toBeTruthy();

    // Toggle Group mode
    fireEvent.press(groupBtn);
    expect(getAllByText(/Traveler/i).length).toBeGreaterThanOrEqual(1);

    // Edit cost per person
    fireEvent.changeText(perPersonInput, '3500000');
    expect(perPersonInput.props.value).toBe('3500000');
  });

  test('RED-WIZARD-BUDGET-02: Completing wizard passes travelMode, travelersCount, budgetPerPerson, and total budget to onComplete', () => {
    const mockOnComplete = jest.fn();
    const { getByTestId } = render(
      <AccordionTripWizardModal
        visible={true}
        onClose={jest.fn()}
        onComplete={mockOnComplete}
      />
    );

    // Step 1: Select Da Nang
    fireEvent.press(getByTestId('trending-destination-danang'));

    // Step 2: Next
    fireEvent.press(getByTestId('when-next-btn'));

    // Step 3: Select Solo and budget 2,500,000, then Next
    fireEvent.press(getByTestId('wizard-budget-mode-solo'));
    fireEvent.changeText(getByTestId('wizard-budget-per-person'), '2500000');
    fireEvent.press(getByTestId('preferences-next-btn'));

    // Step 4: Next to Stay
    fireEvent.press(getByTestId('spots-continue-btn'));

    // Step 5: Next to Invite
    fireEvent.press(getByTestId('stay-continue-btn'));

    // Step 6: Complete
    fireEvent.press(getByTestId('invite-share-view-plan-btn'));

    expect(mockOnComplete).toHaveBeenCalledWith(
      expect.objectContaining({
        travelMode: 'solo',
        travelersCount: 1,
        budgetPerPerson: 2500000,
        budget: 2500000,
      })
    );
  });

  test('RED-EXP-DISPLAY-03: PlanScreen Expenses tab displays pre-configured budget without interactive mode/budget inputs in the banner', () => {
    const mockConfiguredTrip = {
      id: 'trip-hanoi-configured-1',
      title: 'Hà Nội Squad Adventure',
      destination: 'Hà Nội',
      destinationCity: 'Hà Nội',
      country: 'Việt Nam',
      daysCount: 3,
      status: 'Ready',
      budget: 6000000,
      budgetPerPerson: 2000000,
      travelMode: 'group',
      travelersCount: 3,
      collaborators: [
        { userId: 'u1', name: 'Duc (You)', role: 'OWNER' },
        { userId: 'u2', name: 'Alex', role: 'EDITOR' },
        { userId: 'u3', name: 'Sarah', role: 'EDITOR' },
      ],
      days: [{ dayIndex: 1, items: [{ id: 'stop-1', name: 'Hoan Kiem Lake' }] }],
    };

    useItineraryStore.mockReturnValue({
      currentTrip: mockConfiguredTrip,
      trips: [mockConfiguredTrip],
      isLoading: false,
      error: null,
      fetchTripDetails: jest.fn(),
      inviteCompanion: jest.fn(),
      updateTrip: jest.fn(),
    });

    useExpenseStore.mockReturnValue({
      expenses: [],
      debtSummary: {
        totalExpense: 1200000,
        memberBalances: [],
        simplifiedSettlements: [],
      },
      isLoading: false,
      error: null,
      fetchTripExpenses: jest.fn(),
      fetchDebtSummary: jest.fn(),
      addExpense: jest.fn(),
      settleDebt: jest.fn(),
    });

    const { getByTestId, queryByTestId, getByText } = render(<PlanScreen />);

    // Switch to Expenses & Splits tab
    fireEvent.press(getByTestId('plan-subtab-expenses'));

    // Estimated budget banner must exist and display the amounts
    const banner = getByTestId('expense-total-estimated-banner');
    expect(banner).toBeTruthy();
    expect(getByText('Estimated Trip Budget')).toBeTruthy();
    expect(getByText(/6[.,]000[.,]000/)).toBeTruthy();

    // Mode buttons and text inputs MUST NOT be inside the expenses banner
    expect(queryByTestId('budget-mode-solo')).toBeNull();
    expect(queryByTestId('budget-mode-group')).toBeNull();
    expect(queryByTestId('budget-per-person-input')).toBeNull();
  });
});
