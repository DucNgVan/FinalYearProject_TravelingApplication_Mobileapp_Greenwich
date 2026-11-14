const userRepository = require('../repositories/user.repository');
const otpService = require('./otp.service');
const { hashPassword, comparePassword } = require('../utils/password.util');
const { generateAccessToken, generateRefreshToken } = require('./token.service');

class AuthService {
  async sendOtp({ identifier, type = 'email' }) {
    const result = await otpService.generateAndStoreOtp(identifier, type);
    return {
      identifier: result.identifier,
      type: result.type,
      expiresInSeconds: result.expiresInSeconds,
      cooldownSeconds: result.cooldownSeconds,
      devOtp: process.env.NODE_ENV !== 'production' ? result.otp : undefined,
    };
  }

  async verifyOtp({ identifier, otp }) {
    const isValid = await otpService.verifyOtp(identifier, otp);
    if (!isValid) {
      const err = new Error('Mã OTP không hợp lệ hoặc đã hết hạn (Invalid or expired OTP)');
      err.code = 'INVALID_OTP';
      err.statusCode = 400;
      throw err;
    }
    return { verified: true };
  }

  async register({ email, password, fullName, phoneNumber = null, dateOfBirth = null, otp = null }) {
    const existing = await userRepository.findByEmail(email);
    if (existing) {
      const err = new Error('Email is already registered');
      err.code = 'EMAIL_ALREADY_EXISTS';
      err.statusCode = 409;
      throw err;
    }

    let isEmailVerified = false;
    if (otp) {
      const isOtpValid = await otpService.verifyOtp(email, otp);
      if (!isOtpValid) {
        const err = new Error('Mã OTP xác thực không đúng hoặc đã hết hạn (Invalid or expired OTP)');
        err.code = 'INVALID_OTP';
        err.statusCode = 400;
        throw err;
      }
      isEmailVerified = true;
    }

    const passwordHash = await hashPassword(password);
    const createdUser = await userRepository.create({
      email,
      passwordHash,
      fullName,
      phoneNumber,
      dateOfBirth,
      isEmailVerified,
    });

    const { rawToken, tokenHash } = generateRefreshToken();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    await userRepository.saveRefreshToken({
      userId: createdUser.id,
      tokenHash,
      expiresAt,
    });

    const accessToken = generateAccessToken({
      userId: createdUser.id,
      email: createdUser.email,
      role: createdUser.role,
    });

    return {
      user: {
        id: createdUser.id,
        email: createdUser.email,
        fullName: createdUser.full_name,
        phoneNumber: createdUser.phone_number || phoneNumber || null,
        phone: createdUser.phone_number || phoneNumber || null,
        dateOfBirth: createdUser.date_of_birth || dateOfBirth || null,
        role: createdUser.role,
        xp: createdUser.xp,
        level: createdUser.level,
        isEmailVerified: Boolean(createdUser.is_email_verified),
      },
      accessToken,
      refreshToken: rawToken,
    };
  }

  async login({ email, password }) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      const err = new Error('Invalid email or password');
      err.code = 'INVALID_CREDENTIALS';
      err.statusCode = 401;
      throw err;
    }

    const isMatch = await comparePassword(password, user.password_hash);
    if (!isMatch) {
      const err = new Error('Invalid email or password');
      err.code = 'INVALID_CREDENTIALS';
      err.statusCode = 401;
      throw err;
    }

    const { rawToken, tokenHash } = generateRefreshToken();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await userRepository.saveRefreshToken({
      userId: user.id,
      tokenHash,
      expiresAt,
    });

    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        phoneNumber: user.phone_number || null,
        phone: user.phone_number || null,
        dateOfBirth: user.date_of_birth || null,
        role: user.role,
        xp: user.xp,
        level: user.level,
      },
      accessToken,
      refreshToken: rawToken,
    };
  }

  async googleAuth({ idToken, profile = null }) {
    let email = profile?.email;
    let fullName = profile?.fullName || profile?.name;
    let avatarUrl = profile?.avatarUrl || profile?.photoUrl || profile?.picture;

    // If profile is not provided, try decoding JWT idToken payload
    if ((!email || !avatarUrl) && idToken && typeof idToken === 'string' && idToken.includes('.')) {
      try {
        const payloadBase64 = idToken.split('.')[1];
        const decoded = JSON.parse(Buffer.from(payloadBase64, 'base64').toString('utf8'));
        email = email || decoded.email;
        fullName = fullName || decoded.name || decoded.given_name;
        avatarUrl = avatarUrl || decoded.picture;
      } catch {
        // Fallback
      }
    }

    if (!email) {
      email = `google.user.${Date.now()}@gmail.com`;
    }
    if (!fullName) {
      fullName = email.split('@')[0] || 'Google Traveler';
    }

    // 1. Check if user already exists
    let user = await userRepository.findByEmail(email);

    if (!user) {
      // 2. Create user if not exists
      const crypto = require('crypto');
      const randomPassword = crypto.randomBytes(16).toString('hex') + 'Aa1!';
      const passwordHash = await hashPassword(randomPassword);
      user = await userRepository.create({
        email,
        passwordHash,
        fullName,
        phoneNumber: null,
        isEmailVerified: true,
        avatarUrl,
      });
    } else {
      // If user exists, update their profile with latest Google info
      const needsUpdate = (fullName && fullName !== user.full_name) || (avatarUrl && avatarUrl !== user.avatar_url);
      if (needsUpdate) {
        const updated = await userRepository.updateGoogleProfile(user.id, {
          fullName: fullName || user.full_name,
          avatarUrl: avatarUrl || user.avatar_url,
        });
        if (updated) {
          user = { ...user, ...updated };
        }
      }
    }

    // 3. Issue refresh token
    const { rawToken, tokenHash } = generateRefreshToken();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await userRepository.saveRefreshToken({
      userId: user.id,
      tokenHash,
      expiresAt,
    });

    // 4. Issue access token
    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name || user.fullName,
        avatarUrl: user.avatar_url || user.avatarUrl || avatarUrl || null,
        role: user.role,
        xp: user.xp || 0,
        level: user.level || 1,
        isEmailVerified: Boolean(user.is_email_verified ?? true),
        authProvider: 'google',
      },
      tokens: {
        accessToken,
        refreshToken: rawToken,
      },
      accessToken,
      refreshToken: rawToken,
    };
  }
}

module.exports = new AuthService();
