const request = require('supertest');
const app = require('../../src/app');

describe('Integration Test: Demo OTP Endpoints', () => {
  const demoEmail = 'demouser.otp@nomadix.vn';

  test('RED-OTP-DEMO-03: POST /api/v1/auth/verify-otp with "123456" should succeed with 200 OK and verified: true', async () => {
    const res = await request(app)
      .post('/api/v1/auth/verify-otp')
      .send({
        identifier: demoEmail,
        otp: '123456',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.verified).toBe(true);
  });

  test('RED-OTP-DEMO-04: POST /api/v1/auth/register with demo OTP "123456" should activate account with isEmailVerified=true', async () => {
    const registerEmail = 'instant.verified@nomadix.vn';

    const regRes = await request(app)
      .post('/api/v1/auth/register')
      .send({
        fullName: 'Instant Demo User',
        email: registerEmail,
        password: 'StrongDemoPassword123!',
        otp: '123456',
      });

    expect(regRes.status).toBe(201);
    expect(regRes.body.success).toBe(true);
    expect(regRes.body.data.user.isEmailVerified).toBe(true);
  });
});
