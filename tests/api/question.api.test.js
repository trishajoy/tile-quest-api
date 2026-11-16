// HTTP tests for question endpoints. Real requests through the whole app to the TEST database.
const { app, request, bearer } = require('../setup/helpers');
const { sequelize } = require('../../src/models');

afterAll(() => sequelize.close());

describe('GET /levels/:levelId/questions', () => {
  test('lists questions with paging envelope', async () => {
    const res = await request(app).get('/api/v1/levels/1/questions?page=1&limit=10');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body).toHaveProperty('meta');
  });

  test('404 for missing level', async () => {
    const res = await request(app).get('/api/v1/levels/99999/questions');
    expect(res.status).toBe(404);
  });
});

describe('GET /levels/:levelId/questions/:questionId', () => {
  test('returns a question with choices', async () => {
    const res = await request(app).get('/api/v1/levels/1/questions/1');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('prompt');
    expect(res.body).toHaveProperty('choices');
    expect(Array.isArray(res.body.choices)).toBe(true);
  });

  test('404 for missing question', async () => {
    const res = await request(app).get('/api/v1/levels/1/questions/99999');
    expect(res.status).toBe(404);
  });
});

describe('POST /levels/:levelId/questions (admin only)', () => {
  let adminToken;

  beforeAll(async () => {
    const res = await request(app).post('/api/v1/auth/login').send({
      school_id: '2099-0001',
      password: 'TileQuest-Demo-2026',
    });
    adminToken = res.body.token;
  });

  test('creates a question with choices, 201', async () => {
    const res = await request(app)
      .post('/api/v1/levels/2/questions')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        prompt: 'Test question?',
        choices: [
          { choice_text: 'A', is_correct: false },
          { choice_text: 'B', is_correct: true },
        ],
      });
    expect(res.status).toBe(201);
    expect(res.body.prompt).toBe('Test question?');
    expect(res.body.position).toBeDefined();
  });

  test('two correct options -> 400', async () => {
    const res = await request(app)
      .post('/api/v1/levels/2/questions')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        prompt: 'Bad question?',
        choices: [
          { choice_text: 'A', is_correct: true },
          { choice_text: 'B', is_correct: true },
        ],
      });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('ONE_CORRECT_OPTION');
  });

  test('player token gets 403', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({
      school_id: '2099-0002',
      password: 'TileQuest-Demo-2026',
    });
    const playerToken = res.body.token;
    const res2 = await request(app)
      .post('/api/v1/levels/2/questions')
      .set('Authorization', `Bearer ${playerToken}`)
      .send({
        prompt: 'Player question?',
        choices: [{ choice_text: 'A', is_correct: true }],
      });
    expect(res2.status).toBe(403);
  });
});

describe('PATCH /levels/:levelId/questions/:questionId', () => {
  let adminToken;

  beforeAll(async () => {
    const res = await request(app).post('/api/v1/auth/login').send({
      school_id: '2099-0001',
      password: 'TileQuest-Demo-2026',
    });
    adminToken = res.body.token;
  });

  test('frozen level -> 409', async () => {
    const res = await request(app)
      .patch('/api/v1/levels/1/questions/1')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ prompt: 'Updated question?' });
    expect(res.status).toBe(409);
    expect(res.body.error.code).toBe('LEVEL_FROZEN');
  });
});

describe('DELETE /levels/:levelId/questions/:questionId', () => {
  let adminToken;

  beforeAll(async () => {
    const res = await request(app).post('/api/v1/auth/login').send({
      school_id: '2099-0001',
      password: 'TileQuest-Demo-2026',
    });
    adminToken = res.body.token;
  });

  test('frozen level -> 409', async () => {
    const res = await request(app)
      .delete('/api/v1/levels/1/questions/1')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(409);
    expect(res.body.error.code).toBe('LEVEL_FROZEN');
  });
});
