// Rules for sessions and answers.
// Queries and transactions live in repositories; this file holds business rules only.
const { notFound, conflict, forbidden, badRequest } = require('../errors/app-error');
const sessionRepository = require('../repositories/session.repository');
const answerRepository = require('../repositories/answer.repository');
const playerRepository = require('../repositories/player.repository');
const { pointsFor } = require('./scoring');

function toJson(session) {
  const s = session.toJSON ? session.toJSON() : session;
  return s;
}

async function startSession(sessionCode, actorUserId) {
  const session = await sessionRepository.findByCode(sessionCode);
  if (!session) throw notFound('SESSION_NOT_FOUND', `No session with code ${sessionCode}.`);

  // Already running.
  if (session.current_position > 0 && !session.ended_at) {
    throw conflict('ALREADY_IN_GAME', 'This game is already running.');
  }

  // The session must have questions.
  const questionCount = await sessionRepository.countQuestionsForLevel(session.level_id);
  if (questionCount === 0) {
    throw conflict('NO_QUESTIONS', 'This game set has no questions.');
  }

  return sessionRepository.startSession(session);
}

async function advanceSession(sessionCode, actorUserId, currentPosition) {
  const session = await sessionRepository.findByCode(sessionCode);
  if (!session) throw notFound('SESSION_NOT_FOUND', `No session with code ${sessionCode}.`);

  // Must be running.
  if (!session.current_position || session.current_position === 0 || session.ended_at) {
    throw conflict('NOT_RUNNING', 'This game is not running.');
  }

  const questionCount = await sessionRepository.countQuestionsForLevel(session.level_id);
  if (currentPosition < 1 || currentPosition > questionCount) {
    throw conflict('NO_MORE_QUESTIONS', 'There are no more questions.');
  }

  // Only current+1 is allowed.
  if (currentPosition !== session.current_position + 1) {
    throw conflict('NOT_NEXT_QUESTION', 'You can only advance to the next question.');
  }

  return sessionRepository.advanceSession(session, currentPosition);
}

async function closeSession(sessionCode, actorUserId) {
  const session = await sessionRepository.findByCode(sessionCode);
  if (!session) throw notFound('SESSION_NOT_FOUND', `No session with code ${sessionCode}.`);

  if (session.ended_at) {
    throw conflict('ALREADY_CLOSED', 'This game is already closed.');
  }

  return sessionRepository.closeSession(session);
}

async function getCurrentQuestion(sessionCode, actorUserId) {
  const session = await sessionRepository.findByCode(sessionCode);
  if (!session) throw notFound('SESSION_NOT_FOUND', `No session with code ${sessionCode}.`);

  if (!session.current_position || session.current_position === 0 || session.ended_at) {
    throw conflict('NOT_RUNNING', 'This game is not running.');
  }

  const question = await sessionRepository.getCurrentQuestion(session.id);
  if (!question) {
    throw conflict('NO_QUESTION', 'No question at the current position.');
  }

  // Never expose is_correct to the client.
  const q = question.toJSON ? question.toJSON() : question;
  const choices = (q.choices || []).map((c) => ({
    id: c.id,
    choice_text: c.choice_text,
    // is_correct is intentionally omitted.
  }));
  return { ...q, choices };
}

async function submitAnswer(sessionCode, actorUserId, questionId, choiceId) {
  const session = await sessionRepository.findByCode(sessionCode);
  if (!session) throw notFound('SESSION_NOT_FOUND', `No session with code ${sessionCode}.`);

  // Checks in order, first failure decides.
  if (!session.current_position || session.current_position === 0 || session.ended_at) {
    throw conflict('NOT_RUNNING', 'This game is not running.');
  }

  // Caller must be seated in this game.
  const player = await playerRepository.findBySessionAndUser(session.id, actorUserId);
  if (!player) throw forbidden('NOT_SEATED', 'You are not seated in this game.');

  // It must be the current question.
  const currentQuestion = await sessionRepository.getCurrentQuestion(session.id);
  if (!currentQuestion || Number(questionId) !== currentQuestion.id) {
    throw conflict('NOT_CURRENT_QUESTION', 'This is not the current question.');
  }

  // The option must belong to that question.
  if (!currentQuestion.choices.some((c) => c.id === Number(choiceId))) {
    throw badRequest('INVALID_OPTION', 'That option does not belong to this question.');
  }

  // UNIQUE(player, question): already answered.
  const existing = await answerRepository.findByPlayerAndQuestion(player.id, Number(questionId));
  if (existing) {
    throw conflict('ALREADY_ANSWERED', 'You have already answered this question.');
  }

  // Elapsed time measured by the server.
  const started = session.question_started_at ? new Date(session.question_started_at).getTime() : Date.now();
  const elapsedMs = Date.now() - started;

  // Score using the pure function.
  const q = currentQuestion.toJSON ? currentQuestion.toJSON() : currentQuestion;
  const isCorrect = currentQuestion.choices.some((c) => c.id === Number(choiceId) && c.is_correct);
  const points = pointsFor(q, isCorrect, elapsedMs);

  // Insert answer and increment score in ONE transaction.
  await answerRepository.recordAnswerAndScore(player.id, Number(questionId), Number(choiceId), isCorrect, points);

  // Mark completed if the player answered every question in the set.
  const answeredCount = await answerRepository.countAnswersForPlayer(player.id);
  const questionCount = await sessionRepository.countQuestionsForLevel(session.level_id);
  if (answeredCount >= questionCount) {
    await playerRepository.setCompleted(player.id, true);
  }

  return { points, is_correct: isCorrect, elapsed_ms: elapsedMs };
}

async function getLeaderboard(sessionCode, actorUserId, limit) {
  const session = await sessionRepository.findByCode(sessionCode);
  if (!session) throw notFound('SESSION_NOT_FOUND', `No session with code ${sessionCode}.`);

  const players = await playerRepository.findBySession(session.id);

  const playersWithUsers = await Promise.all(players.map(async (p) => {
    const u = await playerRepository.getUser(p.user_id);
    return {
      user_id: u.user_id,
      school_id: u.school_id,
      nickname: p.nickname,
      score: Number(p.score),
      completed: Boolean(p.completed),
    };
  }));

  // rankByScore: ties share ranks (1, 2, 2, 4).
  const ranked = rankByScore(playersWithUsers);

  const lim = limit ? Math.min(parseInt(limit, 10), 50) : 10;
  return ranked.slice(0, lim);
}

// Pure ranking: ties share ranks, next rank skips (1, 2, 2, 4).
function rankByScore(players) {
  const sorted = [...players].sort((a, b) => b.score - a.score || a.nickname.localeCompare(b.nickname));
  let rank = 0;
  let previous = null;
  let seen = 0;
  return sorted.map((player) => {
    seen += 1;
    if (player.score !== previous) rank = seen;
    previous = player.score;
    return { ...player, rank };
  });
}

module.exports = {
  startSession,
  advanceSession,
  closeSession,
  getCurrentQuestion,
  submitAnswer,
  getLeaderboard,
  rankByScore,
};
