const CurrencyService = require('../../../src/services/currency.service');

describe('Unit Test: CurrencyService (Tier 3 Business Logic & Tier 5 Redis Cache)', () => {
  let mockProvider;
  let mockRedis;
  let service;

  beforeEach(() => {
    mockProvider = {
      getLatestRates: jest.fn().mockResolvedValue({
        success: true,
        base: 'USD',
        date: '2026-11-13',
        rates: {
          USD: 1,
          EUR: 0.90,
          VND: 25000,
          JPY: 150,
          GBP: 0.80,
        },
        lastUpdated: 1794548403,
      }),
    };

    mockRedis = {
      get: jest.fn().mockResolvedValue(null),
      setex: jest.fn().mockResolvedValue('OK'),
    };

    service = new CurrencyService({ provider: mockProvider, redis: mockRedis });
  });

  test('RED-CURR-03: getLatestRates should query Redis cache first, call provider on miss, and save with 3600s TTL', async () => {
    // 1. First call: Cache miss
    const res1 = await service.getLatestRates('USD');
    expect(mockRedis.get).toHaveBeenCalledWith('nomadix:currency:latest:USD');
    expect(mockProvider.getLatestRates).toHaveBeenCalledWith('USD');
    expect(mockRedis.setex).toHaveBeenCalledWith(
      'nomadix:currency:latest:USD',
      3600,
      expect.any(String)
    );
    expect(res1.rates.EUR).toBe(0.90);

    // 2. Second call: Cache hit
    mockRedis.get.mockResolvedValue(
      JSON.stringify({
        success: true,
        base: 'USD',
        rates: { USD: 1, EUR: 0.90, VND: 25000 },
        source: 'CACHE',
      })
    );
    const res2 = await service.getLatestRates('USD');
    expect(res2.source).toBe('CACHE');
    expect(mockProvider.getLatestRates).toHaveBeenCalledTimes(1); // Not called again
  });

  test('RED-CURR-04: convertCurrency should convert cross rates accurately', async () => {
    // Convert 100 EUR to USD (with rates USD=1, EUR=0.90) => 100 / 0.90 * 1 = 111.11 USD
    const conversion = await service.convertCurrency({
      from: 'EUR',
      to: 'USD',
      amount: 100,
    });

    expect(conversion.from).toBe('EUR');
    expect(conversion.to).toBe('USD');
    expect(conversion.amount).toBe(100);
    expect(conversion.rate).toBeCloseTo(1 / 0.90, 2);
    expect(conversion.convertedAmount).toBeCloseTo(111.11, 2);

    // Convert 10 USD to VND (with rates USD=1, VND=25000) => 10 * 25000 = 250000 VND
    const toVnd = await service.convertCurrency({
      from: 'USD',
      to: 'VND',
      amount: 10,
    });
    expect(toVnd.convertedAmount).toBe(250000);
  });
});
