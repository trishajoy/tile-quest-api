'use strict';

const { Router } = require('express');
const { requireUser } = require('../middlewares/require-user');
const { roleRules, idParamRule, validate } = require('../validators/auth.validator');
const { conflict } = require('../errors/app-error');
const controller = require('../controllers/user.controller');

const router = Router();

// Every admin route requires an ADMIN account.
router.use(requireUser('ADMIN'));

router.get('/', controller.list);

router.patch(
  '/:id/role',
  idParamRule,
  roleRules,
  validate,
  controller.changeRole
);

module.exports = router;
