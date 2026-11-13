const crypto = require('crypto');
const bcrypt = require('bcrypt');

// In-memory store for unit/integration tests without active database container
const memoryUsers = new Map();
const memoryRefreshTokens = new Map();

// Pre-seed test user for integration login tests
const seedPasswordHash = bcrypt.hashSync('CorrectPassword2026!', 10);
memoryUsers.set('traveler@nomadix.vn', {
  id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  email: 'traveler@nomadix.vn',
  password_hash: seedPasswordHash,
  full_name: 'Sample Traveler',
  role: 'traveler',
  xp: 0,
  level: 1,
  status: 'active',
  created_at: new Date(),
  updated_at: new Date(),
});

// Pre-seed Demo User requested by Navigator: abc@gmail.com / 123
const demoPasswordHash = bcrypt.hashSync('123', 10);
memoryUsers.set('abc@gmail.com', {
  id: 'b1ffcd88-9c0b-4ef8-bb6d-6bb9bd380b22',
  email: 'abc@gmail.com',
  password_hash: demoPasswordHash,
  full_name: 'Nguyễn Văn Đức',
  role: 'traveler',
  xp: 1450,
  level: 5,
  status: 'active',
  created_at: new Date(),
  updated_at: new Date(),
});

class UserRepository {
  constructor(pgPool = null) {
    this.pool = pgPool;
  }

  setPool(pgPool) {
    this.pool = pgPool;
  }

  async findByEmail(email) {
    const normalizedEmail = email.toLowerCase().trim();
    if (this.pool) {
      try {
        const res = await this.pool.query(
          'SELECT u.*, r.name as role FROM users u JOIN roles r ON u.role_id = r.id WHERE LOWER(u.email) = $1 AND u.deleted_at IS NULL',
          [normalizedEmail]
        );
        if (res.rows[0]) {
          return res.rows[0];
        }
      } catch (err) {
        // Fallback to memory store if DB is unreachable
      }
    }
    return memoryUsers.get(normalizedEmail) || null;
  }

  async create({ email, passwordHash, fullName, phoneNumber = null, isEmailVerified = false, avatarUrl = null }) {
    const normalizedEmail = email.toLowerCase().trim();
    const id = crypto.randomUUID();
    const newUser = {
      id,
      email: normalizedEmail,
      password_hash: passwordHash,
      full_name: fullName,
      phone_number: phoneNumber,
      avatar_url: avatarUrl,
      is_email_verified: isEmailVerified,
      role: 'traveler',
      xp: 0,
      level: 1,
      status: 'active',
      created_at: new Date(),
      updated_at: new Date(),
    };

    if (this.pool) {
      try {
        const res = await this.pool.query(
          `INSERT INTO users (id, email, password_hash, full_name, phone_number, is_email_verified, role_id, avatar_url)
           VALUES ($1, $2, $3, $4, $5, $6, 2, $7)
           RETURNING id, email, full_name, phone_number, avatar_url, is_email_verified, role_id, xp, level, status, created_at`,
          [id, normalizedEmail, passwordHash, fullName, phoneNumber, isEmailVerified, avatarUrl]
        );
        return { ...res.rows[0], role: 'traveler' };
      } catch (err) {
        // Fallback to memory store
      }
    }

    memoryUsers.set(normalizedEmail, newUser);
    return newUser;
  }

  async updateGoogleProfile(userId, { avatarUrl = null, fullName = null }) {
    if (this.pool) {
      try {
        const updates = [];
        const values = [userId];
        let idx = 2;

        if (fullName) {
          updates.push(`full_name = $${idx++}`);
          values.push(fullName);
        }
        if (avatarUrl) {
          updates.push(`avatar_url = $${idx++}`);
          values.push(avatarUrl);
        }

        if (updates.length > 0) {
          const res = await this.pool.query(
            `UPDATE users SET ${updates.join(', ')}, updated_at = NOW() WHERE id = $1 RETURNING *`,
            values
          );
          if (res.rows[0]) return { ...res.rows[0], role: 'traveler' };
        }
      } catch (err) {
        // Fallback to memory store
      }
    }

    for (const [key, user] of memoryUsers.entries()) {
      if (user.id === userId) {
        if (fullName) user.full_name = fullName;
        if (avatarUrl) user.avatar_url = avatarUrl;
        user.updated_at = new Date();
        memoryUsers.set(key, user);
        return user;
      }
    }
    return null;
  }

  async saveRefreshToken({ userId, tokenHash, expiresAt }) {
    const id = crypto.randomUUID();
    const record = { id, user_id: userId, token_hash: tokenHash, expires_at: expiresAt };

    if (this.pool) {
      try {
        await this.pool.query(
          'INSERT INTO user_refresh_tokens (id, user_id, token_hash, expires_at) VALUES ($1, $2, $3, $4)',
          [id, userId, tokenHash, expiresAt]
        );
        return record;
      } catch (err) {
        // Fallback to memory store
      }
    }

    memoryRefreshTokens.set(tokenHash, record);
    return record;
  }
}

module.exports = new UserRepository();
