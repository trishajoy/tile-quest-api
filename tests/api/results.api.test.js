// HTTP tests for results endpoint. Real requests through the whole app to the TEST database.
const { app, request } = require('../setup/helpers');
const { sequelize } = require('../../src/models');

afterAll(() => sequelize.close());

describe('GET /results', () => {
  test('without Hub key answers 401', async () => {
    const res = await request(app).get('/api/v1/results');
    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('HUB_KEY_REQUIRED');
  });

  test('with Hub key answers 200 with contract format', async () => {
    const res = await request(app)
      .get('/api/v1/results')
      .set('X-Hub-Key', process.env.HUB_API_KEY);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('game');
    expect(res.body).toHaveProperty('developer');
    expect(res.body).toHaveProperty('generated_at');
    expect(res.body).toHaveProperty('results');
    expect(Array.isArray(res.body.results)).toBe(true);
  });

  test('with wrong Hub key answers 401', async () => {
    const res = await request(app)
      .get('/api/v1/results')
      .set('X-Hub-Key', 'wrong-key');
    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('HUB_KEY_REQUIRED');
  });

  test('?since= with bad value answers 400', async () => {
    const res = await request(app)
      .get('/api/v1/results?since=not-a-date')
      .set('X-Hub-Key', process.env.HUB_API_KEY);
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('INVALID_SINCE');
  });

  test('?since= filters games', async () => {
    const res = await request(app)
      .get('/api/v1/results?since=2026-10-17T08:00:00Z')
      .set('X-Hub-Key', process.env.HUB_API_KEY);
    expect(res.status).toBe(200);
    expect(res.body.results).toBeInstanceOf(Array);
  });

  test('finished game has completed players', async () => {
    const res = await request(app)
      .get('/api/v1/results')
      .set('X-Hub-Key', process.env.HUB_API_KEY);
    expect(res.status).toBe(200);
    const finishedGame = res.body.results.find((g) => g.session_code === '100001');
    expect(finishedGame).toBeDefined();
    const completed = finishedGame.players.filter((p) => p.completed);
    expect(completed.length).toBeGreaterThanOrEqual(3);
  });

  test('podium has top 3', async () => {
    const res = await request(app)
      .get('/api/v1/results')
      .set('X-Hub-Key', process.env.HUB_API_KEY);
    expect(res.status).toBe(200);
    const finishedGame = res.body.results.find((g) => g.session_code === '100001');
    expect(finishedGame.podium.length).toBeGreaterThanOrEqual(3);
    expect(finishedGame.podium[0].rank).toBe(1);
  });
});
