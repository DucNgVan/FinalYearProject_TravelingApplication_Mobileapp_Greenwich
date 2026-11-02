const expenseService = require('../services/expense.service');
const cloudinaryProvider = require('../providers/cloudinary.provider');

class ExpenseController {
  async createExpense(req, res, next) {
    try {
      const { tripId } = req.params;
      const payerId = req.user.userId;
      const {
        title,
        amount,
        currency,
        category,
        receiptUrl,
        splitStrategy,
        notes,
        participants,
        customSplits,
      } = req.body;

      const expense = await expenseService.addExpense({
        tripId,
        payerId,
        title,
        amount,
        currency,
        category,
        receiptUrl,
        splitStrategy,
        notes,
        participants,
        customSplits,
      });

      return res.status(201).json({
        success: true,
        data: { expense },
      });
    } catch (err) {
      next(err);
    }
  }

  async getExpenses(req, res, next) {
    try {
      const { tripId } = req.params;
      const expenses = await expenseService.getTripExpenses(tripId);

      return res.status(200).json({
        success: true,
        data: { expenses },
      });
    } catch (err) {
      next(err);
    }
  }

  async uploadReceipt(req, res, next) {
    try {
      const { tripId } = req.params;
      const { image, fileName } = req.body;

      const result = await cloudinaryProvider.uploadReceipt({
        tripId,
        fileData: image,
        fileName,
      });

      return res.status(201).json({
        success: true,
        data: { receiptUrl: result.receiptUrl },
      });
    } catch (err) {
      next(err);
    }
  }

  async getSummary(req, res, next) {
    try {
      const { tripId } = req.params;
      const summary = await expenseService.getExpenseSummary(tripId);

      return res.status(200).json({
        success: true,
        data: summary,
      });
    } catch (err) {
      next(err);
    }
  }

  async getSettlementPlan(req, res, next) {
    try {
      const { tripId } = req.params;
      const result = await expenseService.getSettlementPlan(tripId);

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async getDebts(req, res, next) {
    try {
      const { tripId } = req.params;
      const summary = await expenseService.getExpenseSummary(tripId);
      const plan = await expenseService.getSettlementPlan(tripId);

      return res.status(200).json({
        success: true,
        data: {
          totalExpense: summary.totalTripExpense,
          memberBalances: summary.memberBalances,
          simplifiedSettlements: plan.settlementPlan,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  async recordSettlement(req, res, next) {
    try {
      const { tripId } = req.params;
      const { debtorId, creditorId, amount, currency, proofImageUrl } = req.body;

      const settlement = await expenseService.recordSettlement({
        tripId,
        debtorId,
        creditorId,
        amount,
        currency,
        proofImageUrl,
      });

      return res.status(201).json({
        success: true,
        data: { settlement },
      });
    } catch (err) {
      next(err);
    }
  }

  async confirmSettlement(req, res, next) {
    try {
      const { settlementId } = req.params;
      const { status } = req.body;

      const settlement = await expenseService.confirmSettlement({
        settlementId,
        status,
      });

      return res.status(200).json({
        success: true,
        data: { settlement },
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ExpenseController();
