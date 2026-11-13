import { create } from 'zustand';
import client from '../api/client';

export const DEFAULT_CURRENCY_RATES = {
  USD: 1.0,
  EUR: 0.8661, // 1 EUR = 1.1546 USD
  VND: 25400.0,
  JPY: 154.2,
  GBP: 0.78,
  SGD: 1.34,
  AUD: 1.52,
  CAD: 1.38,
  CHF: 0.88,
  THB: 34.5,
};

export const AVAILABLE_CURRENCIES = [
  'EUR',
  'USD',
  'VND',
  'GBP',
  'JPY',
  'SGD',
  'THB',
  'AUD',
  'CAD',
  'CHF',
];

export const useCurrencyStore = create((set, get) => ({
  base: 'USD',
  rates: { ...DEFAULT_CURRENCY_RATES },
  availableCurrencies: AVAILABLE_CURRENCIES,
  lastUpdated: new Date().toISOString().split('T')[0],
  isLoading: false,
  error: null,
  isLive: true,

  fetchRates: async (base = 'USD', clientOverride = null) => {
    set({ isLoading: true, error: null });
    const cleanBase = (base || 'USD').trim().toUpperCase();

    try {
      let data = null;

      if (typeof clientOverride === 'function') {
        const customRes = await clientOverride(cleanBase);
        data = customRes?.data || customRes;
      } else {
        try {
          const res = await client.get(`/currency/latest?base=${cleanBase}`);
          data = res?.data || res;
        } catch (apiErr) {
          // Direct fallback to CurrencyRateAPI if backend API is temporarily offline
          if (typeof fetch === 'function') {
            const extRes = await fetch(`https://currencyrateapi.com/api/latest?base=${cleanBase}`);
            if (extRes.ok) {
              const extData = await extRes.json();
              if (extData && extData.rates) {
                const normalized = {};
                for (const [k, v] of Object.entries(extData.rates)) {
                  normalized[k.toUpperCase()] = parseFloat(v);
                }
                normalized[cleanBase] = 1.0;
                if (!normalized.VND) normalized.VND = 25750.0;
                data = {
                  base: cleanBase,
                  rates: normalized,
                  date: extData.date,
                };
              }
            }
          }
        }
      }

      if (data && data.rates) {
        set({
          base: data.base || cleanBase,
          rates: { ...get().rates, ...data.rates },
          lastUpdated: data.date || new Date().toISOString().split('T')[0],
          isLoading: false,
          isLive: true,
        });
      } else {
        set({ isLoading: false });
      }
    } catch (err) {
      set({
        isLoading: false,
        error: err.message || 'Failed to fetch currency rates',
      });
    }
  },

  getRate: (from, to) => {
    const { rates } = get();
    const cleanFrom = (from || 'EUR').trim().toUpperCase();
    const cleanTo = (to || 'USD').trim().toUpperCase();

    if (cleanFrom === cleanTo) return 1.0;

    const rateFrom = rates[cleanFrom] || 1.0;
    const rateTo = rates[cleanTo] || 1.0;

    return rateTo / rateFrom;
  },

  convert: (amount, from, to) => {
    const numericAmount = parseFloat(amount) || 0;
    if (numericAmount === 0) return '0.00';

    const exchangeRate = get().getRate(from, to);
    const converted = numericAmount * exchangeRate;

    // For VND without decimals, for others 2 decimals
    const cleanTo = (to || '').trim().toUpperCase();
    if (cleanTo === 'VND') {
      return Math.round(converted).toString();
    }
    return converted.toFixed(2);
  },
}));
