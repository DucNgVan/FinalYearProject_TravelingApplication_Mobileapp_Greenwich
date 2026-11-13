/**
 * CurrencyService (Tier 3 Domain Logic & Tier 5 Redis Cache)
 * Implements Cache-Aside pattern for currency rates and performs accurate currency conversion.
 */

const CurrencyRateApiProvider = require('../providers/currency.provider');

class CurrencyService {
  constructor(options = {}) {
    this.provider = options.provider || new CurrencyRateApiProvider();
    this.redis = options.redis || null;
    this.cacheTtlSeconds = options.cacheTtlSeconds || 3600; // 1 hour TTL
  }

  _getCacheKey(base) {
    return `nomadix:currency:latest:${base.toUpperCase()}`;
  }

  async getLatestRates(base = 'USD') {
    const cleanBase = (base || 'USD').trim().toUpperCase();
    const cacheKey = this._getCacheKey(cleanBase);

    // 1. Try Redis cache first
    if (this.redis && typeof this.redis.get === 'function') {
      try {
        const cached = await this.redis.get(cacheKey);
        if (cached) {
          const parsed = JSON.parse(cached);
          return {
            ...parsed,
            source: 'CACHE',
          };
        }
      } catch (_) {
        // Cache read failure: gracefully continue to provider
      }
    }

    // 2. Fetch fresh rates from CurrencyRateApiProvider
    const freshData = await this.provider.getLatestRates(cleanBase);

    // 3. Store in Redis with TTL
    if (this.redis && typeof this.redis.setex === 'function' && freshData && freshData.success) {
      try {
        await this.redis.setex(cacheKey, this.cacheTtlSeconds, JSON.stringify(freshData));
      } catch (_) {
        // Cache write failure: non-blocking
      }
    }

    return {
      ...freshData,
      source: 'LIVE_API',
    };
  }

  async convertCurrency({ from, to, amount }) {
    const cleanFrom = (from || '').trim().toUpperCase();
    const cleanTo = (to || '').trim().toUpperCase();
    const numericAmount = parseFloat(amount) || 0;

    if (!cleanFrom || !cleanTo) {
      throw new Error('From and To currency codes are required');
    }

    if (numericAmount <= 0) {
      throw new Error('Amount must be greater than zero');
    }

    // Fetch base USD rates which covers all pairs
    const ratesData = await this.getLatestRates('USD');
    const rates = ratesData.rates || {};

    const fromRate = rates[cleanFrom];
    const toRate = rates[cleanTo];

    if (!fromRate) {
      throw new Error(`Unsupported source currency: ${cleanFrom}`);
    }

    if (!toRate) {
      throw new Error(`Unsupported target currency: ${cleanTo}`);
    }

    // Calculate cross exchange rate: 1 FROM = X TO
    // Rate in USD base: fromAmount in USD = amount / fromRate. ToAmount = (amount / fromRate) * toRate
    const exchangeRate = toRate / fromRate;
    const rawConverted = numericAmount * exchangeRate;
    const convertedAmount = Number(rawConverted.toFixed(2));

    return {
      success: true,
      from: cleanFrom,
      to: cleanTo,
      amount: numericAmount,
      rate: Number(exchangeRate.toFixed(6)),
      convertedAmount,
      date: ratesData.date,
      lastUpdated: ratesData.lastUpdated,
      isFallback: ratesData.isFallback || false,
    };
  }
}

module.exports = CurrencyService;
