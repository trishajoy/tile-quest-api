// Level routes (PARENT resource). Guards run before validation.
const { Router } = require('express');
const { requireUser } = require('../middlewares/require-user');
const {
  levelListRules,
  levelCreateRules,
  levelUpdateRules,
  idParamRule,
  validate,
} = require('../validators/level.validator');
const controller = require('../controllers/level.controller');
const uploadPicture = require('../middlewares/upload-picture');

const router = Router();

// Public lists.
router.get('/', levelListRules, validate, controller.listLevels);
router.get('/:id', levelListRules, validate, controller.getLevel);

// Writes: owner (HOST) or admin only.
router.post('/', requireUser('HOST', 'ADMIN'), levelCreateRules, validate, controller.createLevel);
router.patch(
  '/:id',
  requireUser('HOST', 'ADMIN'),
  levelUpdateRules,
  validate,
  controller.updateLevel
);
router.put(
  '/:id/picture',
  requireUser('HOST', 'ADMIN'),
  idParamRule,
  validate,
  uploadPicture,
  controller.uploadLevelPicture
);

module.exports = router;
