'use strict';

const { body, param, validationResult } = require('express-validator');

// School IDs are seeded as 2099-0001 ... 2099-0006; the check uses 2099-9901.
const schoolIdPattern = /^2099-\d{4}$/;

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

// -------- register --------
const registerRules = [
  body('school_id')
    .matches(schoolIdPattern)
    .withMessage('school_id must look like 2099-9901'),
  body('full_name')
    .trim()
    .notEmpty()
    .withMessage('full_name is required')
    .isString()
    .withMessage('full_name must be text'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('email is required')
    .isEmail()
    .withMessage('email must be a valid email address')
    .normalizeEmail(),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('password is required')
    .isLength({ min: 8, max: 72 })
    .withMessage('password must be 8 to 72 characters')
    .matches(/[A-Za-z]/)
    .withMessage('password must contain at least one letter')
    .matches(/[0-9]/)
    .withMessage('password must contain at least one number'),
  // No rule for role: register always creates a PLAYER.
];

// -------- login --------
const loginRules = [
  body('school_id')
    .trim()
    .notEmpty()
    .withMessage('school_id is required')
    .isString()
    .withMessage('school_id must be text'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('password is required')
    .isString()
    .withMessage('password must be text'),
];

// -------- role + id --------
const roleRules = [
  body('role')
    .trim()
    .toUpperCase()
    .notEmpty()
    .withMessage('role is required')
    .isIn(['PLAYER', 'HOST', 'ADMIN'])
    .withMessage("role must be PLAYER, HOST or ADMIN"),
];

const idParamRule = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('id must be a positive integer'),
];

module.exports = {
  registerRules,
  loginRules,
  roleRules,
  idParamRule,
  validate,
};
