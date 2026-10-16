import { z } from 'zod';
import { registerSchema, loginSchema } from './auth.zod';
import { createExpenseSchema, settleDebtSchema, expenseSplitItemSchema } from './expense.zod';

export type RegisterDto = z.infer<typeof registerSchema>;
export type LoginDto = z.infer<typeof loginSchema>;
export type CreateExpenseDto = z.infer<typeof createExpenseSchema>;
export type SettleDebtDto = z.infer<typeof settleDebtSchema>;
export type ExpenseSplitItem = z.infer<typeof expenseSplitItemSchema>;
