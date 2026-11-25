// The rule for the health check: the API is healthy when the database answers.
// A service knows nothing about HTTP and writes no queries.
const healthRepository = require('../repositories/health.repository');

async function checkDatabase() {
  try {
    await healthRepository.ping();
    return 'up';
  } catch (error) {
    console.error('Health check database error:', error.message);
    return 'down';
  }
}

module.exports = { checkDatabase };
