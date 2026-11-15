// ONE Sequelize instance (one connection pool) for the whole API.
// Every other file imports it from here - nobody opens a second one.
const { Sequelize, DataTypes } = require('sequelize');
const env = require('../config/env');
const dbConfig = require('../config/database')[env.nodeEnv];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  dbConfig
);

// Week 11: load your models here, one line each, then add their associations.
const User = require('./user')(sequelize, DataTypes);

// Week 12: User exposes password_hash only via scope('withLogin').

module.exports = { sequelize, Sequelize, DataTypes, User };
