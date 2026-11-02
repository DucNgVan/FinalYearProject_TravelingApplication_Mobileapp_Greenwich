const express = require('express');
const expenseController = require('../controllers/expense.controller');
const { authenticate } = require('../middlewares/auth.middleware');

const router = express.Router({ mergeParams: true });

// Protect all group expense & debt endpoints with Bearer JWT authentication
router.use(authenticate);

// Receipt Upload (before /:tripId/expenses/:expenseId if any)
router.post('/:tripId/expenses/receipt', (req, res, next) =>
  expenseController.uploadReceipt(req, res, next)
);

// Expense Summary & Balance Sheet
router.get('/:tripId/expenses/summary', (req, res, next) =>
  expenseController.getSummary(req, res, next)
);

// Group Expenses CRUD
router.post('/:tripId/expenses', (req, res, next) =>
  expenseController.createExpense(req, res, next)
);
router.get('/:tripId/expenses', (req, res, next) =>
  expenseController.getExpenses(req, res, next)
);

// Debt Summary & Aggregate Balance Sheet
router.get('/:tripId/debts', (req, res, next) =>
  expenseController.getDebts(req, res, next)
);

// Debt Simplification Plan
router.get('/:tripId/debts/settlement-plan', (req, res, next) =>
  expenseController.getSettlementPlan(req, res, next)
);

// Settle Up & Settlement Lifecycle
router.post('/:tripId/debts/settle', (req, res, next) =>
  expenseController.recordSettlement(req, res, next)
);
router.patch('/:tripId/debts/settlements/:settlementId', (req, res, next) =>
  expenseController.confirmSettlement(req, res, next)
);

module.exports = router;
