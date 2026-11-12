const expenseService = require('../../../src/services/expense.service');

describe('Unit Test: Expense Service (Splitting Logic & Calculations)', () => {
  test('RED-EXP-05: calculateSplits should correctly split amount equally among members', () => {
    const amount = 1200000;
    const participants = ['user-duc-01', 'user-nam-02', 'user-hoa-03'];

    const splits = expenseService.calculateSplits({
      amount,
      splitStrategy: 'equal',
      participants,
    });

    expect(splits).toHaveLength(3);
    splits.forEach((split) => {
      expect(split.splitAmount).toBe(400000);
      expect(participants).toContain(split.userId);
    });

    const sum = splits.reduce((acc, curr) => acc + curr.splitAmount, 0);
    expect(sum).toBe(1200000);
  });

  test('RED-EXP-06: calculateSplits should handle remainders cleanly in equal split without loss of cents/dong', () => {
    // 100,000 / 3 = 33,333.33...
    const amount = 100000;
    const participants = ['user-duc-01', 'user-nam-02', 'user-hoa-03'];

    const splits = expenseService.calculateSplits({
      amount,
      splitStrategy: 'equal',
      participants,
    });

    expect(splits).toHaveLength(3);
    const sum = splits.reduce((acc, curr) => acc + curr.splitAmount, 0);
    expect(sum).toBe(100000);

    // One member absorbs the remainder (33334 + 33333 + 33333 = 100000)
    const amounts = splits.map((s) => s.splitAmount).sort();
    expect(amounts).toEqual([33333, 33333, 33334]);
  });

  test('RED-EXP-07: calculateSplits should throw 422 error if sum of exact custom splits does not match total amount', () => {
    const amount = 500000;
    const customSplits = [
      { userId: 'user-duc-01', splitAmount: 200000 },
      { userId: 'user-nam-02', splitAmount: 200000 }, // Total = 400,000 != 500,000
    ];

    expect(() =>
      expenseService.calculateSplits({
        amount,
        splitStrategy: 'exact',
        customSplits,
      })
    ).toThrow(
      expect.objectContaining({
        statusCode: 422,
        code: 'EXPENSE_SPLIT_MISMATCH',
      })
    );
  });

  test('RED-EXP-08: calculateSplits should throw 422 error if percentage splits do not equal 100%', () => {
    const amount = 1000000;
    const percentageSplits = [
      { userId: 'user-duc-01', percentage: 50 },
      { userId: 'user-nam-02', percentage: 40 }, // Total = 90% != 100%
    ];

    expect(() =>
      expenseService.calculateSplits({
        amount,
        splitStrategy: 'percentage',
        customSplits: percentageSplits,
      })
    ).toThrow(
      expect.objectContaining({
        statusCode: 422,
        code: 'EXPENSE_SPLIT_MISMATCH',
      })
    );
  });

  test('should throw error when participants array is empty in equal split', () => {
    expect(() =>
      expenseService.calculateSplits({
        amount: 500000,
        splitStrategy: 'equal',
        participants: [],
      })
    ).toThrow(/Participants array is required/);
  });

  test('should accurately calculate percentage splits when sum equals 100%', () => {
    const amount = 1000000;
    const splits = expenseService.calculateSplits({
      amount,
      splitStrategy: 'percentage',
      customSplits: [
        { userId: 'user-duc-01', percentage: 60 },
        { userId: 'user-nam-02', percentage: 40 },
      ],
    });

    expect(splits).toHaveLength(2);
    expect(splits[0].splitAmount).toBe(600000);
    expect(splits[1].splitAmount).toBe(400000);
  });

  test('should return empty summary for trip with no expenses', async () => {
    const summary = await expenseService.getExpenseSummary('trip-empty');
    expect(summary.totalTripExpense).toBe(0);
    expect(summary.memberBalances).toEqual([]);
  });

  test('should return exact splits when sum matches total amount', () => {
    const splits = expenseService.calculateSplits({
      amount: 500000,
      splitStrategy: 'exact',
      customSplits: [
        { userId: 'user-duc-01', splitAmount: 300000 },
        { userId: 'user-nam-02', splitAmount: 200000 },
      ],
    });
    expect(splits).toHaveLength(2);
    expect(splits[0].splitAmount).toBe(300000);
    expect(splits[1].splitAmount).toBe(200000);
  });

  test('should return customSplits directly when splitStrategy is unsupported', () => {
    const custom = [{ userId: 'user-1', splitAmount: 100 }];
    const splits = expenseService.calculateSplits({
      amount: 100,
      splitStrategy: 'custom-strategy',
      customSplits: custom,
    });
    expect(splits).toBe(custom);
  });

  test('should confirm settlement with rejected status and null settledAt', async () => {
    const settlement = await expenseService.recordSettlement({
      tripId: 'trip-reject',
      debtorId: 'user-1',
      creditorId: 'user-2',
      amount: 100000,
    });
    const updated = await expenseService.confirmSettlement({
      settlementId: settlement.id,
      status: 'rejected',
    });
    expect(updated.status).toBe('rejected');
    expect(updated.settledAt).toBeNull();
  });
});
