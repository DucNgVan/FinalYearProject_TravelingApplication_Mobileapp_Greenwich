import { create } from 'zustand';
import apiClient from '../api/client';

export const useExpenseStore = create((set, get) => ({
  expenses: [],
  debtSummary: null,
  isLoading: false,
  error: null,

  fetchTripExpenses: async (tripId) => {
    set({ isLoading: true, error: null });
    try {
      const data = await apiClient.get(`/trips/${tripId}/expenses`);
      const expenseList = Array.isArray(data) ? data : (data?.expenses || []);
      set({ expenses: expenseList, isLoading: false });
      return expenseList;
    } catch (err) {
      set({ error: err.message || 'Failed to load expenses', isLoading: false });
      throw err;
    }
  },

  addExpense: async (tripId, expensePayload) => {
    set({ isLoading: true, error: null });
    try {
      const createdExpense = await apiClient.post(`/trips/${tripId}/expenses`, expensePayload);
      set((state) => ({
        expenses: [createdExpense, ...state.expenses],
        isLoading: false,
      }));
      // Auto-refresh debt summary after new expense
      await get().fetchDebtSummary(tripId);
      return createdExpense;
    } catch (err) {
      set({ error: err.message || 'Failed to create expense', isLoading: false });
      throw err;
    }
  },

  fetchDebtSummary: async (tripId) => {
    set({ isLoading: true, error: null });
    try {
      const summary = await apiClient.get(`/trips/${tripId}/debts`);
      set({ debtSummary: summary, isLoading: false });
      return summary;
    } catch (err) {
      set({ error: err.message || 'Failed to calculate debt summary', isLoading: false });
      throw err;
    }
  },

  settleDebt: async (tripId, settlementPayload) => {
    set({ isLoading: true, error: null });
    try {
      const result = await apiClient.post(`/trips/${tripId}/debts/settle`, settlementPayload);
      // Re-fetch updated debt summary after settlement
      await get().fetchDebtSummary(tripId);
      set({ isLoading: false });
      return result;
    } catch (err) {
      set({ error: err.message || 'Failed to settle debt', isLoading: false });
      throw err;
    }
  },
}));
