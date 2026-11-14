const otpService = require('../../../src/services/otp.service');

describe('Unit Test: Universal Demo OTP Verification', () => {
  beforeEach(() => {
    if (otpService && otpService.clearAll) {
      otpService.clearAll();
    }
  });

  test('RED-OTP-DEMO-01: verifyOtp should accept universal demo OTP "123456" for any identifier', async () => {
    const testIdentifier = 'demo.traveler@nomadix.vn';
    
    // Note: No generateAndStoreOtp called beforehand - demo OTP should work out of the box
    const isValid = await otpService.verifyOtp(testIdentifier, '123456');
    expect(isValid).toBe(true);
  });

  test('RED-OTP-DEMO-02: verifyOtp should reject wrong OTP codes like "999999" when not generated', async () => {
    const testIdentifier = 'demo.traveler@nomadix.vn';
    const isWrongValid = await otpService.verifyOtp(testIdentifier, '999999');
    expect(isWrongValid).toBe(false);
  });
});
