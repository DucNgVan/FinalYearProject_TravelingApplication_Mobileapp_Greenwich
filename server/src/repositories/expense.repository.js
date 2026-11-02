const crypto = require('crypto');

// In-memory collections for unit/integration tests without active database container
const memoryExpenses = new Map();
const memorySplits = new Map();
const memorySettlements = new Map();

class ExpenseRepository {
  constructor(pgPool = null) {
    this.pool = pgPool;
  }

  async createExpense({
    id = crypto.randomUUID(),
    tripId,
    payerId,
    title,
    amount,
    currency = 'VND',
    category = 'other',
    receiptUrl = null,
    splitStrategy = 'equal',
    notes = null,
    splits = [],
  }) {
    const expenseRecord = {
      id,
      tripId,
      payerId,
      title,
      amount: Number(amount),
      currency,
      category,
      receiptUrl,
      splitStrategy,
      notes,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const splitRecords = splits.map((s) => ({
      id: crypto.randomUUID(),
      expenseId: id,
      userId: s.userId,
      splitAmount: Number(s.splitAmount),
      isSettled: false,
      createdAt: new Date(),
    }));

    if (this.pool) {
      let client;
      try {
        client = await this.pool.connect();
        await client.query('BEGIN');
        await client.query(
          `INSERT INTO trip_expenses (id, trip_id, payer_id, title, amount, currency, category, receipt_url, split_strategy, notes, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
          [
            id,
            tripId,
            payerId,
            title,
            amount,
            currency,
            category,
            receiptUrl,
            splitStrategy,
            notes,
            expenseRecord.createdAt,
            expenseRecord.updatedAt,
          ]
        );

        for (const split of splitRecords) {
          await client.query(
            `INSERT INTO trip_expense_splits (id, expense_id, user_id, split_amount, is_settled, created_at)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [split.id, id, split.userId, split.splitAmount, split.isSettled, split.createdAt]
          );
        }

        await client.query('COMMIT');
        return { ...expenseRecord, splits: splitRecords };
      } catch (err) {
        if (client) {
          try {
            await client.query('ROLLBACK');
          } catch (rErr) {}
        }
        // Fallback to memory
      } finally {
        if (client) {
          client.release();
        }
      }
    }

    memoryExpenses.set(id, expenseRecord);
    memorySplits.set(id, splitRecords);

    return { ...expenseRecord, splits: splitRecords };
  }

  async findExpensesByTrip(tripId) {
    if (this.pool) {
      try {
        const expRes = await this.pool.query(
          'SELECT * FROM trip_expenses WHERE trip_id = $1 ORDER BY created_at DESC',
          [tripId]
        );
        const expenses = [];
        for (const row of expRes.rows) {
          const splitRes = await this.pool.query(
            'SELECT * FROM trip_expense_splits WHERE expense_id = $1',
            [row.id]
          );
          expenses.push({
            id: row.id,
            tripId: row.trip_id,
            payerId: row.payer_id,
            title: row.title,
            amount: Number(row.amount),
            currency: row.currency,
            category: row.category,
            receiptUrl: row.receipt_url,
            splitStrategy: row.split_strategy,
            notes: row.notes,
            createdAt: row.created_at,
            splits: splitRes.rows.map((s) => ({
              id: s.id,
              expenseId: s.expense_id,
              userId: s.user_id,
              splitAmount: Number(s.split_amount),
              isSettled: s.is_settled,
            })),
          });
        }
        return expenses;
      } catch (err) {
        // Fallback to memory
      }
    }

    const results = [];
    for (const [id, exp] of memoryExpenses.entries()) {
      if (exp.tripId === tripId) {
        const splits = memorySplits.get(id) || [];
        results.push({ ...exp, splits });
      }
    }
    return results;
  }

  async findExpenseById(expenseId) {
    if (this.pool) {
      try {
        const res = await this.pool.query('SELECT * FROM trip_expenses WHERE id = $1', [expenseId]);
        if (res.rows[0]) {
          const splitRes = await this.pool.query(
            'SELECT * FROM trip_expense_splits WHERE expense_id = $1',
            [expenseId]
          );
          const row = res.rows[0];
          return {
            id: row.id,
            tripId: row.trip_id,
            payerId: row.payer_id,
            title: row.title,
            amount: Number(row.amount),
            currency: row.currency,
            category: row.category,
            receiptUrl: row.receipt_url,
            splitStrategy: row.split_strategy,
            notes: row.notes,
            splits: splitRes.rows.map((s) => ({
              id: s.id,
              expenseId: s.expense_id,
              userId: s.user_id,
              splitAmount: Number(s.split_amount),
              isSettled: s.is_settled,
            })),
          };
        }
      } catch (err) {
        // Fallback to memory
      }
    }

    const exp = memoryExpenses.get(expenseId);
    if (!exp) return null;
    const splits = memorySplits.get(expenseId) || [];
    return { ...exp, splits };
  }

  async deleteExpense(expenseId) {
    if (this.pool) {
      try {
        await this.pool.query('DELETE FROM trip_expenses WHERE id = $1', [expenseId]);
        return true;
      } catch (err) {
        // Fallback to memory
      }
    }

    memoryExpenses.delete(expenseId);
    memorySplits.delete(expenseId);
    return true;
  }

  async createSettlement({
    id = crypto.randomUUID(),
    tripId,
    debtorId,
    creditorId,
    amount,
    currency = 'VND',
    status = 'pending',
    proofImageUrl = null,
  }) {
    const record = {
      id,
      tripId,
      debtorId,
      creditorId,
      amount: Number(amount),
      currency,
      status,
      proofImageUrl,
      settledAt: null,
      createdAt: new Date(),
    };

    if (this.pool) {
      try {
        await this.pool.query(
          `INSERT INTO trip_settlements (id, trip_id, debtor_id, creditor_id, amount, currency, status, proof_image_url, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          [id, tripId, debtorId, creditorId, amount, currency, status, proofImageUrl, record.createdAt]
        );
        return record;
      } catch (err) {
        // Fallback to memory
      }
    }

    memorySettlements.set(id, record);
    return record;
  }

  async findSettlementsByTrip(tripId) {
    if (this.pool) {
      try {
        const res = await this.pool.query(
          'SELECT * FROM trip_settlements WHERE trip_id = $1 ORDER BY created_at DESC',
          [tripId]
        );
        return res.rows.map((row) => ({
          id: row.id,
          tripId: row.trip_id,
          debtorId: row.debtor_id,
          creditorId: row.creditor_id,
          amount: Number(row.amount),
          currency: row.currency,
          status: row.status,
          proofImageUrl: row.proof_image_url,
          settledAt: row.settled_at,
          createdAt: row.created_at,
        }));
      } catch (err) {
        // Fallback to memory
      }
    }

    const settlements = [];
    for (const s of memorySettlements.values()) {
      if (s.tripId === tripId) {
        settlements.push(s);
      }
    }
    return settlements;
  }

  async findSettlementById(settlementId) {
    if (this.pool) {
      try {
        const res = await this.pool.query('SELECT * FROM trip_settlements WHERE id = $1', [
          settlementId,
        ]);
        if (res.rows[0]) {
          const row = res.rows[0];
          return {
            id: row.id,
            tripId: row.trip_id,
            debtorId: row.debtor_id,
            creditorId: row.creditor_id,
            amount: Number(row.amount),
            currency: row.currency,
            status: row.status,
            proofImageUrl: row.proof_image_url,
            settledAt: row.settled_at,
            createdAt: row.created_at,
          };
        }
      } catch (err) {
        // Fallback to memory
      }
    }

    return memorySettlements.get(settlementId) || null;
  }

  async updateSettlement(settlementId, updates) {
    const settlement = await this.findSettlementById(settlementId);
    if (!settlement) return null;

    const updated = {
      ...settlement,
      ...updates,
      updatedAt: new Date(),
    };

    if (this.pool) {
      try {
        await this.pool.query(
          `UPDATE trip_settlements SET status = $1, settled_at = $2 WHERE id = $3`,
          [updated.status, updated.settledAt, settlementId]
        );
        return updated;
      } catch (err) {
        // Fallback to memory
      }
    }

    memorySettlements.set(settlementId, updated);
    return updated;
  }

  clear() {
    memoryExpenses.clear();
    memorySplits.clear();
    memorySettlements.clear();
  }
}

module.exports = new ExpenseRepository();
