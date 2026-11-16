// Database settings for BOTH the running API and sequelize-cli.
// Values come from .env - nothing secret is written in this file.
// When DATABASE_URL is set (Render), the connection uses the URL,
// with SSL when DB_SSL=true.
const env = require('./env');

function baseSettings(overrides = {}) {
  const settings = {
    dialect: 'postgres',
    logging: false,
    // Track seeders in a table, the same way migrations are tracked,
    // so running "db:seed:all" twice does not insert the data twice.
    seederStorage: 'sequelize',
    pool: { max: 10, min: 0, idle: 10000 },
    ...overrides,
  };
  if (env.db.ssl) {
    settings.dialectOptions = { ssl: { rejectUnauthorized: false } };
  }
  return settings;
}

function databaseName() {
  if (env.nodeEnv === 'test') return `${env.db.name}_test`;
  return env.db.name;
}

module.exports = {
  development: baseSettings({
    database: databaseName(),
    username: env.db.user,
    password: env.db.password,
    host: env.db.host,
    port: env.db.port,
    url: env.databaseUrl,
  }),
  test: baseSettings({
    database: databaseName(),
    username: env.db.user,
    password: env.db.password,
    host: env.db.host,
    port: env.db.port,
    url: env.databaseUrl,
  }),
  production: baseSettings({
    database: databaseName(),
    username: env.db.user,
    password: env.db.password,
    host: env.db.host,
    port: env.db.port,
    url: env.databaseUrl,
  }),
};
