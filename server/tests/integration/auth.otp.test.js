const request = require('supertest');
const app = require('../../src/app');

describe('Integration Test: OTP Email/Phone Verification Endpoints', () => {
  const testEmail = 'traveler.otp@nomadix.vn';

  test('RED-OTP-05: POST /api/v1/auth/send-otp should generate and send OTP with 200 OK', async () => {
    const res = await request(app)
      .post('/api/v1/auth/send-otp')
      .send({
        identifier: testEmail,
        type: 'email',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeDefined();
    expect(res.body.data.identifier).toBe(testEmail);
    expect(res.body.data.expiresInSeconds).toBe(300);
  });

  test('RED-OTP-06: POST /api/v1/auth/verify-otp should verify OTP and reject invalid OTP', async () => {
    // 1. Send OTP first to generate code
    const sendRes = await request(app)
      .post('/api/v1/auth/send-otp')
      .send({
        identifier: 'second.test@nomadix.vn',
        type: 'email',
      });
    expect(sendRes.status).toBe(200);
    const otp = sendRes.body.data.devOtp;

    // 2. Test wrong OTP -> 400 Bad Request
    const wrongRes = await request(app)
      .post('/api/v1/auth/verify-otp')
      .send({
        identifier: 'second.test@nomadix.vn',
        otp: '000000',
      });
    expect(wrongRes.status).toBe(400);
    expect(wrongRes.body.success).toBe(false);

    // 3. Test correct OTP -> 200 OK
    if (otp) {
      const correctRes = await request(app)
        .post('/api/v1/auth/verify-otp')
        .send({
          identifier: 'second.test@nomadix.vn',
          otp,
        });
      expect(correctRes.status).toBe(200);
      expect(correctRes.body.success).toBe(true);
      expect(correctRes.body.data.verified).toBe(true);
    }
  });

  test('RED-OTP-07: POST /api/v1/auth/register with valid OTP should activate account with isEmailVerified=true', async () => {
    const registerEmail = 'verified.user@nomadix.vn';

    const sendRes = await request(app)
      .post('/api/v1/auth/send-otp')
      .send({
        identifier: registerEmail,
        type: 'email',
      });
    const otp = sendRes.body.data?.devOtp;

    if (otp) {
      const regRes = await request(app)
        .post('/api/v1/auth/register')
        .send({
          fullName: 'Verified Traveler',
          email: registerEmail,
          password: 'StrongPassword123!',
          otp,
        });

      expect(regRes.status).toBe(201);
      expect(regRes.body.success).toBe(true);
      expect(regRes.body.data.user.isEmailVerified).toBe(true);
    }
  });
});
