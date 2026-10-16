const fs = require('fs');
const path = require('path');

/**
 * Migration 20261017000001: Create Initial Schema (28 Tables + Seed Roles)
 */
exports.up = async function(knex) {
  const sqlPath = path.resolve(__dirname, '../../docker/init-db/01-init.sql');
  if (fs.existsSync(sqlPath)) {
    const sql = fs.readFileSync(sqlPath, 'utf8');
    await knex.raw(sql);
  } else {
    // Embedded minimal DDL fallback if 01-init.sql is detached
    await knex.raw(`
      CREATE EXTENSION IF NOT EXISTS "pgcrypto";
      CREATE TABLE IF NOT EXISTS roles (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) NOT NULL UNIQUE,
        display_name VARCHAR(100) NOT NULL,
        description VARCHAR(255),
        is_system BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) NOT NULL,
        password_hash VARCHAR(255),
        full_name VARCHAR(100) NOT NULL,
        role_id INT NOT NULL DEFAULT 2 REFERENCES roles(id),
        status VARCHAR(25) NOT NULL DEFAULT 'active',
        created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS trip_members (
        id VARCHAR(50) PRIMARY KEY,
        trip_id VARCHAR(50) NOT NULL,
        user_id UUID NOT NULL REFERENCES users(id),
        role VARCHAR(20) NOT NULL DEFAULT 'MEMBER',
        created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS trip_expenses (
        id VARCHAR(50) PRIMARY KEY,
        trip_id VARCHAR(50) NOT NULL,
        payer_id UUID NOT NULL REFERENCES users(id),
        title VARCHAR(255) NOT NULL,
        amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
        split_type VARCHAR(20) NOT NULL DEFAULT 'equal',
        created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
  }
};

exports.down = async function(knex) {
  const dropTables = [
    'trip_settlements',
    'trip_expense_splits',
    'trip_expenses',
    'trip_members',
    'affiliate_outbound_clicks',
    'payment_transactions',
    'booking_passengers',
    'hotel_bookings',
    'flight_bookings',
    'bookings',
    'saved_offers',
    'traveler_profiles',
    'quiz_attempts',
    'quiz_questions',
    'quizzes',
    'user_badges',
    'badges',
    'checkins',
    'landmarks',
    'auth_audit_logs',
    'password_reset_tokens',
    'user_oauth_accounts',
    'user_refresh_tokens',
    'user_preferences',
    'users',
    'role_permissions',
    'permissions',
    'roles',
  ];

  for (const table of dropTables) {
    await knex.raw(`DROP TABLE IF EXISTS "${table}" CASCADE;`);
  }
};
