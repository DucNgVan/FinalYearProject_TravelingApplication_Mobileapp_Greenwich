import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import PlanScreen from '../../src/screens/plan/PlanScreen';
import { useItineraryStore } from '../../src/stores/itinerary.store';
import { useExpenseStore } from '../../src/stores/expense.store';
import { useThemeStore } from '../../src/stores/theme.store';

jest.mock('../../src/stores/itinerary.store');
jest.mock('../../src/stores/expense.store');
jest.mock('../../src/stores/theme.store');

describe('TDD RED Phase: Complete Expenses Mechanism & English Localization', () => {
  const mockTrip = {
    id: 'trip-hanoi-squad-1',
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
    days: [
      {
        dayIndex: 1,
        items: [{ id: 'stop-1', name: 'Hoan Kiem Lake' }],
      },
    ],
  };

  const mockAddExpense = jest.fn();
  const mockFetchDebtSummary = jest.fn();
  const mockSettleDebt = jest.fn();

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

    useItineraryStore.mockReturnValue({
      currentTrip: mockTrip,
      trips: [mockTrip],
      isLoading: false,
      error: null,
      fetchTripDetails: jest.fn(),
      inviteCompanion: jest.fn(),
      updateTrip: jest.fn(),
    });

    useExpenseStore.mockReturnValue({
      expenses: [],
      debtSummary: {
        totalExpense: 0,
        memberBalances: [
          { userId: 'u1', fullName: 'Duc (You)', totalPaid: 0, totalOwed: 0, netBalance: 0 },
          { userId: 'u2', fullName: 'Alex', totalPaid: 0, totalOwed: 0, netBalance: 0 },
          { userId: 'u3', fullName: 'Sarah', totalPaid: 0, totalOwed: 0, netBalance: 0 },
        ],
        simplifiedSettlements: [],
      },
      isLoading: false,
      error: null,
      fetchTripExpenses: jest.fn(),
      fetchDebtSummary: mockFetchDebtSummary,
      addExpense: mockAddExpense,
      settleDebt: mockSettleDebt,
    });
  });

  test('RED-EXP-WORKFLOW-01: Displays pre-configured trip budget and per-person summary without interactive mode inputs in expenses banner', () => {
    const { getByTestId, queryByTestId, getByText, getAllByText } = render(<PlanScreen />);

    // Navigate to Expenses & Splits tab
    fireEvent.press(getByTestId('plan-subtab-expenses'));

    // Check pre-configured banner exists
    const banner = getByTestId('expense-total-estimated-banner');
    expect(banner).toBeTruthy();
    expect(getByText('Estimated Trip Budget')).toBeTruthy();
    expect(getAllByText(/6[.,]000[.,]000/).length).toBeGreaterThanOrEqual(1);
    expect(getByText(/3 Travelers/i)).toBeTruthy();

    // Mode buttons and inputs must NOT be inside the expenses banner
    expect(queryByTestId('budget-mode-solo')).toBeNull();
    expect(queryByTestId('budget-mode-group')).toBeNull();
    expect(queryByTestId('budget-per-person-input')).toBeNull();
  });

  test('RED-EXP-WORKFLOW-02: Category picker includes "Other" and displays a custom category input when selected', () => {
    const { getByTestId, queryByTestId } = render(<PlanScreen />);
    fireEvent.press(getByTestId('plan-subtab-expenses'));

    // Initially custom category input should not be visible when "Food & Dining" is selected
    expect(queryByTestId('expense-custom-category-input')).toBeNull();

    // Select "Other" category chip
    const otherChip = getByTestId('expense-category-chip-Other');
    expect(otherChip).toBeTruthy();
    fireEvent.press(otherChip);

    // Now the custom category input must be displayed
    const customInput = getByTestId('expense-custom-category-input');
    expect(customInput).toBeTruthy();

    fireEvent.changeText(customInput, 'Souvenirs & Gifts');
    expect(customInput.props.value).toBe('Souvenirs & Gifts');
  });

  test('RED-EXP-WORKFLOW-03: Real bill receipt upload supports file selection, displays preview and can be removed', () => {
    const { getByTestId, queryByTestId } = render(<PlanScreen />);
    fireEvent.press(getByTestId('plan-subtab-expenses'));

    // Initially no receipt preview
    expect(queryByTestId('expense-receipt-preview')).toBeNull();

    // Trigger upload receipt button
    const uploadBtn = getByTestId('expense-upload-receipt-btn');
    fireEvent.press(uploadBtn);

    // After picking / attaching a photo, receipt preview is visible
    expect(getByTestId('expense-receipt-preview')).toBeTruthy();

    // Remove photo button is available
    const removeBtn = getByTestId('expense-remove-receipt-btn');
    expect(removeBtn).toBeTruthy();
    fireEvent.press(removeBtn);

    // Preview should now be gone
    expect(queryByTestId('expense-receipt-preview')).toBeNull();
  });

  test('RED-EXP-WORKFLOW-04: Submitting a new bill dynamically computes member balances with Paid (+), Share (-), and a Net Total column', () => {
    const { getByTestId, getAllByText } = render(<PlanScreen />);
    fireEvent.press(getByTestId('plan-subtab-expenses'));

    // Fill in Expense Title
    const titleInput = getByTestId('expense-title-input');
    fireEvent.changeText(titleInput, 'Dinner at Madame Lan');

    // Fill in Amount: 900,000 VND
    const amountInput = getByTestId('expense-amount-input');
    fireEvent.changeText(amountInput, '900000');

    // Submit expense
    const submitBtn = getByTestId('submit-expense-btn');
    fireEvent.press(submitBtn);

    // Member balance rows must show + for paid, - for share, and net total column
    expect(getByTestId('member-balance-row-u1')).toBeTruthy();
    expect(getByTestId('member-balance-paid-u1')).toBeTruthy();
    expect(getByTestId('member-balance-share-u1')).toBeTruthy();
    expect(getByTestId('member-balance-net-u1')).toBeTruthy();

    // Verify + and - signs appear in the balance calculations
    expect(getAllByText(/\+/).length).toBeGreaterThanOrEqual(1);
    expect(getAllByText(/-/).length).toBeGreaterThanOrEqual(1);
  });

  test('RED-EXP-WORKFLOW-05: 100% of Expenses tab is localized to English with zero Vietnamese labels', () => {
    const { getByTestId, queryByText } = render(<PlanScreen />);
    fireEvent.press(getByTestId('plan-subtab-expenses'));

    // English titles must be present
    expect(getByTestId('expense-total-estimated-banner')).toBeTruthy();

    // Vietnamese strings that were previously there must NOT exist
    expect(queryByText(/Tổng chi phí ước tính/i)).toBeNull();
    expect(queryByText(/Đã chi/i)).toBeNull();
    expect(queryByText(/Còn lại/i)).toBeNull();
    expect(queryByText(/Thêm Chi Tiêu/i)).toBeNull();
    expect(queryByText(/Ảnh hoá đơn/i)).toBeNull();
    expect(queryByText(/Mục Chi Tiêu/i)).toBeNull();
    expect(queryByText(/Thành Viên Cần Chia/i)).toBeNull();
    expect(queryByText(/Được chia/i)).toBeNull();
    expect(queryByText(/Không chia/i)).toBeNull();
  });
});
