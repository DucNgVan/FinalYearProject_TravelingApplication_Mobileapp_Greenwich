import { useCurrencyStore } from '../../../src/stores/currency.store';

describe('Unit Test: Currency Store (Zustand)', () => {
  beforeEach(() => {
    useCurrencyStore.setState({
      base: 'USD',
      rates: {
        USD: 1,
        EUR: 0.90,
        VND: 25000,
        JPY: 150,
        GBP: 0.80,
      },
      lastUpdated: '2026-11-13',
      isLoading: false,
      error: null,
    });
  });

  test('RED-FE-CURR-01: store initializes with default rates and updates when fetchRates is called', async () => {
    const store = useCurrencyStore.getState();
    expect(store.rates.USD).toBe(1);
    expect(store.rates.EUR).toBe(0.90);

    const mockApiResponse = {
      success: true,
      data: {
        base: 'USD',
        rates: { USD: 1, EUR: 0.92, VND: 25400 },
        date: '2026-11-13',
      },
    };

    // Inject mock client or test fetch
    const fetchPromise = store.fetchRates('USD', async () => mockApiResponse);
    await fetchPromise;

    const updated = useCurrencyStore.getState();
    expect(updated.rates.EUR).toBe(0.92);
    expect(updated.rates.VND).toBe(25400);
  });

  test('RED-FE-CURR-02: convert calculates conversion between any two currencies', () => {
    const store = useCurrencyStore.getState();
    // 100 EUR to USD with rates USD=1, EUR=0.90 => 100 / 0.90 * 1 = 111.11
    const res = store.convert(100, 'EUR', 'USD');
    expect(Number(res)).toBeCloseTo(111.11, 2);

    // 10 USD to VND with rates USD=1, VND=25000 => 250000
    const resVnd = store.convert(10, 'USD', 'VND');
    expect(Number(resVnd)).toBe(250000);
  });
});
