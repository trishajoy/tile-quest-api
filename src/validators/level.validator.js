// Validators for the levels resource (PARENT).
const { body, param, query, validationResult } = require('express-validator');
const { pageRules, sortRules } = require('./list.validator');

const sortableLevelColumns = ['id', 'level_number', 'name', 'pass_score'];

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
const levelListRules = [
  param('id').optional().isInt({ min: 1 }).withMessage('id must be a positive integer'),
  ...pageRules,
  ...sortRules(sortableLevelColumns),
  query('q').optional().trim().isString().withMessage('q must be text'),
  query('include').optional().isIn(['children']).withMessage("include must be 'children'"),
];

// -------- create --------
const levelCreateRules = [
  body('level_number')
    .trim()
    .notEmpty()
    .withMessage('level_number is required')
    .isInt({ min: 1 })
    .withMessage('level_number must be a positive integer'),
  body('name')
    .trim()
    .notEmpty()
    .withMessage('name is required')
    .isString()
    .withMessage('name must be text')
    .isLength({ max: 100 })
    .withMessage('name must be at most 100 characters'),
  body('pass_score')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('pass_score must be 0 to 100'),
];

// -------- update --------
const levelUpdateRules = [
  param('id').isInt({ min: 1 }).withMessage('id must be a positive integer'),
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('name must not be empty')
    .isString()
    .withMessage('name must be text'),
  body('pass_score')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('pass_score must be 0 to 100'),
];

const idParamRule = [
  param('id').isInt({ min: 1 }).withMessage('id must be a positive integer'),
];

module.exports = {
  levelListRules,
  levelCreateRules,
  levelUpdateRules,
  idParamRule,
  validate,
};
