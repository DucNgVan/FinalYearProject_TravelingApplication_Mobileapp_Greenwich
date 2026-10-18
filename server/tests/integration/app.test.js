const request = require('supertest');
const app = require('../../src/app');

describe('Integration Test: Express App Infrastructure & Healthcheck', () => {
  test('should return 200 UP for GET /health', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('UP');
    expect(res.body.timestamp).toBeDefined();
  });

  test('should return 404 for unknown endpoint', async () => {
    const res = await request(app).get('/api/v1/unknown-route');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });

  test('should handle unhandled errors and return 500', async () => {
    const res = await request(app).get('/test-error');
    expect(res.status).toBe(500);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('INTERNAL_SERVER_ERROR');
    expect(res.body.error.message).toBe('Simulated internal failure');
  });
});
