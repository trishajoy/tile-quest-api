'use strict';

const { Router } = require('express');
const { requireUser } = require('../middlewares/require-user');
const { registerRules, loginRules, validate } = require('../validators/auth.validator');
const controller = require('../controllers/auth.controller');

const router = Router();

// Public: no login required.
router.post('/register', registerRules, validate, controller.register);
router.post('/login', loginRules, validate, controller.login);

// Protected: you must be logged in to read your own account.
router.get('/me', requireUser(), controller.me);

module.exports = router;
