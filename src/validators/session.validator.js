// Validators for the sessions resource (gameplay).
const { body, param, query, validationResult } = require('express-validator');

function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_FAILED',
        message: errors.array().map((e) => e.msg).join('; '),
      },
    });
  }
  next();
}

// -------- start / close --------
const sessionCodeParam = [
  param('session_code')
    .trim()
    .notEmpty()
    .withMessage('session_code is required')
    .isString()
    .withMessage('session_code must be text'),
];

// -------- advance --------
const advanceRules = [
  param('session_code')
    .trim()
    .notEmpty()
    .withMessage('session_code is required')
    .isString()
    .withMessage('session_code must be text'),
  body('current_position')
    .notEmpty()
    .withMessage('current_position is required')
    .isInt({ min: 1 })
    .toInt()
    .withMessage('current_position must be a positive integer'),
];

// -------- answer --------
const answerRules = [
  param('session_code')
    .trim()
    .notEmpty()
    .withMessage('session_code is required')
    .isString()
    .withMessage('session_code must be text'),
  body('question_id')
    .notEmpty()
    .withMessage('question_id is required')
    .isInt({ min: 1 })
    .toInt()
    .withMessage('question_id must be a positive integer'),
  body('choice_id')
    .notEmpty()
    .withMessage('choice_id is required')
    .isInt({ min: 1 })
    .toInt()
    .withMessage('choice_id must be a positive integer'),
];

// -------- leaderboard --------
const leaderboardRules = [
  param('session_code')
    .trim()
    .notEmpty()
    .withMessage('session_code is required')
    .isString()
    .withMessage('session_code must be text'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .toInt()
    .withMessage('limit must be 1 to 50'),
];

module.exports = {
  sessionCodeParam,
  advanceRules,
  answerRules,
  leaderboardRules,
  validate,
};
