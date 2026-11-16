# Development journey: Tile Quest API

Student: Trisha Joy Gutierrez · Section: 3-1 · Group: Team 4

One entry per milestone, written the week you did it. Newest at the bottom.

## M1 · Accounts, passwords and tokens
- Dates worked: Nov 15, 2026 · Time spent: ~8 hours
- Goal: Add registration, login, and auth-protected account routes with password hashing and JWT tokens.
- What I built: Migration add-password-to-users, seeder demo-passwords, validators auth.validator.js, middleware require-user.js, services auth.service.js and user.service.js, controllers auth.controller.js and user.controller.js, routes auth.routes.js and user.routes.js. Endpoints: POST /auth/register, POST /auth/login, GET /auth/me, GET /users, PATCH /users/:id/role. Also added bcryptjs, jsonwebtoken, express-validator, cors, helmet to dependencies; updated src/config/env.js and src/app.js; updated README with demo accounts.
- Evidence: PR not yet opened · e85ebeb (kit install) + M1 commits
- Problem I hit: Register returned 500 because the `password` parameter name shadowed the imported `password` module in auth.service.js; also the DB check constraint ck_users_role only allowed lowercase 'player'/'admin' but the code inserts 'PLAYER'.
- How I solved it: Renamed the parameter to plainPassword; added migration to widen the check constraint to accept PLAYER/HOST/ADMIN. Also fixed swapped code/message arguments in conflict() calls.
- Decision I made and why: Used bcryptjs (pure JS, no compiler) with cost 10; roles stored as uppercase PLAYER/HOST/ADMIN in code but compared case-insensitively in requireUser since the DB stores lowercase from seed data.
- Changes to my design set: Added /auth/register, /auth/login, /auth/me, /users, /users/:id/role to the endpoint table.
- What I would explain to a classmate: Wrong password and unknown school ID must answer identically (same status, code, message) so attackers can't distinguish valid accounts.
- AI tools: opencode (AI coding agent) drafted code, tests and docs for this milestone; I ran, reviewed and can explain them.

## M2 · The question bank
- Dates worked: Nov 15, 2026 · Time spent: ~6 hours
- Goal: Add paged level listing, nested questions/choices under levels, exactly-one-correct-option validation, level freeze when used by a game, server-set question positions, and picture upload for levels.
- What I built: Migrations add-position-to-questions and add-picture-to-levels; models level.js, question.js, choice.js; repositories level.repository.js, question.repository.js, choice.repository.js; services level.service.js, question.service.js; validators level.validator.js, question.validator.js; controllers level.controller.js, question.controller.js; routes level.routes.js, question.routes.js; middleware upload-picture.js (renamed from upload-cover). Endpoints: GET/POST /levels, GET/PATCH /levels/:id, PUT /levels/:id/picture, GET/POST /levels/:levelId/questions, GET/PATCH/DELETE /levels/:levelId/questions/:questionId, GET /levels/:id?include=children.
- Evidence: PR not yet opened · M2 commits
- Problem I hit: Sequelize association aliases didn't match (Question vs questions, Choice vs choices); PostgreSQL lowercases aliased columns (maxPos → maxpos); `matchedData` didn't pick up merged-router params for questionId.
- How I solved it: Added explicit `as: 'questions'` and `as: 'choices'` aliases in model associations; changed column alias to lowercase `maxpos`; switched to `req.params` for route IDs.
- Decision I made and why: Used `Router({ mergeParams: true })` for nested question routes; picture stored on local disk under `uploads/levels/` (Render's disk is non-persistent, documented limitation); questions have server-set positions (1..n) with re-packing after delete in a transaction.
- Changes to my design set: Added /levels, /levels/:id, /levels/:id/picture, /levels/:levelId/questions, /levels/:levelId/questions/:questionId to the endpoint table.
- What I would explain to a classmate: Exactly-one-correct-option is enforced both by a database partial unique index (uq_choices_one_correct_per_question) and application-level validation for a clear 400 error.
- AI tools: opencode (AI coding agent) drafted code, tests and docs for this milestone; I ran, reviewed and can explain them.

## M3 · Gameplay
- Dates worked: Nov 16, 2026 · Time spent: ~8 hours
- Goal: Add gameplay sessions, answers, scoring, and leaderboard with server-timed scoring.
- What I built: Migration add-question-started-to-game-sessions, add-time-limit-and-points-to-questions, add-current-position-to-game-sessions; models game_session.js, player.js, answer.js; repositories session.repository.js, answer.repository.js, player.repository.js; services scoring.js, session.service.js; validators session.validator.js; controller session.controller.js; routes session.routes.js. Endpoints: POST/GET/PATCH /sessions/:code, POST /sessions/:code/answers, GET /sessions/:code/leaderboard. Added gameplay Postman folder with 8 requests.
- Evidence: PR not yet opened · M3 commits
- Problem I hit: `current_position` column missing from game_sessions (forgot migration); `question_id` vs `current_position` confusion in answer validation; `Player.increment` inside transaction causing 500; `matchedData` returning strings instead of integers for route params.
- How I solved it: Added missing migration; compare question_id to currentQuestion.id instead of position; replaced Player.increment with fetch-modify-save; added .toInt() to integer validators.
- Decision I made and why: Used separate scoring.js module for pure function (easy to unit test); transactions wrap answer+score insert; positions set by server (append at end); completed = answered every question in the set.
- Changes to my design set: Added /sessions/:code/start, /sessions/:code/advance, /sessions/:code/close, /sessions/:code/question, /sessions/:code/answers, /sessions/:code/leaderboard to the endpoint table.
- What I would explain to a classmate: Server-timed scoring prevents clients from cheating by reporting their own elapsed time; the scoring formula rewards fast answers (0 ms = full points, limit ms = half points, beyond limit = 0).
- AI tools: opencode (AI coding agent) drafted code, tests and docs for this milestone; I ran, reviewed and can explain them.

## M4 · Automated tests and server preparation

## M4 · Automated tests and server preparation

## M5 · API documentation and deployment

## M6 · The SE1 portfolio and the release

## M7 · The Test Report
