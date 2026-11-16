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
const GameSession = require('./game_session')(sequelize, DataTypes);
const Player = require('./player')(sequelize, DataTypes);
const Answer = require('./answer')(sequelize, DataTypes);

// Associations.
Level.hasMany(Question, { foreignKey: 'level_id', as: 'questions' });
Question.belongsTo(Level, { foreignKey: 'level_id' });
Question.hasMany(Choice, { foreignKey: 'question_id', as: 'choices' });
Choice.belongsTo(Question, { foreignKey: 'question_id' });

// Week 13: gameplay associations.
GameSession.hasMany(Player, { foreignKey: 'game_session_id' });
Player.belongsTo(GameSession, { foreignKey: 'game_session_id' });
Player.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasMany(Player, { foreignKey: 'user_id' });
Player.hasMany(Answer, { foreignKey: 'player_id' });
Answer.belongsTo(Player, { foreignKey: 'player_id' });
Question.hasMany(Answer, { foreignKey: 'question_id' });
Answer.belongsTo(Question, { foreignKey: 'question_id' });

module.exports = { sequelize, Sequelize, DataTypes, User, Level, Question, Choice, GameSession, Player, Answer };
