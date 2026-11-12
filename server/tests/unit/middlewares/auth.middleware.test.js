const { authenticate } = require('../../../src/middlewares/auth.middleware');
const { generateAccessToken } = require('../../../src/services/token.service');

describe('Unit Test: Authenticate Middleware', () => {
  const userPayload = {
    userId: 'user-uuid-1234',
    email: 'traveler@nomadix.vn',
    role: 'traveler',
  };

  test('RED-IT-03: should authenticate valid Bearer token and attach req.user', async () => {
    const token = generateAccessToken(userPayload);
    const req = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    };
    const res = {};
    const next = jest.fn();

    await authenticate(req, res, next);

    expect(next).toHaveBeenCalledWith();
    expect(req.user).toBeDefined();
    expect(req.user.userId).toBe(userPayload.userId);
    expect(req.user.email).toBe(userPayload.email);
  });

  test('RED-IT-04: should return 401 Unauthorized if authorization header is missing or invalid', async () => {
    const reqNoHeader = { headers: {} };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await authenticate(reqNoHeader, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        error: expect.objectContaining({ code: 'UNAUTHORIZED' }),
      })
    );

    // Tampered token test
    const reqInvalid = { headers: { authorization: 'Bearer invalid.tampered.token' } };
    await authenticate(reqInvalid, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
  });
});
