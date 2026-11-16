// Queries and transactions for the answers table.
// The answer + score increment lives in ONE transaction here so the service stays mockable.
const { Answer, Player, sequelize } = require('../models');

async function findByPlayerAndQuestion(playerId, questionId) {
  return Answer.findOne({ where: { player_id: playerId, question_id: questionId } });
}

async function recordAnswerAndScore(playerId, questionId, choiceId, isCorrect, points) {
  const t = await sequelize.transaction();
  try {
    const answer = await Answer.create(
      { player_id: playerId, question_id: questionId, choice_id: choiceId, is_correct: isCorrect, answered_at: new Date() },
      { transaction: t }
    );
    if (points > 0) {
      const player = await Player.findByPk(playerId, { transaction: t });
      player.score = (player.score || 0) + points;
      await player.save({ transaction: t });
    }
    await t.commit();
    return answer;
  } catch (error) {
    await t.rollback();
    throw error;
  }
}

async function countAnswersForPlayer(playerId) {
  return Answer.count({ where: { player_id: playerId } });
}

module.exports = { findByPlayerAndQuestion, recordAnswerAndScore, countAnswersForPlayer };
