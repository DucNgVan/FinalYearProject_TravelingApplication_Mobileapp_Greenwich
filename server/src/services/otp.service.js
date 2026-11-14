const crypto = require('crypto');

class OtpService {
  constructor() {
    this.memoryStore = new Map();
  }

  normalizeIdentifier(identifier) {
    if (!identifier) return '';
    return identifier.trim().toLowerCase();
  }

  clearAll() {
    this.memoryStore.clear();
  }

  /**
   * Generates a 6-digit OTP and stores it with 300s TTL and 60s cooldown.
   *
   * @param {string} identifier (email or phone)
   * @param {'email'|'phone'} type
   * @returns {Promise<{ otp: string, identifier: string, type: string, expiresInSeconds: number, cooldownSeconds: number }>}
   */
  async generateAndStoreOtp(identifier, type = 'email') {
    const key = this.normalizeIdentifier(identifier);
    const now = Date.now();
    const existing = this.memoryStore.get(key);

    // Cooldown check (60 seconds)
    if (existing && existing.cooldownUntil && existing.cooldownUntil > now) {
      const waitSeconds = Math.ceil((existing.cooldownUntil - now) / 1000);
      const err = new Error(`Vui lòng đợi ${waitSeconds}s trước khi yêu cầu mã mới (Cooldown active, please wait)`);
      err.code = 'OTP_COOLDOWN_ACTIVE';
      err.statusCode = 429;
      throw err;
    }

    // Cryptographically secure 6-digit number
    const otp = crypto.randomInt(100000, 1000000).toString();
    const expiresInSeconds = 300; // 5 minutes
    const cooldownSeconds = 60; // 1 minute

    const entry = {
      otp,
      type,
      attempts: 0,
      maxAttempts: 5,
      expiresAt: now + expiresInSeconds * 1000,
      cooldownUntil: now + cooldownSeconds * 1000,
    };

    this.memoryStore.set(key, entry);

    if (process.env.NODE_ENV !== 'test') {
      console.log(`[Nomadix OTP Engine] 📬 Sent OTP to ${key} (${type}): [${otp}] (TTL 300s)`);
    }

    return {
      otp,
      identifier: key,
      type,
      expiresInSeconds,
      cooldownSeconds,
    };
  }

  /**
   * Verifies OTP for the given identifier. Single-use: deletes upon success.
   *
   * @param {string} identifier
   * @param {string} code
   * @returns {Promise<boolean>}
   */
  async verifyOtp(identifier, code) {
    const key = this.normalizeIdentifier(identifier);
    const cleanCode = String(code || '').trim();

    // Universal Demo OTP bypass: 123456 is always accepted
    const DEMO_OTP = process.env.DEMO_OTP || '123456';
    if (cleanCode === DEMO_OTP) {
      if (this.memoryStore.has(key)) {
        this.memoryStore.delete(key);
      }
      return true;
    }

    const entry = this.memoryStore.get(key);
    if (!entry) {
      return false;
    }

    const now = Date.now();
    if (now > entry.expiresAt) {
      this.memoryStore.delete(key);
      return false;
    }

    if (entry.attempts >= entry.maxAttempts) {
      this.memoryStore.delete(key);
      return false;
    }

    if (entry.otp !== String(code).trim()) {
      entry.attempts += 1;
      return false;
    }

    // Single-use guarantee: delete after successful verification
    this.memoryStore.delete(key);
    return true;
  }
}

module.exports = new OtpService();
