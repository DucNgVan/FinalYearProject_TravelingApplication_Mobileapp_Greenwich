const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

module.exports = {
  development: {
    client: 'pg',
    connection: process.env.DATABASE_URL || {
      host: process.env.PG_HOST || 'localhost',
      port: process.env.PG_PORT || 5432,
      database: process.env.PG_DATABASE || 'nomadix_dev',
      user: process.env.PG_USER || 'nomadix',
      password: process.env.PG_PASSWORD || 'nomadix_secret',
    },
    migrations: {
      directory: path.join(__dirname, 'migrations'),
      tableName: 'knex_migrations',
    },
    pool: { min: 2, max: 10 },
  },
  test: {
    client: 'pg',
    connection: process.env.DATABASE_URL || {
      host: process.env.PG_HOST || 'localhost',
      port: process.env.PG_PORT || 5432,
      database: process.env.PG_DATABASE || 'nomadix_test',
      user: process.env.PG_USER || 'nomadix',
      password: process.env.PG_PASSWORD || 'nomadix_secret',
    },
    migrations: {
      directory: path.join(__dirname, 'migrations'),
      tableName: 'knex_migrations',
    },
    pool: { min: 1, max: 5 },
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: path.join(__dirname, 'migrations'),
      tableName: 'knex_migrations',
    },
    pool: { min: 2, max: 20 },
  },
};
