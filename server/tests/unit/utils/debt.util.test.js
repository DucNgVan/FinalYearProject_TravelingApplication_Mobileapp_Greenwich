const { simplifyDebts } = require('../../../src/utils/debt.util');

describe('Unit Test: Debt Simplification Utility (Greedy Minimum Cash-Flow Algorithm)', () => {
  test('RED-EXP-01: simplifyDebts should condense 3-person debts into exactly 2 direct transactions', () => {
    // Scenario from BDD Spec: Đức (+500,000), Nam (-100,000), Hoa (-400,000)
    const balances = [
      { userId: 'user-duc-01', netBalance: 500000 },
      { userId: 'user-nam-02', netBalance: -100000 },
      { userId: 'user-hoa-03', netBalance: -400000 },
    ];

    const transactions = simplifyDebts(balances);

    expect(transactions).toBeDefined();
    expect(transactions).toHaveLength(2);

    // Sorted greedy transactions: largest debtor to largest creditor first
    expect(transactions).toEqual(
      expect.arrayContaining([
        {
          fromUserId: 'user-hoa-03',
          toUserId: 'user-duc-01',
          amount: 400000,
        },
        {
          fromUserId: 'user-nam-02',
          toUserId: 'user-duc-01',
          amount: 100000,
        },
      ])
    );
  });

  test('RED-EXP-02: simplifyDebts should return an empty array if all net balances are zero', () => {
    const balancedSquad = [
      { userId: 'user-duc-01', netBalance: 0 },
      { userId: 'user-nam-02', netBalance: 0 },
      { userId: 'user-hoa-03', netBalance: 0 },
    ];

    const transactions = simplifyDebts(balancedSquad);

    expect(transactions).toEqual([]);
  });

  test('RED-EXP-03: simplifyDebts should throw error when net balances sum is non-zero (Invariant Violation)', () => {
    // Non-zero sum: 500k - 200k = +300k != 0
    const invalidBalances = [
      { userId: 'user-duc-01', netBalance: 500000 },
      { userId: 'user-nam-02', netBalance: -200000 },
    ];

    expect(() => simplifyDebts(invalidBalances)).toThrow(
      /Net balances must sum to zero/i
    );
  });

  test('RED-EXP-04: simplifyDebts should handle arbitrary N-member squad with at most N-1 transactions and zero remainder', () => {
    // 5 members: A: +120,000, B: +80,000, C: -50,000, D: -70,000, E: -80,000
    // Sum = 120 + 80 - 50 - 70 - 80 = 0
    const balances = [
      { userId: 'member-A', netBalance: 120000 },
      { userId: 'member-B', netBalance: 80000 },
      { userId: 'member-C', netBalance: -50000 },
      { userId: 'member-D', netBalance: -70000 },
      { userId: 'member-E', netBalance: -80000 },
    ];

    const transactions = simplifyDebts(balances);

    expect(transactions.length).toBeLessThanOrEqual(5 - 1); // At most N-1

    // Verify mathematical integrity: total paid by debtors equals total received by creditors
    const totalTransactionsAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
    expect(totalTransactionsAmount).toBe(200000); // Total positive debt
  });

  test('should return empty array when balances is null or omitted', () => {
    expect(simplifyDebts(null)).toEqual([]);
    expect(simplifyDebts()).toEqual([]);
  });
});
