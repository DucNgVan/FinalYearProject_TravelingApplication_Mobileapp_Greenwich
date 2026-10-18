const request = require('supertest');
const app = require('../../src/app');

describe('Integration Test: POST /api/v1/auth/login (TDD RED Phase)', () => {
  const credentials = {
    email: 'traveler@nomadix.vn',
    password: 'CorrectPassword2026!',
  };

  test('RED-11: should login successfully and return 200 with tokens and user profile', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send(credentials);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.accessToken).toBeDefined();
    expect(res.body.data.refreshToken).toBeDefined();
    expect(res.body.data.user.email).toBe(credentials.email.toLowerCase());
  });

  test('RED-12: should return 401 Unauthorized when password is incorrect', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: credentials.email,
        password: 'WrongPassword!',
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('INVALID_CREDENTIALS');
  });

  test('RED-13: should return 401 Unauthorized when account does not exist', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'nonexistent@nomadix.vn',
        password: 'AnyPassword2026!',
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
