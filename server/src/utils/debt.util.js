/**
 * Debt Simplification Utility using Greedy Minimum Cash-Flow Algorithm
 * Reduces an O(N^2) cross-debt network into at most N-1 transactions
 * Time Complexity: O(N log N) using greedy matching on sorted debtor/creditor balances
 */

function simplifyDebts(balances = []) {
  if (!balances || balances.length === 0) {
    return [];
  }

  // 1. Verify mathematical zero-sum balance invariant: Σ NetBalance_i = 0
  const totalNet = balances.reduce((sum, b) => sum + Number(b.netBalance || 0), 0);
  if (Math.abs(totalNet) > 0.01) {
    throw new Error('Net balances must sum to zero across all squad members');
  }

  // 2. Separate into debtors (< 0) and creditors (> 0)
  const debtors = [];
  const creditors = [];

  for (const b of balances) {
    const net = Number(b.netBalance || 0);
    if (net < -0.001) {
      debtors.push({ userId: b.userId, amount: -net });
    } else if (net > 0.001) {
      creditors.push({ userId: b.userId, amount: net });
    }
  }

  // If squad is balanced, no settlements required
  if (debtors.length === 0 || creditors.length === 0) {
    return [];
  }

  const transactions = [];

  // 3. Greedy Matching: Pair largest debtor with largest creditor
  while (debtors.length > 0 && creditors.length > 0) {
    // Sort descending by amount
    debtors.sort((a, b) => b.amount - a.amount);
    creditors.sort((a, b) => b.amount - a.amount);

    const maxDebtor = debtors[0];
    const maxCreditor = creditors[0];

    const settlementAmount = Math.round(Math.min(maxDebtor.amount, maxCreditor.amount) * 100) / 100;

    transactions.push({
      fromUserId: maxDebtor.userId,
      toUserId: maxCreditor.userId,
      amount: settlementAmount,
    });

    maxDebtor.amount -= settlementAmount;
    maxCreditor.amount -= settlementAmount;

    if (maxDebtor.amount < 0.001) {
      debtors.shift();
    }
    if (maxCreditor.amount < 0.001) {
      creditors.shift();
    }
  }

  return transactions;
}

module.exports = {
  simplifyDebts,
};
