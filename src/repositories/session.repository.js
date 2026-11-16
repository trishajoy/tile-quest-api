// Queries and transactions for the game_sessions table.
const { GameSession, Player, Question, Choice, User } = require('../models');

async function findByCode(sessionCode) {
  return GameSession.findOne({ where: { session_code: sessionCode } });
}

async function findById(sessionId) {
  return GameSession.findByPk(sessionId);
}

async function startSession(session) {
  return session.update({
    current_position: 1,
    question_started_at: new Date(),
    ended_at: null,
  });
}

async function advanceSession(session, currentPosition) {
  return session.update({
    current_position: currentPosition,
    question_started_at: new Date(),
  });
}

async function closeSession(session) {
  return session.update({ ended_at: new Date() });
}

async function getCurrentQuestion(sessionId) {
  const session = await GameSession.findByPk(sessionId);
  if (!session) return null;

  const question = await Question.findOne({
    where: { level_id: session.level_id, position: session.current_position },
    include: { model: Choice, as: 'choices' },
    attributes: { exclude: ['level_id'] },
  });
  return question;
}

async function countQuestionsForLevel(levelId) {
  return Question.count({ where: { level_id: levelId } });
}

async function getSessionWithPlayers(sessionId) {
  return GameSession.findByPk(sessionId, {
    include: {
      model: Player,
      include: { model: User, as: 'user' },
    },
  });
}

async function countPlayers(sessionId) {
  return Player.count({ where: { game_session_id: sessionId } });
}

module.exports = {
  findByCode,
  findById,
  startSession,
  advanceSession,
  closeSession,
  getCurrentQuestion,
  countQuestionsForLevel,
  getSessionWithPlayers,
  countPlayers,
};
