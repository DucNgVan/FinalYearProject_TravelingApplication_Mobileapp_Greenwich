const app = require('./app');
const databaseManager = require('./db/connection');
const PORT = process.env.PORT || 5001;

async function startServer() {
  try {
    console.log('⏳ Connecting to Polyglot Persistence Engines (PostgreSQL, MongoDB, Redis)...');
    await databaseManager.initDatabaseConnections();
    console.log('✅ All Databases Connected & Wired to Repositories!');
  } catch (err) {
    console.warn('⚠️ Warning: Database connection failed, running in Dual-Mode / In-Memory Fallback:', err.message);
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Nomadix Server is successfully running on http://0.0.0.0:${PORT}`);
  });

  const shutdown = async () => {
    console.log('\n🛑 Gracefully shutting down Nomadix server...');
    server.close(async () => {
      await databaseManager.closeDatabaseConnections();
      console.log('🔒 Closed all database connections. Exiting.');
      process.exit(0);
    });
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

startServer();
