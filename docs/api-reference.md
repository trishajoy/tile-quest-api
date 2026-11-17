# API reference: Tile Quest API 1.0.0

Generated from `src/docs/openapi.yaml` by `npm run docs:api`. Base URL: `/api/v1`. Try every endpoint in Swagger UI at `/api/v1/docs/`.

Every error answers `{ "error": { "code": "...", "message": "..." } }`. "Login" means the header `Authorization: Bearer <token>`.

## Hub Contract

| Method | Path | What it does | Needs | Answers |
|---|---|---|---|---|
| GET | `/health` | Is the API up, and can it reach the database? | nothing | 200, 503 |
| GET | `/game-info` | What the Hub shows about this game | nothing | 200 |
| GET | `/results` | Finished games, every player, and the podium (rule 7) | X-Hub-Key | 200, 400, 401 |

## Accounts

| Method | Path | What it does | Needs | Answers |
|---|---|---|---|---|
| POST | `/auth/register` | Create a PLAYER account | nothing | 201, 400, 409 |
| POST | `/auth/login` | School ID and password in, a token out | nothing | 200, 400, 401 |
| GET | `/auth/me` | The account of the token | login | 200, 401 |
| GET | `/users` | List all accounts (admin only) | login | 200, 401, 403 |
| PATCH | `/users/{id}/role` | Change an account's role (admin only) | login | 200, 401, 403, 404, 409 |

## Question Bank

| Method | Path | What it does | Needs | Answers |
|---|---|---|---|---|
| GET | `/levels` | List game sets (levels) with paging | nothing | 200 |
| POST | `/levels` | Create a game set (host or admin only) | login | 201, 400, 401, 403 |
| GET | `/levels/{id}` | Get a game set by ID | nothing | 200, 404 |
| PATCH | `/levels/{id}` | Update a game set (host or admin only) | login | 200, 401, 403, 404, 409 |
| PUT | `/levels/{id}/picture` | Upload a picture for a game set (host or admin only) | login | 200, 400, 401, 403, 404, 409, 413 |
| GET | `/levels/{levelId}/questions` | List questions for a game set with paging | nothing | 200, 404 |
| POST | `/levels/{levelId}/questions` | Create a question with choices (host or admin only) | login | 201, 400, 401, 403, 404, 409 |
| GET | `/levels/{levelId}/questions/{questionId}` | Get a question with its choices | nothing | 200, 404 |
| PATCH | `/levels/{levelId}/questions/{questionId}` | Update a question (host or admin only) | login | 200, 401, 403, 404, 409 |
| DELETE | `/levels/{levelId}/questions/{questionId}` | Delete a question (host or admin only) | login | 204, 401, 403, 404, 409 |

## Gameplay

| Method | Path | What it does | Needs | Answers |
|---|---|---|---|---|
| POST | `/sessions/{code}/start` | Start a game session (LOBBY → RUNNING) | login | 200, 401, 403, 404, 409 |
| POST | `/sessions/{code}/advance` | Advance to the next question | login | 200, 401, 403, 404, 409 |
| POST | `/sessions/{code}/close` | Close a game session (sets ended_at) | login | 200, 401, 403, 404, 409 |
| GET | `/sessions/{code}/question` | Current question and options (never is_correct) | login | 200, 401, 403, 404, 409 |
| POST | `/sessions/{code}/answers` | Submit an answer (server-timed scoring) | login | 200, 400, 401, 403, 404, 409 |
| GET | `/sessions/{code}/leaderboard` | Live leaderboard (ties share ranks) | login | 200, 401, 403, 404 |

