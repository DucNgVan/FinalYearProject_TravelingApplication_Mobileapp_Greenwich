const authService = require('../../../src/services/auth.service');
const userRepository = require('../../../src/repositories/user.repository');

describe('TDD RED: Auth Profile Fields Persistence (Date of Birth & Phone Number)', () => {
  const testUserEmail = `profile.fields.${Date.now()}@nomadix.vn`;

  test('RED-AUTH-FIELD-01: register() should persist and return dateOfBirth and phoneNumber in user object', async () => {
    const registerPayload = {
      email: testUserEmail,
      password: 'StrongPassword2026!',
      fullName: 'Nguyen Van Duc',
      phoneNumber: '0901234567',
      dateOfBirth: '2000-01-15',
    };

    const res = await authService.register(registerPayload);

    expect(res).toBeDefined();
    expect(res.user).toBeDefined();
    expect(res.user.fullName).toBe('Nguyen Van Duc');
    expect(res.user.phoneNumber).toBe('0901234567');
    expect(res.user.dateOfBirth).toBe('2000-01-15');
    expect(res.accessToken).toBeDefined();
    expect(res.refreshToken).toBeDefined();
  });

  test('RED-AUTH-FIELD-02: login() should return dateOfBirth and phoneNumber in user object', async () => {
    const loginPayload = {
      email: testUserEmail,
      password: 'StrongPassword2026!',
    };

    const res = await authService.login(loginPayload);

    expect(res).toBeDefined();
    expect(res.user).toBeDefined();
    expect(res.user.fullName).toBe('Nguyen Van Duc');
    expect(res.user.phoneNumber).toBe('0901234567');
    expect(res.user.dateOfBirth).toBe('2000-01-15');
  });
});
