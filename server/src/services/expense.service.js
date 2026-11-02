const expenseRepository = require('../repositories/expense.repository');
const itineraryRepository = require('../repositories/itinerary.repository');
const { simplifyDebts } = require('../utils/debt.util');

class ExpenseService {
  calculateSplits({ amount, splitStrategy = 'equal', participants = [], customSplits = [] }) {
    const numAmount = Number(amount);

    if (splitStrategy === 'equal') {
      if (!participants || participants.length === 0) {
        throw new Error('Participants array is required for equal split strategy');
      }

      const n = participants.length;
      const base = Math.floor(numAmount / n);
      const remainder = numAmount - base * n;

      // Distribute remainder cents/dong cleanly across the last members to avoid floating errors
      return participants.map((userId, index) => {
        const isRemainderBeneficiary = index >= n - remainder;
        const splitAmount = isRemainderBeneficiary ? base + 1 : base;
        return {
          userId,
          splitAmount,
        };
      });
    }

    if (splitStrategy === 'exact') {
      const totalSplit = customSplits.reduce((acc, s) => acc + Number(s.splitAmount || 0), 0);
      if (Math.abs(totalSplit - numAmount) > 0.01) {
        const err = new Error(
          `Sum of split amounts (${totalSplit}) does not match expense amount (${numAmount})`
        );
        err.statusCode = 422;
        err.code = 'EXPENSE_SPLIT_MISMATCH';
        throw err;
      }

      return customSplits.map((s) => ({
        userId: s.userId,
        splitAmount: Number(s.splitAmount),
      }));
    }

    if (splitStrategy === 'percentage') {
      const totalPercentage = customSplits.reduce((acc, s) => acc + Number(s.percentage || 0), 0);
      if (Math.abs(totalPercentage - 100) > 0.01) {
        const err = new Error(
          `Sum of percentage splits (${totalPercentage}%) must equal 100%`
        );
        err.statusCode = 422;
        err.code = 'EXPENSE_SPLIT_MISMATCH';
        throw err;
      }

      return customSplits.map((s) => ({
        userId: s.userId,
        splitAmount: Math.round(numAmount * (Number(s.percentage) / 100)),
        percentage: Number(s.percentage),
      }));
    }

    return customSplits;
  }

  async addExpense({
    tripId,
    payerId,
    title,
    amount,
    currency = 'VND',
    category = 'other',
    receiptUrl = null,
    splitStrategy = 'equal',
    notes = null,
    participants = [],
    customSplits = [],
  }) {
    const splits = this.calculateSplits({
      amount,
      splitStrategy,
      participants,
      customSplits,
    });

    return await expenseRepository.createExpense({
      tripId,
      payerId,
      title,
      amount,
      currency,
      category,
      receiptUrl,
      splitStrategy,
      notes,
      splits,
    });
  }

  async getTripExpenses(tripId) {
    return await expenseRepository.findExpensesByTrip(tripId);
  }

  async getExpenseSummary(tripId) {
    const expenses = await expenseRepository.findExpensesByTrip(tripId);
    const settlements = await expenseRepository.findSettlementsByTrip(tripId);
    const itinerary = await itineraryRepository.findById(tripId);

    const membersMap = new Map();

    // 1. Seed members from itinerary collaborators
    if (itinerary && itinerary.collaborators) {
      for (const col of itinerary.collaborators) {
        membersMap.set(col.userId, {
          userId: col.userId,
          totalPaid: 0,
          totalOwed: 0,
          netBalance: 0,
        });
      }
    }

    // 2. Aggregate expenses
    let totalTripExpense = 0;
    for (const exp of expenses) {
      totalTripExpense += Number(exp.amount);

      if (!membersMap.has(exp.payerId)) {
        membersMap.set(exp.payerId, {
          userId: exp.payerId,
          totalPaid: 0,
          totalOwed: 0,
          netBalance: 0,
        });
      }
      const payer = membersMap.get(exp.payerId);
      payer.totalPaid += Number(exp.amount);

      for (const split of exp.splits || []) {
        if (!membersMap.has(split.userId)) {
          membersMap.set(split.userId, {
            userId: split.userId,
            totalPaid: 0,
            totalOwed: 0,
            netBalance: 0,
          });
        }
        const member = membersMap.get(split.userId);
        member.totalOwed += Number(split.splitAmount);
      }
    }

    // 3. Apply confirmed settlements to adjust balances
    for (const s of settlements) {
      if (s.status === 'confirmed') {
        if (!membersMap.has(s.debtorId)) {
          membersMap.set(s.debtorId, { userId: s.debtorId, totalPaid: 0, totalOwed: 0, netBalance: 0 });
        }
        if (!membersMap.has(s.creditorId)) {
          membersMap.set(s.creditorId, { userId: s.creditorId, totalPaid: 0, totalOwed: 0, netBalance: 0 });
        }
        const debtor = membersMap.get(s.debtorId);
        const creditor = membersMap.get(s.creditorId);
        debtor.totalPaid += Number(s.amount);
        creditor.totalOwed += Number(s.amount);
      }
    }

    // 4. Compute Net Balances
    const memberBalances = Array.from(membersMap.values()).map((m) => {
      const net = m.totalPaid - m.totalOwed;
      return {
        userId: m.userId,
        totalPaid: m.totalPaid,
        totalOwed: m.totalOwed,
        netBalance: net,
      };
    });

    return {
      totalTripExpense,
      memberBalances,
    };
  }

  async getSettlementPlan(tripId) {
    const summary = await this.getExpenseSummary(tripId);
    const balances = summary.memberBalances.map((b) => ({
      userId: b.userId,
      netBalance: b.netBalance,
    }));

    const settlementPlan = simplifyDebts(balances);
    return { settlementPlan };
  }

  async recordSettlement({ tripId, debtorId, creditorId, amount, currency = 'VND', proofImageUrl }) {
    return await expenseRepository.createSettlement({
      tripId,
      debtorId,
      creditorId,
      amount,
      currency,
      status: 'pending',
      proofImageUrl,
    });
  }

  async confirmSettlement({ settlementId, status = 'confirmed' }) {
    return await expenseRepository.updateSettlement(settlementId, {
      status,
      settledAt: status === 'confirmed' ? new Date() : null,
    });
  }
}

module.exports = new ExpenseService();
