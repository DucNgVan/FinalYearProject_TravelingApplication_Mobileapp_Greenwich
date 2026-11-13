const CurrencyRateApiProvider = require('../../../src/providers/currency.provider');

describe('Unit Test: CurrencyRateApiProvider (Tier 4 Adapter)', () => {
  let provider;

  beforeEach(() => {
    provider = new CurrencyRateApiProvider();
  });

  test('RED-CURR-01: getLatestRates should fetch from CurrencyRateAPI and normalize rates into uppercase keys', async () => {
    const mockRawResponse = {
      success: true,
      base: 'usd',
      date: '2026-11-13',
      rates: {
        eur: '0.90469',
        gbp: '0.75619',
        jpy: '159.248',
        vnd: '25749.5',
        usd: '1',
      },
      last_update_unix: '1794548403',
    };

    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockRawResponse),
    });

    const customProvider = new CurrencyRateApiProvider({ fetchClient: mockFetch });
    const result = await customProvider.getLatestRates('USD');

    expect(result.success).toBe(true);
    expect(result.base).toBe('USD');
    expect(result.rates.EUR).toBeCloseTo(0.90469);
    expect(result.rates.GBP).toBeCloseTo(0.75619);
    expect(result.rates.JPY).toBeCloseTo(159.248);
    expect(result.rates.VND).toBeCloseTo(25749.5);
    expect(result.rates.USD).toBe(1);
    expect(result.lastUpdated).toBeDefined();
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('https://currencyrateapi.com/api/latest?base=USD'),
      expect.any(Object)
    );
  });

  test('RED-CURR-02: getLatestRates should fallback to reliable default offline rates on network failure', async () => {
    const mockFailingFetch = jest.fn().mockRejectedValue(new Error('Network connection timeout'));
    const fallbackProvider = new CurrencyRateApiProvider({ fetchClient: mockFailingFetch });

    const result = await fallbackProvider.getLatestRates('USD');

    expect(result.success).toBe(true);
    expect(result.base).toBe('USD');
    expect(result.rates.EUR).toBeDefined();
    expect(result.rates.VND).toBeDefined();
    expect(result.rates.USD).toBe(1);
    expect(result.isFallback).toBe(true);
  });
});
