require('dotenv').config();
const path = require('path');
const { MongoMemoryServer } = require('mongodb-memory-server');

async function main() {
  const dbPath = path.join(__dirname, '..', 'data', 'mongo');
  const port = Number(process.env.DEV_MONGO_PORT) || 27117;

  const server = await MongoMemoryServer.create({
    instance: {
      dbName: 'kaior',
      dbPath,
      storageEngine: 'wiredTiger',
      port,
    },
  });

  console.log(`KAIOR dev MongoDB listening on ${server.getUri('kaior')}`);
  console.log(`Data persisted under ${dbPath}`);
  console.log('Leave this process running while you develop. Ctrl+C to stop.');

  const shutdown = async () => {
    console.log('\nStopping dev MongoDB...');
    await server.stop();
    process.exit(0);
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

main().catch((err) => {
  console.error('Failed to start dev MongoDB:', err);
  process.exit(1);
});
