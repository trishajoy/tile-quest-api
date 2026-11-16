// Queries for the players table.
const { Player, User } = require('../models');

async function findById(playerId) {
  return Player.findByPk(playerId);
}

async function findBySessionAndUser(sessionId, userId) {
  return Player.findOne({ where: { game_session_id: sessionId, user_id: userId } });
}

async function findBySession(sessionId) {
  return Player.findAll({ where: { game_session_id: sessionId }, order: [['score', 'DESC']] });
}

async function createPlayer(sessionId, userId, nickname) {
  return Player.create({ game_session_id: sessionId, user_id, nickname });
}

async function setCompleted(playerId, completed) {
  const player = await Player.findByPk(playerId);
  if (player) {
    return player.update({ completed });
  }
  return null;
}

async function getUser(userId) {
  return User.findByPk(userId);
}

module.exports = { findById, findBySessionAndUser, findBySession, createPlayer, setCompleted, getUser };
