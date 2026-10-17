const jwt = require('jsonwebtoken');
const {
  generateAccessToken,
  verifyAccessToken,
  generateRefreshToken,
  hashToken,
} = require('../../../src/services/token.service');

describe('Unit Test: Token Service (JWT Access & SHA-256 Refresh Tokens)', () => {
  const userPayload = {
    userId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    email: 'traveler@nomadix.vn',
    role: 'traveler',
  };

  test('RED-04: generateAccessToken should return signed JWT with userId and role in payload', () => {
    const token = generateAccessToken(userPayload);
    expect(typeof token).toBe('string');

    const decoded = jwt.decode(token);
    expect(decoded.userId).toBe(userPayload.userId);
    expect(decoded.email).toBe(userPayload.email);
    expect(decoded.role).toBe(userPayload.role);
    // Expiration check: should be ~15 minutes (900 seconds)
    const expiresInSeconds = decoded.exp - decoded.iat;
    expect(expiresInSeconds).toBe(900);
  });

  test('should default role to traveler if not specified in payload', () => {
    const token = generateAccessToken({
      userId: 'test-user-id',
      email: 'norole@nomadix.vn',
    });
    const decoded = jwt.decode(token);
    expect(decoded.role).toBe('traveler');
  });

  test('RED-05: verifyAccessToken should return decoded payload for valid token', () => {
    const token = generateAccessToken(userPayload);
    const verified = verifyAccessToken(token);
    expect(verified.userId).toBe(userPayload.userId);
  });

  test('RED-06: verifyAccessToken should throw error for expired or tampered token', () => {
    const tampered = 'invalid.jwt.token';
    expect(() => verifyAccessToken(tampered)).toThrow();
  });

  test('RED-07: generateRefreshToken should return raw token and sha256 hash', () => {
    const { rawToken, tokenHash } = generateRefreshToken();
    expect(typeof rawToken).toBe('string');
    expect(rawToken.length).toBeGreaterThanOrEqual(40);
    expect(tokenHash).toBe(hashToken(rawToken));
    expect(tokenHash.length).toBe(64); // SHA-256 hex length
  });
});
