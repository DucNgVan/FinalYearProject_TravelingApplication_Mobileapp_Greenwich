const { z } = require('zod');

const expenseSplitItemSchema = z.object({
  userId: z.string({ required_error: 'User ID is required' }).min(1),
  splitValue: z.number({ required_error: 'Split value is required' }).nonnegative('Split value cannot be negative'),
});

const createExpenseSchema = z.object({
  tripId: z.string({ required_error: 'Trip ID is required' }).min(1),
  payerId: z.string({ required_error: 'Payer ID is required' }).min(1),
  title: z
    .string({ required_error: 'Title is required' })
    .min(1, 'Title cannot be empty')
    .trim(),
  amount: z
    .number({ required_error: 'Amount is required' })
    .positive('Amount must be positive'),
  splitType: z.enum(['equal', 'exact', 'percentage', 'shares'], {
    errorMap: () => ({ message: "splitType must be 'equal', 'exact', 'percentage', or 'shares'" }),
  }),
  receiptUrl: z.string().url('Invalid receipt URL').optional(),
  splits: z
    .array(expenseSplitItemSchema)
    .min(1, 'Expense must contain at least one split participant'),
});

const settleDebtSchema = z.object({
  tripId: z.string({ required_error: 'Trip ID is required' }).min(1),
  debtorId: z.string({ required_error: 'Debtor ID is required' }).min(1),
  creditorId: z.string({ required_error: 'Creditor ID is required' }).min(1),
  amount: z
    .number({ required_error: 'Amount is required' })
    .positive('Settlement amount must be positive'),
});

module.exports = {
  expenseSplitItemSchema,
  createExpenseSchema,
  settleDebtSchema,
};
