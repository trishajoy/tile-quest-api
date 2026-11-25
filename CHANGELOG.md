# Changelog

All notable changes, newest first.

## [1.0.0] (Weeks 15 to 16): Deployment and documentation
- Added Render deployment with render.yaml Blueprint
- Added OpenAPI 3 documentation with Swagger UI at /docs
- Added data dictionary and six diagrams
- Added development journey with milestone entries

## [1.0.0] (Week 14): Server preparation
- Added DATABASE_URL support in env.js and database.js
- Added morgan logging middleware
- Added start:render script for Render deployment

## [1.0.0] (Week 13): Gameplay
- Added sessions, answers, scoring, and leaderboard
- Server-timed scoring with points formula
- One answer per question enforcement (409 ALREADY_ANSWERED)

## [1.0.0] (Week 12): Question bank
- Added levels, questions, choices with full CRUD
- Paging, sort, and search on lists
- Picture upload with 1MB size limit
- Exactly one correct option constraint

## [1.0.0] (Week 12): Accounts, passwords, tokens
- Register, login, me endpoints
- bcrypt password hashing, JWT tokens
- Admin role management

## 1.0.0 (Weeks 10 to 11): foundation
- Users, levels, puzzles, questions, choices, game_sessions, players, answers
- Hub contract: /health, /game-info, /results
