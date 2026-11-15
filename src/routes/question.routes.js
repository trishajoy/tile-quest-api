// Question routes (CHILD under levels) and choices (OPTION).
// Guards run before validation: only HOST or ADMIN may write.
const { Router } = require('express');
const { requireUser } = require('../middlewares/require-user');
const {
  questionListRules,
  questionCreateRules,
  questionUpdateRules,
  validate,
} = require('../validators/question.validator');
const controller = require('../controllers/question.controller');

const router = Router({ mergeParams: true });

// Public lists.
router.get('/', questionListRules, validate, controller.listQuestions);
router.get('/:questionId', questionListRules, validate, controller.getQuestion);

// Writes: owner (HOST) or admin only.
router.post(
  '/',
  requireUser('HOST', 'ADMIN'),
  questionCreateRules,
  validate,
  controller.createQuestion
);
router.patch(
  '/:questionId',
  requireUser('HOST', 'ADMIN'),
  questionUpdateRules,
  validate,
  controller.updateQuestion
);
router.delete(
  '/:questionId',
  requireUser('HOST', 'ADMIN'),
  controller.deleteQuestion
);

module.exports = router;
