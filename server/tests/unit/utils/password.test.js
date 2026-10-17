const { hashPassword, comparePassword } = require('../../../src/utils/password.util');

describe('Unit Test: Password Utility (Bcrypt 12 rounds)', () => {
  const plainPassword = 'SuperSecretPassword2026!';

  test('RED-01: hashPassword should return a valid bcrypt hash with 12 rounds prefix $2b$12$ or $2a$12$', async () => {
    const hash = await hashPassword(plainPassword);
    expect(hash).toBeDefined();
    expect(typeof hash).toBe('string');
    // Bcrypt format check: $2a$12$ or $2b$12$
    expect(hash).toMatch(/^\$2[ab]\$12\$/);
  });

  test('RED-02: comparePassword should return true when password matches hash', async () => {
    const hash = await hashPassword(plainPassword);
    const isMatch = await comparePassword(plainPassword, hash);
    expect(isMatch).toBe(true);
  });

  test('RED-03: comparePassword should return false when password does not match hash', async () => {
    const hash = await hashPassword(plainPassword);
    const isMatch = await comparePassword('WrongPassword123!', hash);
    expect(isMatch).toBe(false);
  });
});
