# Data dictionary

Generated from the database by `npm run docs:dictionary` on 2026-11-17, then described by hand.

### `answers`

| Column | Type | Null | Default | Keys and rules | Description |
|---|---|---|---|---|---|
| `id` | integer | no | auto number | PK | Primary key of the answer record. |
| `player_id` | integer | no |  | FK REFERENCES players(id) ON UPDATE CASCADE ON DELETE CASCADE; UNIQUE (uq_answers_player_question) | References the player who answered; paired with question_id to ensure one answer per player per question. |
| `question_id` | integer | no |  | FK REFERENCES questions(id) ON UPDATE CASCADE ON DELETE RESTRICT; UNIQUE (uq_answers_player_question) | References the question that was answered; paired with player_id to ensure one answer per player per question. |
| `choice_id` | integer | no |  | FK REFERENCES choices(id) ON UPDATE CASCADE ON DELETE RESTRICT | References the selected answer choice; determines whether the answer is correct. |
| `is_correct` | boolean | no |  |  | Whether the selected choice was the correct answer; computed from the choice at answer time. |
| `answered_at` | timestamp with time zone | no | `now()` |  | When the answer was submitted, measured by the server for scoring. |
| `created_at` | timestamp with time zone | no | `now()` |  | Record creation timestamp (Sequelize-managed). |
| `updated_at` | timestamp with time zone | no | `now()` |  | Record update timestamp (Sequelize-managed). |

### `choices`

| Column | Type | Null | Default | Keys and rules | Description |
|---|---|---|---|---|---|
| `id` | integer | no | auto number | PK | Primary key of the answer choice. |
| `question_id` | integer | no |  | FK REFERENCES questions(id) ON UPDATE CASCADE ON DELETE CASCADE | References the question this choice belongs to; cascade deletes choices when a question is removed. |
| `choice_text` | character varying(255) | no |  |  | The text of the answer choice displayed to players. |
| `is_correct` | boolean | no | `false` |  | Whether this choice is the correct answer; exactly one choice per question must be true (enforced by uq_choices_one_correct_per_question). |
| `created_at` | timestamp with time zone | no | `now()` |  | Record creation timestamp (Sequelize-managed). |
| `updated_at` | timestamp with time zone | no | `now()` |  | Record update timestamp (Sequelize-managed). |

### `game_sessions`

| Column | Type | Null | Default | Keys and rules | Description |
|---|---|---|---|---|---|
| `id` | integer | no | auto number | PK | Primary key of the game session. |
| `session_code` | character varying(10) | no |  | UNIQUE (uq_game_sessions_session_code) | Six-digit join code players use to join the game; unique across all sessions. |
| `level_id` | integer | no |  | FK REFERENCES levels(id) ON UPDATE CASCADE ON DELETE RESTRICT | References the game set (level) this session plays; defines which questions are available. |
| `started_at` | timestamp with time zone | no | `now()` | CHECK (ck_game_sessions_times) | When the session was created; must be before or equal to ended_at. |
| `ended_at` | timestamp with time zone | yes |  | CHECK (ck_game_sessions_times) | When the game was closed; null while the game is running; null means the game is not finished. |
| `created_at` | timestamp with time zone | no | `now()` |  | Record creation timestamp (Sequelize-managed). |
| `updated_at` | timestamp with time zone | no | `now()` |  | Record update timestamp (Sequelize-managed). |
| `question_started_at` | timestamp with time zone | yes |  |  | When the current question started; used to compute elapsed time for scoring; null when not running or between questions. |
| `current_position` | integer | no | `0` |  | The current question number (1-based) in the game set; 0 means the game is in LOBBY state, not yet started. |

### `levels`

| Column | Type | Null | Default | Keys and rules | Description |
|---|---|---|---|---|---|
| `id` | integer | no | auto number | PK | Primary key of the game set (level). |
| `level_number` | integer | no |  | CHECK (ck_levels_level_number); UNIQUE (uq_levels_level_number) | Sequential number of the level (1, 2, 3...); must be positive and unique. |
| `name` | character varying(100) | no |  |  | Display name of the level, e.g. "Meadow Gate". |
| `pass_score` | integer | no | `70` | CHECK (ck_levels_pass_score) | Minimum score to pass the level; between 0 and 100. |
| `created_at` | timestamp with time zone | no | `now()` |  | Record creation timestamp (Sequelize-managed). |
| `updated_at` | timestamp with time zone | no | `now()` |  | Record update timestamp (Sequelize-managed). |
| `picture` | character varying(500) | yes |  |  | Optional URL to an uploaded cover image for the level; nullable if no picture has been uploaded. |

### `players`

| Column | Type | Null | Default | Keys and rules | Description |
|---|---|---|---|---|---|
| `id` | integer | no | auto number | PK | Primary key of the player seat in a session. |
| `game_session_id` | integer | no |  | FK REFERENCES game_sessions(id) ON UPDATE CASCADE ON DELETE CASCADE; UNIQUE (uq_players_session_user) | References the game session this player seat belongs to; paired with user_id to ensure one seat per account per game. |
| `user_id` | integer | no |  | FK REFERENCES users(user_id) ON UPDATE CASCADE ON DELETE RESTRICT; UNIQUE (uq_players_session_user) | References the user account playing; paired with game_session_id to ensure one seat per account per game. |
| `nickname` | character varying(30) | no |  |  | Display name the player uses in this game session; shown in leaderboards and results. |
| `score` | integer | no | `0` | CHECK (ck_players_score) | Accumulated points from correct answers; must be non-negative. |
| `completed` | boolean | no | `false` |  | Whether the player answered every question in the set; set to true when the last question is answered. |
| `created_at` | timestamp with time zone | no | `now()` |  | Record creation timestamp (Sequelize-managed). |
| `updated_at` | timestamp with time zone | no | `now()` |  | Record update timestamp (Sequelize-managed). |

### `puzzles`

| Column | Type | Null | Default | Keys and rules | Description |
|---|---|---|---|---|---|
| `id` | integer | no | auto number | PK | Primary key of the tile puzzle. |
| `level_id` | integer | no |  | FK REFERENCES levels(id) ON UPDATE CASCADE ON DELETE RESTRICT | References the level this puzzle belongs to. |
| `title` | character varying(255) | no |  |  | Display name of the puzzle. |
| `grid_rows` | integer | no |  | CHECK (ck_puzzles_grid) | Number of rows in the tile grid; must be positive. |
| `grid_cols` | integer | no |  | CHECK (ck_puzzles_grid) | Number of columns in the tile grid; must be positive. |
| `tile_layout` | jsonb | no |  |  | JSON representation of the tile arrangement on the grid. |
| `created_at` | timestamp with time zone | no | `now()` |  | Record creation timestamp (Sequelize-managed). |
| `updated_at` | timestamp with time zone | no | `now()` |  | Record update timestamp (Sequelize-managed). |

### `questions`

| Column | Type | Null | Default | Keys and rules | Description |
|---|---|---|---|---|---|
| `id` | integer | no | auto number | PK | Primary key of the question. |
| `level_id` | integer | no |  | FK REFERENCES levels(id) ON UPDATE CASCADE ON DELETE RESTRICT | References the level (game set) this question belongs to. |
| `prompt` | text | no |  |  | The question text shown to players. |
| `explanation` | text | yes |  |  | Optional explanation shown after answering; may be null. |
| `created_at` | timestamp with time zone | no | `now()` |  | Record creation timestamp (Sequelize-managed). |
| `updated_at` | timestamp with time zone | no | `now()` |  | Record update timestamp (Sequelize-managed). |
| `position` | integer | yes |  |  | Server-set order of the question within the level's set (1-based); null until assigned. |
| `time_limit` | integer | no | `20` |  | Time limit in seconds for answering this question; used for scoring (full points at 0 ms, half at limit, 0 after limit). |
| `base_points` | integer | no | `1000` |  | Maximum points available for this question; points decrease linearly with elapsed time up to the time limit. |

### `users`

| Column | Type | Null | Default | Keys and rules | Description |
|---|---|---|---|---|---|
| `user_id` | integer | no | auto number | PK | Primary key of the user account. |
| `school_id` | character varying(20) | no |  | UNIQUE (uq_users_school_id) | Unique school ID used for login; format `2099-XXXX`; used instead of email for account identification. |
| `full_name` | character varying(120) | no |  |  | Full name of the user account holder. |
| `email` | character varying(150) | no |  | UNIQUE (uq_users_email) | Unique email address of the user account. |
| `role` | character varying(10) | no | `'player'` | CHECK (ck_users_role) | Role of the account: `player`, `host`, or `admin`; register always creates `PLAYER`. |
| `created_at` | timestamp with time zone | no | `now()` |  | Record creation timestamp (Sequelize-managed). |
| `updated_at` | timestamp with time zone | no | `now()` |  | Record update timestamp (Sequelize-managed). |
| `password_hash` | character varying(60) | yes |  |  | bcrypt hash of the account password; hidden by default (scope `withPassword`); null for accounts without a password. |

