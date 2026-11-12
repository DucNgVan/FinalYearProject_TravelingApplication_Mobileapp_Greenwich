let otpService;
try {
  otpService = require('../../../../server/src/services/otp.service');
} catch (e) {
  otpService = null;
}

describe('Unit Test: OTP Service (Email & Phone Verification)', () => {
  beforeEach(() => {
    if (otpService && otpService.clearAll) {
      otpService.clearAll();
    }
  });

  test('RED-OTP-01: generateAndStoreOtp should generate a 6-digit numeric string with 300s TTL', async () => {
    expect(otpService).not.toBeNull();
    const identifier = 'traveler@nomadix.vn';
    const result = await otpService.generateAndStoreOtp(identifier, 'email');

    expect(result).toBeDefined();
    expect(result.otp).toMatch(/^\d{6}$/);
    expect(result.expiresInSeconds).toBe(300);
    expect(result.cooldownSeconds).toBe(60);
  });

  test('RED-OTP-02: verifyOtp should validate matching OTP and immediately delete it (single-use)', async () => {
    expect(otpService).not.toBeNull();
    const identifier = 'traveler@nomadix.vn';
    const { otp } = await otpService.generateAndStoreOtp(identifier, 'email');

    const isValid = await otpService.verifyOtp(identifier, otp);
    expect(isValid).toBe(true);

    // Replay attempt must fail because OTP is single-use
    const isReplayValid = await otpService.verifyOtp(identifier, otp);
    expect(isReplayValid).toBe(false);
  });

  test('RED-OTP-03: verifyOtp should reject wrong OTP and track failed attempts', async () => {
    expect(otpService).not.toBeNull();
    const identifier = '0987654321';
    await otpService.generateAndStoreOtp(identifier, 'phone');

    const isWrongValid = await otpService.verifyOtp(identifier, '000000');
    expect(isWrongValid).toBe(false);
  });

  test('RED-OTP-04: generateAndStoreOtp should enforce 60s cooldown to prevent spamming', async () => {
    expect(otpService).not.toBeNull();
    const identifier = 'spam@nomadix.vn';
    await otpService.generateAndStoreOtp(identifier, 'email');

    // Immediate second call should throw cooldown error
    await expect(otpService.generateAndStoreOtp(identifier, 'email')).rejects.toThrow(
      /vui lòng đợi|cooldown|please wait/i
    );
  });
});
