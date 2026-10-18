const request = require('supertest');
const app = require('../../src/app');

describe('Integration Test: POST /api/v1/auth/register (TDD RED Phase)', () => {
  const validRegistrationPayload = {
    email: 'newtraveler@nomadix.vn',
    password: 'SecurePassword2026!',
    fullName: 'Nguyen Van Duc',
  };

  test('RED-08: should register user successfully and return 201 with user DTO and tokens', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send(validRegistrationPayload);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeDefined();
    expect(res.body.data.user.email).toBe(validRegistrationPayload.email.toLowerCase());
    expect(res.body.data.user.fullName).toBe(validRegistrationPayload.fullName);
    // Security check: password_hash must never be leaked
    expect(res.body.data.user.password_hash).toBeUndefined();
    expect(res.body.data.user.password).toBeUndefined();
    // Tokens check
    expect(res.body.data.accessToken).toBeDefined();
    expect(res.body.data.refreshToken).toBeDefined();
  });

  test('RED-09: should return 400 Bad Request when password has fewer than 8 characters', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        ...validRegistrationPayload,
        email: 'another@nomadix.vn',
        password: 'short',
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBeDefined();
  });

  test('RED-10: should return 400 Bad Request when email format is invalid', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        ...validRegistrationPayload,
        email: 'invalid-email-format',
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test('RED-08b: should return 409 Conflict when email is already registered', async () => {
    // Attempt to register with the same email that was registered in RED-08
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send(validRegistrationPayload);

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('EMAIL_ALREADY_EXISTS');
  });
});
