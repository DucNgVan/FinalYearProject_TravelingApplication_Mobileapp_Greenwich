import { useExpenseStore } from '../../../src/stores/expense.store';
import apiClient from '../../../src/api/client';

jest.mock('../../../src/api/client');

describe('Unit Test: Expense Store (Group Expense Splitting & Greedy Debt Simplification)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useExpenseStore.setState({
      expenses: [],
      debtSummary: null,
      isLoading: false,
      error: null,
    });
  });

  test('RED-FE-EXP-01: useExpenseStore should initialize with empty state', () => {
    const state = useExpenseStore.getState();
    expect(state.expenses).toEqual([]);
    expect(state.debtSummary).toBeNull();
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  test('RED-FE-EXP-02: fetchTripExpenses should load expenses from API', async () => {
    const mockExpenses = [
      {
        id: 'exp-01',
        tripId: 'trip-101',
        title: 'Bữa trưa hải sản Bé Mặn',
        amount: 1800000,
        currency: 'VND',
        paidBy: { userId: 'u-1', fullName: 'Đức Nguyễn' },
        splitType: 'EQUAL',
        splits: [
          { userId: 'u-1', amount: 600000 },
          { userId: 'u-2', amount: 600000 },
          { userId: 'u-3', amount: 600000 },
        ],
      },
    ];

    apiClient.get.mockResolvedValueOnce(mockExpenses);

    await useExpenseStore.getState().fetchTripExpenses('trip-101');

    const state = useExpenseStore.getState();
    expect(apiClient.get).toHaveBeenCalledWith('/trips/trip-101/expenses');
    expect(state.expenses).toEqual(mockExpenses);
  });

  test('RED-FE-EXP-03: fetchDebtSummary should retrieve greedy debt settlements and net balances', async () => {
    const mockDebtSummary = {
      tripId: 'trip-101',
      totalExpense: 3600000,
      memberBalances: [
        { userId: 'u-1', fullName: 'Đức Nguyễn', netBalance: 1200000 },
        { userId: 'u-2', fullName: 'Hoàng Nam', netBalance: -600000 },
        { userId: 'u-3', fullName: 'Minh Thảo', netBalance: -600000 },
      ],
      simplifiedSettlements: [
        { fromUserId: 'u-2', toUserId: 'u-1', amount: 600000, currency: 'VND' },
        { fromUserId: 'u-3', toUserId: 'u-1', amount: 600000, currency: 'VND' },
      ],
    };

    apiClient.get.mockResolvedValueOnce(mockDebtSummary);

    await useExpenseStore.getState().fetchDebtSummary('trip-101');

    const state = useExpenseStore.getState();
    expect(apiClient.get).toHaveBeenCalledWith('/trips/trip-101/debts');
    expect(state.debtSummary).toEqual(mockDebtSummary);
    expect(state.debtSummary.simplifiedSettlements.length).toBe(2);
  });

  test('RED-FE-EXP-04: settleDebt should record debt settlement and refresh summary', async () => {
    const settlePayload = {
      payerId: 'u-2',
      receiverId: 'u-1',
      amount: 600000,
    };

    apiClient.post.mockResolvedValueOnce({ success: true, transactionId: 'tx-999' });
    apiClient.get.mockResolvedValueOnce({
      tripId: 'trip-101',
      totalExpense: 3600000,
      memberBalances: [
        { userId: 'u-1', fullName: 'Đức Nguyễn', netBalance: 600000 },
        { userId: 'u-2', fullName: 'Hoàng Nam', netBalance: 0 },
        { userId: 'u-3', fullName: 'Minh Thảo', netBalance: -600000 },
      ],
      simplifiedSettlements: [
        { fromUserId: 'u-3', toUserId: 'u-1', amount: 600000, currency: 'VND' },
      ],
    });

    await useExpenseStore.getState().settleDebt('trip-101', settlePayload);

    expect(apiClient.post).toHaveBeenCalledWith('/trips/trip-101/debts/settle', settlePayload);
    const state = useExpenseStore.getState();
    expect(state.debtSummary.simplifiedSettlements.length).toBe(1);
  });

  test('should handle addExpense and auto refresh debt summary', async () => {
    const expensePayload = {
      title: 'Vé cáp treo Bà Nà Hills',
      amount: 900000,
    };
    const created = { id: 'exp-2', ...expensePayload };

    apiClient.post.mockResolvedValueOnce(created);
    apiClient.get.mockResolvedValueOnce({ tripId: 'trip-101', totalExpense: 4500000, simplifiedSettlements: [] });

    const result = await useExpenseStore.getState().addExpense('trip-101', expensePayload);
    expect(result).toEqual(created);
    expect(useExpenseStore.getState().expenses[0]).toEqual(created);
    expect(useExpenseStore.getState().debtSummary.totalExpense).toBe(4500000);
  });

  test('should handle all error cases in expense store', async () => {
    apiClient.get.mockRejectedValueOnce(new Error('Fetch expenses failed'));
    await expect(useExpenseStore.getState().fetchTripExpenses('t-1')).rejects.toThrow('Fetch expenses failed');

    apiClient.post.mockRejectedValueOnce(new Error('Add failed'));
    await expect(useExpenseStore.getState().addExpense('t-1', {})).rejects.toThrow('Add failed');

    apiClient.get.mockRejectedValueOnce({});
    await expect(useExpenseStore.getState().fetchDebtSummary('t-1')).rejects.toBeDefined();
    expect(useExpenseStore.getState().error).toMatch(/Failed to calculate debt summary|Lỗi khi tính toán bảng cân đối công nợ/);

    apiClient.post.mockRejectedValueOnce({});
    await expect(useExpenseStore.getState().settleDebt('t-1', {})).rejects.toBeDefined();
    expect(useExpenseStore.getState().error).toMatch(/Failed to settle debt|Lỗi khi thanh toán công nợ/);
  });

  test('should handle object payload and default empty array in fetchTripExpenses', async () => {
    apiClient.get.mockResolvedValueOnce({ expenses: [{ id: 'e-obj', title: 'Coffee' }] });
    const list = await useExpenseStore.getState().fetchTripExpenses('t-1');
    expect(list.length).toBe(1);
    expect(useExpenseStore.getState().expenses[0].id).toBe('e-obj');

    apiClient.get.mockResolvedValueOnce({});
    const emptyList = await useExpenseStore.getState().fetchTripExpenses('t-1');
    expect(emptyList).toEqual([]);
  });
});
