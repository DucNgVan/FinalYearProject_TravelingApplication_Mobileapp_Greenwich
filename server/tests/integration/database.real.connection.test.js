const request = require('supertest');
const app = require('../../src/app');
const databaseManager = require('../../src/db/connection');

describe('TDD RED Phase: Real Database Connection & Healthcheck Integration', () => {
  beforeAll(async () => {
    await databaseManager.initDatabaseConnections();
  });

  afterAll(async () => {
    await databaseManager.closeDatabaseConnections();
  });

  test('RED-DB-LIVE-01: Successfully connects to real PostgreSQL container and queries SELECT NOW()', async () => {
    const pool = databaseManager.getPgPool();
    expect(pool).toBeDefined();

    const result = await pool.query('SELECT NOW() as current_time, current_database() as db_name');
    expect(result.rows).toBeDefined();
    expect(result.rows.length).toBe(1);
    expect(['nomadix_dev', 'postgres']).toContain(result.rows[0].db_name);
    expect(result.rows[0].current_time).toBeInstanceOf(Date);

    const tablesRes = await pool.query("SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public';");
    expect(Number(tablesRes.rows[0].count)).toBeGreaterThanOrEqual(28);
  });

  test('RED-DB-LIVE-02: Successfully connects to real MongoDB container and pings admin db', async () => {
    const mongooseInstance = databaseManager.getMongoose();
    expect(mongooseInstance).toBeDefined();
    expect(mongooseInstance.connection.readyState).toBe(1); // 1 = connected

    const pingRes = await mongooseInstance.connection.db.admin().ping();
    expect(pingRes.ok).toBe(1);
  });

  test('RED-DB-LIVE-03: Successfully connects to real Redis container and verifies set/get/del cycle', async () => {
    const redisClient = databaseManager.getRedisClient();
    expect(redisClient).toBeDefined();

    const pong = await redisClient.ping();
    expect(pong).toBe('PONG');

    const testKey = 'nomadix:test:live_ping';
    await redisClient.set(testKey, 'operational', 'EX', 10);
    const value = await redisClient.get(testKey);
    expect(value).toBe('operational');

    await redisClient.del(testKey);
    const deletedVal = await redisClient.get(testKey);
    expect(deletedVal).toBeNull();
  });

  test('RED-DB-LIVE-04: GET /health returns UP with verified real-time database connectivity status', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('UP');
    expect(res.body.databases).toBeDefined();
    expect(res.body.databases.postgres).toBe('CONNECTED');
    expect(res.body.databases.mongodb).toBe('CONNECTED');
    expect(res.body.databases.redis).toBe('CONNECTED');
  });
});
