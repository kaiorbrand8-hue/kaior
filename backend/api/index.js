const app = require('../src/app');
const connectDB = require('../src/config/db');

// Reused across warm invocations of the same serverless container so we
// don't reconnect to MongoDB on every request.
let dbPromise = null;

module.exports = async (req, res) => {
  if (!dbPromise) {
    dbPromise = connectDB();
  }
  await dbPromise;
  return app(req, res);
};
