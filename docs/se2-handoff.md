# SE2 handoff: building the Tile Quest frontend

## Connection

| Item | Value |
|---|---|
| Base URL (production) | [your Render URL]/api/v1 |
| Base URL (local) | http://localhost:3001/api/v1 |
| Contract | Hub Contract v1.3; Swagger UI at `/docs/`, `src/docs/openapi.yaml` |
| CORS | Add your frontend origin to `CORS_ORIGINS` (comma-separated) |
| Login | POST /auth/login with school_id + password; store the Bearer token; send `Authorization: Bearer <token>` on protected routes; on 401 INVALID_TOKEN, prompt re-login |
| First request | The free Render service sleeps after 15 min; first request takes ~1 min cold start |

## Screens and the endpoints they use

| Screen | Endpoints |
|---|---|
| Login screen | POST /auth/login |
| Registration screen | POST /auth/register |
| Host dashboard / game creation | POST /levels, POST /levels/:id/questions, PUT /levels/:id/picture, POST /sessions/:code/start, POST /sessions/:code/advance, POST /sessions/:code/close |
| Player game screen | GET /sessions/:code/question, POST /sessions/:code/answers |
| Leaderboard screen | GET /sessions/:code/leaderboard |
| Host results / Hub | GET /results (with X-Hub-Key) |

## Known limits and the SE2 backlog

1. Free Render service sleeps after 15 min; ~1 min cold start on first request.
2. Free Render database expires 30 days after creation; must be renewed.
3. No persistent disk on free Render plan; uploaded pictures vanish on restart.
4. No persistent WebSocket support; real-time updates require polling.
5. Only 6 predefined levels seed with questions; SE2 could add a level/question editor UI.
