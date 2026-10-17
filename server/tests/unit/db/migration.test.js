const path = require('path');

// Before implementation, this require will fail or migrator will be undefined -> RED STATE
const migrator = require('../../../src/db/migrator');

describe('Unit Test: Database Migrator & Versioned Migrations (TDD Phase 1)', () => {
  let mockKnex;

  beforeEach(() => {
    mockKnex = {
      migrate: {
        latest: jest.fn().mockResolvedValue([1, ['20261017000001_create_initial_schema.js']]),
        rollback: jest.fn().mockResolvedValue([1, ['20261017000001_create_initial_schema.js']]),
        status: jest.fn().mockResolvedValue(0),
        list: jest.fn().mockResolvedValue([
          ['20261017000001_create_initial_schema.js'],
          []
        ]),
      },
      destroy: jest.fn().mockResolvedValue(true),
    };
  });

  test('RED-MIG-01: migrator.up() should execute latest migrations and return applied batch', async () => {
    const result = await migrator.up(mockKnex);

    expect(mockKnex.migrate.latest).toHaveBeenCalledTimes(1);
    expect(result.success).toBe(true);
    expect(result.batchNo).toBe(1);
    expect(result.applied).toContain('20261017000001_create_initial_schema.js');
  });

  test('RED-MIG-02: migrator.down() should execute rollback and return reverted migrations', async () => {
    const result = await migrator.down(mockKnex);

    expect(mockKnex.migrate.rollback).toHaveBeenCalledTimes(1);
    expect(result.success).toBe(true);
    expect(result.batchNo).toBe(1);
    expect(result.reverted).toContain('20261017000001_create_initial_schema.js');
  });

  test('RED-MIG-03: migrator.status() should inspect schema status and pending migrations', async () => {
    const status = await migrator.status(mockKnex);

    expect(mockKnex.migrate.status).toHaveBeenCalledTimes(1);
    expect(status.pendingCount).toBe(0);
    expect(status.isUpToDate).toBe(true);
  });

  test('RED-MIG-04: Migration file 20261017000001_create_initial_schema should export valid up and down functions', () => {
    const migrationFilePath = path.resolve(__dirname, '../../../migrations/20261017000001_create_initial_schema.js');
    const migration = require(migrationFilePath);

    expect(typeof migration.up).toBe('function');
    expect(typeof migration.down).toBe('function');
  });
});
