const request = require('supertest');
const app = require('../../src/app');

describe('Integration Test: Currency Endpoints (GET /api/v1/currency)', () => {
  test('RED-CURR-05: GET /api/v1/currency/latest should return 200 with rates map', async () => {
    const res = await request(app)
      .get('/api/v1/currency/latest?base=USD')
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.base).toBe('USD');
    expect(res.body.data.rates).toBeDefined();
    expect(res.body.data.rates.EUR).toBeDefined();
    expect(res.body.data.rates.VND).toBeDefined();
  });

  test('RED-CURR-06: GET /api/v1/currency/convert should convert amount with 200 OK', async () => {
    const res = await request(app)
      .get('/api/v1/currency/convert?from=EUR&to=USD&amount=100')
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.from).toBe('EUR');
    expect(res.body.data.to).toBe('USD');
    expect(res.body.data.amount).toBe(100);
    expect(res.body.data.convertedAmount).toBeGreaterThan(0);
    expect(res.body.data.rate).toBeGreaterThan(0);
  });

  test('RED-CURR-07: GET /api/v1/currency/convert should return 400 when query params are invalid', async () => {
    const res = await request(app)
      .get('/api/v1/currency/convert?from=TOOLONG&to=USD&amount=-50')
      .expect(400);

    expect(res.body.success).toBe(false);
    expect(res.body.error).toBeDefined();
  });
});
