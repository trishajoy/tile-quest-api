# User guide: Tile Quest API

How each kind of user works with the API. Base URL: `http://localhost:3001/api/v1` locally (live API at the Render URL). Every endpoint can be tried in Swagger UI at `/docs/`.

## Players

1. Register an account: `POST /auth/register` with `school_id`, `full_name`, `email`, `password` (8–72 chars, at least one letter and one number). You are always created as a `PLAYER`, even if you ask for `role: ADMIN`.
2. Log in: `POST /auth/login` with `school_id` and `demo password`; receive a `Bearer` token.
3. Keep the token: send `Authorization: Bearer <token>` on every protected request. Wrong password and unknown school ID answer identically (`INVALID_CREDENTIALS`).
4. Join a game: ask the host for the session code; `GET /sessions/:code/question` returns the current question and options (never `is_correct`).
5. Play: `POST /sessions/:code/answers` with `question_id` and `choice_id`; the server measures elapsed time and awards points. You cannot answer the same question twice.
6. Progress: `GET /sessions/:code/leaderboard` shows scores and ranks (ties share ranks).

A player has completed the game when they have answered every question in the session's set.

## Hosts

1. Prepare content: `POST /levels` creates a game set; `POST /levels/:id/questions` adds questions with choices (exactly one correct option). `PUT /levels/:id/picture` uploads a cover image (PNG/JPEG, max 1 MB).
2. Start a game: `POST /sessions/:code/start` moves LOBBY → RUNNING, sets `current_position = 1` and `question_started_at`.
3. Run the game: `GET /sessions/:code/question` shows the current question; `POST /sessions/:code/advance` moves to the next question (only `current + 1`); `POST /sessions/:code/close` sets `ended_at` and publishes results to `/results`.

## Admins

The first admin on a new server is created by `scripts/create-admin.js` using `ADMIN_SCHOOL_ID` and `ADMIN_PASSWORD` (set in Render, never in a file). Admins can:
- `GET /users` — list all accounts
- `PATCH /users/:id/role` — promote/demote accounts (cannot change your own role)

## The Library Game Hub

The Hub reads finished games via `GET /results` with the `X-Hub-Key` header. Optional `?since=` filters to games ended after that date/time. Each game lists session code, start/end times, players (school_id, nickname, score, completed), and a podium (top 3 completed players by score).

## When something goes wrong

All errors answer `{ "error": { "code", "message" } }`. Common codes:
- `401 AUTH_REQUIRED` — no login token
- `401 INVALID_TOKEN` — bad/expired token
- `401 INVALID_CREDENTIALS` — wrong password or unknown school ID (identical response)
- `403 FORBIDDEN` — logged in but not allowed (e.g. player on admin route)
- `400 VALIDATION_FAILED` — malformed input
- `404 ..._NOT_FOUND` — item missing
- `409 ..._TAKEN`, `ALREADY_ANSWERED`, `NOT_NEXT_QUESTION`, `CANNOT_CHANGE_OWN_ROLE` — well-formed but clashes with state
- `413 FILE_TOO_LARGE` — upload over 1 MB
