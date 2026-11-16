// HTTP tests for session endpoints. Real requests through the whole app to the TEST database.
const { app, request, bearer } = require('../setup/helpers');
const { sequelize } = require('../../src/models');

afterAll(() => sequelize.close());

let adminToken;

beforeAll(async () => {
  const res = await request(app).post('/api/v1/auth/login').send({
    school_id: '2099-0001',
    password: 'TileQuest-Demo-2026',
  });
  adminToken = res.body.token;
});

describe('POST /sessions/:code/start', () => {
  test('starts a session, 200', async () => {
    const res = await request(app)
      .post('/api/v1/sessions/100001/start')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.session.current_position).toBe(1);
    expect(res.body.session.question_started_at).toBeDefined();
  });

  test('already running -> 409', async () => {
    const res = await request(app)
      .post('/api/v1/sessions/100001/start')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(409);
    expect(res.body.error.code).toBe('ALREADY_IN_GAME');
  });

  test('no token -> 401', async () => {
    const res = await request(app).post('/api/v1/sessions/100001/start');
    expect(res.status).toBe(401);
  });
});

describe('GET /sessions/:code/question', () => {
  test('returns current question, never is_correct', async () => {
    const res = await request(app)
      .get('/api/v1/sessions/100001/question')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.question).toHaveProperty('choices');
    // is_correct should never be exposed to clients
    const bodyStr = JSON.stringify(res.body.question);
    expect(bodyStr).not.toContain('is_correct');
  });

  test('not running -> 404', async () => {
    const res = await request(app)
      .get('/api/v1/sessions/99999/question')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(404);
  });
});

describe('POST /sessions/:code/close', () => {
  test('closes session, 200', async () => {
    const res = await request(app)
      .post('/api/v1/sessions/100001/close')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.session.ended_at).toBeDefined();
  });

  test('already closed -> 409', async () => {
    const res = await request(app)
      .post('/api/v1/sessions/100001/close')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(409);
    expect(res.body.error.code).toBe('ALREADY_CLOSED');
  });
});

describe('GET /sessions/:code/leaderboard', () => {
  test('returns ranked players', async () => {
    const res = await request(app)
      .get('/api/v1/sessions/100001/leaderboard')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('leaderboard');
    expect(Array.isArray(res.body.leaderboard)).toBe(true);
  });
});
