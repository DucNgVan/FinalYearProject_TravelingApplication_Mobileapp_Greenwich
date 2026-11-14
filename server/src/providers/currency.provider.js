/**
 * CurrencyRateApiProvider (Tier 4 Adapter)
 * Connects to CurrencyRateAPI (https://currencyrateapi.com/api/latest?base=USD)
 * Standardizes currency rates and provides resilient offline fallback.
 */

const DEFAULT_RATES_USD = {
  USD: 1.0,
  EUR: 0.9047,
  GBP: 0.7562,
  JPY: 159.25,
  VND: 25749.5,
  SGD: 1.2891,
  AUD: 1.4683,
  CAD: 1.4268,
  CHF: 0.8362,
  THB: 33.25,
};

class CurrencyRateApiProvider {
  constructor(options = {}) {
    this.fetchClient = options.fetchClient || globalThis.fetch;
    this.baseUrl = options.baseUrl || 'https://currencyrateapi.com/api/latest';
  }

  async getLatestRates(base = 'USD') {
    const cleanBase = (base || 'USD').trim().toUpperCase();

    try {
      if (!this.fetchClient) {
        throw new Error('No fetch client available in current environment');
      }

      const url = `${this.baseUrl}?base=${cleanBase}`;
      const signal = typeof AbortSignal !== 'undefined' && AbortSignal.timeout ? AbortSignal.timeout(2500) : undefined;
      const response = await this.fetchClient(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'User-Agent': 'Nomadix-Travel-App/1.0',
        },
        signal,
      });

      if (!response || !response.ok) {
        throw new Error(`CurrencyRateAPI HTTP error with status: ${response ? response.status : 'null'}`);
      }

      const data = await response.json();
      if (!data || !data.rates) {
        throw new Error('Invalid payload received from CurrencyRateAPI');
      }

      const normalizedRates = {};
      for (const [key, value] of Object.entries(data.rates)) {
        const upperKey = key.toUpperCase();
        const numVal = parseFloat(value);
        if (!isNaN(numVal)) {
          normalizedRates[upperKey] = numVal;
        }
      }

      // Ensure base is exactly 1 if missing
      normalizedRates[cleanBase] = 1.0;

      // Ensure essential travel currencies like VND are always mapped if missing from free-tier subset
      if (!normalizedRates.VND) {
        normalizedRates.VND = 25750.0;
      }

      return {
        success: true,
        base: cleanBase,
        date: data.date || new Date().toISOString().split('T')[0],
        rates: normalizedRates,
        lastUpdated: data.last_update_unix ? Number(data.last_update_unix) : Math.floor(Date.now() / 1000),
        isFallback: false,
      };
    } catch (err) {
      // Resilient Fallback: compute relative to cleanBase if base is not USD
      const fallbackRates = {};
      const baseInUsd = DEFAULT_RATES_USD[cleanBase] || 1.0;

      for (const [k, v] of Object.entries(DEFAULT_RATES_USD)) {
        fallbackRates[k] = Number((v / baseInUsd).toFixed(6));
      }
      fallbackRates[cleanBase] = 1.0;

      return {
        success: true,
        base: cleanBase,
        date: new Date().toISOString().split('T')[0],
        rates: fallbackRates,
        lastUpdated: Math.floor(Date.now() / 1000),
        isFallback: true,
        error: err.message,
      };
    }
  }
}

module.exports = CurrencyRateApiProvider;
