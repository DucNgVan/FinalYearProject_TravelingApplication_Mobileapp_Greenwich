const expenseRepository = require('../../../src/repositories/expense.repository');

describe('Unit Test: ExpenseRepository with Mock Database Pool & In-Memory Store', () => {
  const ExpenseRepositoryClass = expenseRepository.constructor;

  test('should create expense, splits and commit transaction with pool', async () => {
    const mockClient = {
      query: jest.fn().mockResolvedValue({ rows: [] }),
      release: jest.fn(),
    };
    const mockPool = {
      connect: jest.fn().mockResolvedValue(mockClient),
      query: jest.fn().mockResolvedValue({ rows: [] }),
    };

    const repo = new ExpenseRepositoryClass(mockPool);

    const expenseData = {
      id: 'exp-pool-1',
      tripId: 'trip-1',
      payerId: 'user-1',
      title: 'Dinner',
      amount: 300000,
      currency: 'VND',
      splits: [
        { userId: 'user-1', splitAmount: 150000 },
        { userId: 'user-2', splitAmount: 150000 },
      ],
    };

    const created = await repo.createExpense(expenseData);

    expect(mockPool.connect).toHaveBeenCalled();
    expect(mockClient.query).toHaveBeenCalledWith('BEGIN');
    expect(mockClient.query).toHaveBeenCalledWith('COMMIT');
    expect(mockClient.release).toHaveBeenCalled();
    expect(created.id).toBe('exp-pool-1');
  });

  test('should rollback transaction if client query throws error in createExpense', async () => {
    const mockClient = {
      query: jest.fn().mockImplementation((queryText) => {
        if (queryText.includes('INSERT INTO trip_expenses')) {
          throw new Error('DB Write Error');
        }
        return Promise.resolve({ rows: [] });
      }),
      release: jest.fn(),
    };
    const mockPool = {
      connect: jest.fn().mockResolvedValue(mockClient),
    };

    const repo = new ExpenseRepositoryClass(mockPool);

    const created = await repo.createExpense({
      id: 'exp-rollback-1',
      tripId: 'trip-1',
      payerId: 'user-1',
      title: 'Failed Dinner',
      amount: 300000,
      splits: [{ userId: 'user-1', splitAmount: 300000 }],
    });

    expect(mockClient.query).toHaveBeenCalledWith('ROLLBACK');
    expect(mockClient.release).toHaveBeenCalled();
    // Fallback creates in memory
    expect(created.id).toBe('exp-rollback-1');
  });

  test('should query pool for findExpensesByTrip, findExpenseById, deleteExpense', async () => {
    const mockRow = {
      id: 'exp-1',
      trip_id: 'trip-1',
      payer_id: 'user-1',
      title: 'Hotel',
      amount: '500000',
      currency: 'VND',
      category: 'stay',
      receipt_url: null,
      split_strategy: 'equal',
      notes: null,
      created_at: new Date(),
    };

    const mockSplitRow = {
      id: 'split-1',
      expense_id: 'exp-1',
      user_id: 'user-1',
      split_amount: '500000',
      is_settled: false,
    };

    const mockPool = {
      query: jest.fn().mockImplementation((queryText) => {
        if (queryText.includes('SELECT * FROM trip_expenses WHERE trip_id')) {
          return Promise.resolve({ rows: [mockRow] });
        }
        if (queryText.includes('SELECT * FROM trip_expenses WHERE id')) {
          return Promise.resolve({ rows: [mockRow] });
        }
        if (queryText.includes('SELECT * FROM trip_expense_splits')) {
          return Promise.resolve({ rows: [mockSplitRow] });
        }
        if (queryText.includes('DELETE FROM trip_expenses')) {
          return Promise.resolve({ rowCount: 1 });
        }
        return Promise.resolve({ rows: [] });
      }),
    };

    const repo = new ExpenseRepositoryClass(mockPool);

    const tripExpenses = await repo.findExpensesByTrip('trip-1');
    expect(tripExpenses).toHaveLength(1);
    expect(tripExpenses[0].title).toBe('Hotel');

    const singleExp = await repo.findExpenseById('exp-1');
    expect(singleExp.id).toBe('exp-1');
    expect(singleExp.splits).toHaveLength(1);

    const deleted = await repo.deleteExpense('exp-1');
    expect(deleted).toBe(true);
  });

  test('should query pool for createSettlement, findSettlementsByTrip, findSettlementById, updateSettlement', async () => {
    const mockSettlementRow = {
      id: 'stl-1',
      trip_id: 'trip-1',
      debtor_id: 'user-2',
      creditor_id: 'user-1',
      amount: '150000',
      currency: 'VND',
      status: 'pending',
      proof_image_url: null,
      settled_at: null,
      created_at: new Date(),
    };

    const mockPool = {
      query: jest.fn().mockImplementation((queryText) => {
        if (queryText.includes('SELECT * FROM trip_settlements WHERE trip_id')) {
          return Promise.resolve({ rows: [mockSettlementRow] });
        }
        if (queryText.includes('SELECT * FROM trip_settlements WHERE id')) {
          return Promise.resolve({ rows: [mockSettlementRow] });
        }
        return Promise.resolve({ rows: [mockSettlementRow] });
      }),
    };

    const repo = new ExpenseRepositoryClass(mockPool);

    const created = await repo.createSettlement({
      id: 'stl-1',
      tripId: 'trip-1',
      debtorId: 'user-2',
      creditorId: 'user-1',
      amount: 150000,
    });
    expect(created.id).toBe('stl-1');

    const settlements = await repo.findSettlementsByTrip('trip-1');
    expect(settlements).toHaveLength(1);

    const single = await repo.findSettlementById('stl-1');
    expect(single.id).toBe('stl-1');

    const updated = await repo.updateSettlement('stl-1', { status: 'confirmed' });
    expect(updated.status).toBe('confirmed');
  });

  test('should fallback to memory when database operations fail', async () => {
    const mockFailingPool = {
      connect: jest.fn().mockRejectedValue(new Error('Connection Failed')),
      query: jest.fn().mockRejectedValue(new Error('Connection Failed')),
    };

    const repo = new ExpenseRepositoryClass(mockFailingPool);

    // Should create in memory
    const exp = await repo.createExpense({
      id: 'mem-exp-1',
      tripId: 'trip-mem',
      payerId: 'user-1',
      title: 'Coffee',
      amount: 50000,
      splits: [{ userId: 'user-1', splitAmount: 50000 }],
    });
    expect(exp.id).toBe('mem-exp-1');

    const list = await repo.findExpensesByTrip('trip-mem');
    expect(list).toHaveLength(1);

    const found = await repo.findExpenseById('mem-exp-1');
    expect(found.title).toBe('Coffee');

    const deleted = await repo.deleteExpense('mem-exp-1');
    expect(deleted).toBe(true);

    const notFound = await repo.findExpenseById('non-existent');
    expect(notFound).toBeNull();
  });
});
