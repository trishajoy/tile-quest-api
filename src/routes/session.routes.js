// Session routes (gameplay). Guards run before validation.
const { Router } = require('express');
const { requireUser } = require('../middlewares/require-user');
const {
  sessionCodeParam,
  advanceRules,
  answerRules,
  leaderboardRules,
  validate,
} = require('../validators/session.validator');
const controller = require('../controllers/session.controller');

const router = Router();

// All session endpoints require a logged-in account.
router.use(requireUser());

// Start a LOBBY game → RUNNING (sets current_position=1, question_started_at).
router.post('/:session_code/start', sessionCodeParam, validate, controller.start);

// Advance to the next question.
router.post(
  '/:session_code/advance',
  sessionCodeParam,
  advanceRules,
  validate,
  controller.advance
);

// Close the game (sets ended_at, appears in /results).
router.post('/:session_code/close', sessionCodeParam, validate, controller.close);

// Current question and options (never is_correct).
router.get('/:session_code/question', sessionCodeParam, validate, controller.currentQuestion);

// Submit an answer (server-timed scoring).
router.post('/:session_code/answers', sessionCodeParam, answerRules, validate, controller.submitAnswer);

// Live leaderboard (ties share ranks).
router.get('/:session_code/leaderboard', sessionCodeParam, leaderboardRules, validate, controller.leaderboard);

module.exports = router;
