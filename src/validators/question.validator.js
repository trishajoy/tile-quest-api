// Validators for the questions resource (CHILD) and choices (OPTION).
const { body, param, query, validationResult } = require('express-validator');
const { pageRules, sortRules } = require('./list.validator');

const sortableQuestionColumns = ['id', 'position', 'prompt'];

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

// -------- list --------
const questionListRules = [
  param('levelId').isInt({ min: 1 }).withMessage('levelId must be a positive integer'),
  param('questionId').optional().isInt({ min: 1 }).withMessage('questionId must be a positive integer'),
  ...pageRules,
  ...sortRules(sortableQuestionColumns),
  query('q').optional().trim().isString().withMessage('q must be text'),
];

// -------- create --------
const questionCreateRules = [
  param('levelId').isInt({ min: 1 }).withMessage('levelId must be a positive integer'),
  body('prompt')
    .trim()
    .notEmpty()
    .withMessage('prompt is required')
    .isString()
    .withMessage('prompt must be text'),
  body('explanation')
    .optional()
    .trim()
    .isString()
    .withMessage('explanation must be text'),
  body('choices')
    .isArray({ min: 2 })
    .withMessage('choices must be an array with at least 2 items'),
  body('choices.*.choice_text')
    .trim()
    .notEmpty()
    .withMessage('each choice must have a choice_text')
    .isString()
    .withMessage('choice_text must be text'),
  body('choices.*.is_correct')
    .optional()
    .isBoolean()
    .withMessage('is_correct must be a boolean'),
];

// -------- update --------
const questionUpdateRules = [
  param('levelId').isInt({ min: 1 }).withMessage('levelId must be a positive integer'),
  param('questionId').isInt({ min: 1 }).withMessage('questionId must be a positive integer'),
  body('prompt')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('prompt must not be empty')
    .isString()
    .withMessage('prompt must be text'),
  body('explanation')
    .optional()
    .trim()
    .isString()
    .withMessage('explanation must be text'),
];

module.exports = {
  questionListRules,
  questionCreateRules,
  questionUpdateRules,
  validate,
};
