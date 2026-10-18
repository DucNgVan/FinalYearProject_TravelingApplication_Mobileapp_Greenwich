const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'nomadix_dev_access_secret_2026';
const ACCESS_EXPIRES_IN = '15m'; // 900 seconds

/**
 * Generate a short-lived JWT Access Token (15 minutes)
 * @param {Object} payload 
 * @returns {string}
 */
function generateAccessToken(payload) {
  return jwt.sign(
    {
      userId: payload.userId,
      email: payload.email,
      role: payload.role || 'traveler',
    },
    JWT_ACCESS_SECRET,
    { expiresIn: ACCESS_EXPIRES_IN }
  );
}

/**
 * Verify JWT Access Token and decode payload
 * @param {string} token 
 * @returns {Object}
 */
function verifyAccessToken(token) {
  return jwt.verify(token, JWT_ACCESS_SECRET);
}

/**
 * Hash raw token using SHA-256 for secure DB storage
 * @param {string} rawToken 
 * @returns {string}
 */
function hashToken(rawToken) {
  return crypto.createHash('sha256').update(rawToken).digest('hex');
}

/**
 * Generate a cryptographically random refresh token and its SHA-256 digest
 * @returns {{ rawToken: string, tokenHash: string }}
 */
function generateRefreshToken() {
  const rawToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = hashToken(rawToken);
  return { rawToken, tokenHash };
}

module.exports = {
  generateAccessToken,
  verifyAccessToken,
  generateRefreshToken,
  hashToken,
};
