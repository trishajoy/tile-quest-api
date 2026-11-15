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

## M3 · Gameplay

## M4 · Automated tests and server preparation

## M5 · API documentation and deployment

## M6 · The SE1 portfolio and the release

## M7 · The Test Report
