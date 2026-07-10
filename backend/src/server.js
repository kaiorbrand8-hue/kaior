const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    const server = app.listen(PORT, () => console.log(`KAIOR API running on port ${PORT}`));

    const shutdown = async () => {
      console.log('Shutting down gracefully...');
      server.close();
      await connectDB.disconnectDB();
      process.exit(0);
    };
    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1);
  });
