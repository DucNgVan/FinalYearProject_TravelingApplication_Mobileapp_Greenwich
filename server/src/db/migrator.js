const knex = require('knex');
const knexConfig = require('../../knexfile');

class DatabaseMigrator {
  constructor(defaultEnv = process.env.NODE_ENV || 'development') {
    this.defaultEnv = defaultEnv;
  }

  getKnex(customKnex = null) {
    if (customKnex) return customKnex;
    const config = knexConfig[this.defaultEnv] || knexConfig.development;
    return knex(config);
  }

  async up(customKnex = null) {
    const db = this.getKnex(customKnex);
    const isExternal = Boolean(customKnex);

    try {
      const [batchNo, applied] = await db.migrate.latest();
      return {
        success: true,
        batchNo,
        applied: applied || [],
      };
    } finally {
      if (!isExternal && typeof db.destroy === 'function') {
        await db.destroy();
      }
    }
  }

  async down(customKnex = null) {
    const db = this.getKnex(customKnex);
    const isExternal = Boolean(customKnex);

    try {
      const [batchNo, reverted] = await db.migrate.rollback();
      return {
        success: true,
        batchNo,
        reverted: reverted || [],
      };
    } finally {
      if (!isExternal && typeof db.destroy === 'function') {
        await db.destroy();
      }
    }
  }

  async status(customKnex = null) {
    const db = this.getKnex(customKnex);
    const isExternal = Boolean(customKnex);

    try {
      const pendingCount = await db.migrate.status();
      return {
        pendingCount: pendingCount || 0,
        isUpToDate: pendingCount === 0,
      };
    } finally {
      if (!isExternal && typeof db.destroy === 'function') {
        await db.destroy();
      }
    }
  }
}

module.exports = new DatabaseMigrator();
