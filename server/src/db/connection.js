const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });

const { Pool } = require('pg');
const mongoose = require('mongoose');
const Redis = require('ioredis');

const userRepository = require('../repositories/user.repository');
const expenseRepository = require('../repositories/expense.repository');
const itineraryRepository = require('../repositories/itinerary.repository');
const ItineraryModel = require('../models/itinerary.model');

class DatabaseConnectionManager {
  constructor() {
    this.pgPool = null;
    this.mongoose = mongoose;
    this.redisClient = null;
    this.isConnected = false;
  }

  async initDatabaseConnections() {
    // 1. Initialize PostgreSQL Connection Pool
    if (!this.pgPool) {
      const connectionString =
        process.env.DATABASE_URL ||
        `postgresql://${process.env.PG_USER || 'nomadix'}:${process.env.PG_PASSWORD || 'nomadix_secret'}@${process.env.PG_HOST || 'localhost'}:${process.env.PG_PORT || 5432}/${process.env.PG_DATABASE || 'nomadix_dev'}`;

      const isCloudPostgres = connectionString.includes('supabase') || connectionString.includes('sslmode=require');
      this.pgPool = new Pool({
        connectionString,
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000,
        ssl: isCloudPostgres ? { rejectUnauthorized: false } : undefined,
      });

      // Verify PostgreSQL
      await this.pgPool.query('SELECT 1');

      // Wire pool to repositories
      userRepository.setPool(this.pgPool);
      expenseRepository.setPool(this.pgPool);
    }

    // 2. Initialize MongoDB via Mongoose
    const mongoUri =
      process.env.MONGODB_URI ||
      'mongodb://localhost:27017/nomadix_dev';

    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 5000,
      });
    }

    // Wire model to itinerary repository
    itineraryRepository.setModel(ItineraryModel);

    // 3. Initialize Redis Client
    if (!this.redisClient) {
      if (process.env.REDIS_URL) {
        this.redisClient = new Redis(process.env.REDIS_URL, {
          lazyConnect: true,
          maxRetriesPerRequest: 3,
          retryStrategy: (times) => Math.min(times * 50, 1000),
        });
      } else {
        this.redisClient = new Redis({
          host: process.env.REDIS_HOST || 'localhost',
          port: Number(process.env.REDIS_PORT) || 6379,
          lazyConnect: true,
          maxRetriesPerRequest: 3,
          retryStrategy: (times) => Math.min(times * 50, 1000),
        });
      }

      await this.redisClient.connect();
      await this.redisClient.ping();
    }

    this.isConnected = true;
    return {
      postgres: this.pgPool,
      mongoose: this.mongoose,
      redis: this.redisClient,
    };
  }

  getPgPool() {
    return this.pgPool;
  }

  getMongoose() {
    return this.mongoose;
  }

  getRedisClient() {
    return this.redisClient;
  }

  async checkDatabaseHealth() {
    const health = {
      postgres: 'DISCONNECTED',
      mongodb: 'DISCONNECTED',
      redis: 'DISCONNECTED',
    };

    // Check Postgres
    if (this.pgPool) {
      try {
        await this.pgPool.query('SELECT 1');
        health.postgres = 'CONNECTED';
      } catch (_) {
        health.postgres = 'DISCONNECTED';
      }
    }

    // Check MongoDB
    if (this.mongoose.connection && this.mongoose.connection.readyState === 1) {
      try {
        const pingRes = await this.mongoose.connection.db.admin().ping();
        if (pingRes && pingRes.ok === 1) {
          health.mongodb = 'CONNECTED';
        }
      } catch (_) {
        health.mongodb = 'DISCONNECTED';
      }
    }

    // Check Redis
    if (this.redisClient && this.redisClient.status === 'ready') {
      try {
        const pong = await this.redisClient.ping();
        if (pong === 'PONG') {
          health.redis = 'CONNECTED';
        }
      } catch (_) {
        health.redis = 'DISCONNECTED';
      }
    }

    return health;
  }

  async closeDatabaseConnections() {
    if (this.pgPool) {
      try {
        await this.pgPool.end();
      } catch (_) {}
      this.pgPool = null;
    }

    if (mongoose.connection && mongoose.connection.readyState !== 0) {
      try {
        await mongoose.disconnect();
      } catch (_) {}
    }

    if (this.redisClient) {
      try {
        await this.redisClient.quit();
      } catch (_) {
        try {
          this.redisClient.disconnect();
        } catch (_) {}
      }
      this.redisClient = null;
    }

    // Reset repos
    userRepository.setPool(null);
    expenseRepository.setPool(null);
    itineraryRepository.setModel(null);

    this.isConnected = false;
  }
}

module.exports = new DatabaseConnectionManager();
