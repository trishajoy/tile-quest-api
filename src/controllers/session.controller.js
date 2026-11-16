// Translates between HTTP and the service. No SQL, no business rules.
// req.body never appears here: validated input comes from matchedData.
const { matchedData } = require('express-validator');
const sessionService = require('../services/session.service');

function toJson(session) {
  const s = session.toJSON ? session.toJSON() : session;
  return s;
}

async function start(req, res) {
  const input = matchedData(req, { locations: ['body', 'params'] });
  const { session_code } = input;
  const result = await sessionService.startSession(session_code, req.user.user_id);
  res.status(200).json({ session: toJson(result) });
}

async function advance(req, res) {
  const input = matchedData(req, { locations: ['body', 'params'] });
  const { session_code, current_position } = input;
  const result = await sessionService.advanceSession(session_code, req.user.user_id, current_position);
  res.status(200).json({ session: toJson(result) });
}

async function close(req, res) {
  const input = matchedData(req, { locations: ['params'] });
  const { session_code } = input;
  const result = await sessionService.closeSession(session_code, req.user.user_id);
  res.status(200).json({ session: toJson(result) });
}

async function currentQuestion(req, res) {
  const input = matchedData(req, { locations: ['params'] });
  const { session_code } = input;
  const question = await sessionService.getCurrentQuestion(session_code, req.user.user_id);
  res.status(200).json({ question });
}

async function submitAnswer(req, res) {
  const input = matchedData(req, { locations: ['body', 'params'] });
  const { session_code, question_id, choice_id } = input;
  const result = await sessionService.submitAnswer(session_code, req.user.user_id, question_id, choice_id);
  res.status(200).json(result);
}

async function leaderboard(req, res) {
  const input = matchedData(req, { locations: ['query', 'params'] });
  const { session_code, limit } = input;
  const result = await sessionService.getLeaderboard(session_code, req.user.user_id, limit);
  res.status(200).json({ leaderboard: result });
}

module.exports = {
  start,
  advance,
  close,
  currentQuestion,
  submitAnswer,
  leaderboard,
};
