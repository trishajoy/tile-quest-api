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

// Load models, one line each, then add their associations.
const User = require('./user')(sequelize, DataTypes);
const Level = require('./level')(sequelize, DataTypes);
const Question = require('./question')(sequelize, DataTypes);
const Choice = require('./choice')(sequelize, DataTypes);

// Associations.
Level.hasMany(Question, { foreignKey: 'level_id', as: 'questions' });
Question.belongsTo(Level, { foreignKey: 'level_id' });
Question.hasMany(Choice, { foreignKey: 'question_id', as: 'choices' });
Choice.belongsTo(Question, { foreignKey: 'question_id' });

module.exports = { sequelize, Sequelize, DataTypes, User, Level, Question, Choice };
