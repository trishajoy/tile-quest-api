// The single place that maps URLs to route files.
const { Router } = require('express');
const currentUser = require('../middlewares/current-user');

const router = Router();

// Hub Contract endpoints first (no login needed).
router.use('/health', require('./health.routes'));
router.use('/game-info', require('./game-info.routes'));
router.use('/results', require('./results.routes'));

// Who is calling, from the login token. Applies to everything mounted after this.
router.use(currentUser);

// Auth endpoints (register/login are public; me needs a token).
router.use('/auth', require('./auth.routes'));
router.use('/users', require('./user.routes'));

// Week 11 modules: question bank (levels -> questions -> choices).
router.use('/levels', require('./level.routes'));
router.use('/levels/:levelId/questions', require('./question.routes'));

// Week 13: gameplay (sessions -> answers -> leaderboard).
router.use('/sessions', require('./session.routes'));

module.exports = router;
