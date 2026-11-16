// HTTP tests for level endpoints. Real requests through the whole app to the TEST database.
const { app, request, bearer } = require('../setup/helpers');
const { sequelize } = require('../../src/models');

afterAll(() => sequelize.close());

describe('GET /levels', () => {
  test('lists levels with paging envelope', async () => {
    const res = await request(app).get('/api/v1/levels?page=1&limit=10');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body).toHaveProperty('meta');
    expect(res.body.meta).toHaveProperty('page');
    expect(res.body.meta).toHaveProperty('limit');
    expect(res.body.meta).toHaveProperty('total');
    expect(res.body.meta).toHaveProperty('pages');
  });

  test('empty list is still 200', async () => {
    const res = await request(app).get('/api/v1/levels?page=999&limit=10');
    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([]);
    expect(res.body.meta.total).toBeGreaterThan(0);
  });
});

describe('GET /levels/:id', () => {
  test('returns a single level', async () => {
    const res = await request(app).get('/api/v1/levels/1');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('name');
  });

  test('404 for missing level', async () => {
    const res = await request(app).get('/api/v1/levels/99999');
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('LEVEL_NOT_FOUND');
  });
});

describe('GET /levels/:id?include=children', () => {
  test('returns level with questions and choices', async () => {
    const res = await request(app).get('/api/v1/levels/1?include=children');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('questions');
    expect(Array.isArray(res.body.questions)).toBe(true);
    if (res.body.questions.length > 0) {
      expect(res.body.questions[0]).toHaveProperty('choices');
    }
  });
});

describe('POST /levels (admin only)', () => {
  let adminToken;

  beforeAll(async () => {
    const res = await request(app).post('/api/v1/auth/login').send({
      school_id: '2099-0001',
      password: 'TileQuest-Demo-2026',
    });
    adminToken = res.body.token;
  });

  test('creates a level, answers 201', async () => {
    const res = await request(app)
      .post('/api/v1/levels')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ level_number: 99, name: 'Test Level', pass_score: 70 });
    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Test Level');
    expect(res.body.level_number).toBe(99);
  });

  test('player token gets 403', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({
      school_id: '2099-0002',
      password: 'TileQuest-Demo-2026',
    });
    const playerToken = res.body.token;
    const res2 = await request(app)
      .post('/api/v1/levels')
      .set('Authorization', `Bearer ${playerToken}`)
      .send({ level_number: 98, name: 'Player Level', pass_score: 70 });
    expect(res2.status).toBe(403);
  });

  test('no token gets 401', async () => {
    const res = await request(app)
      .post('/api/v1/levels')
      .send({ level_number: 97, name: 'No Token', pass_score: 70 });
    expect(res.status).toBe(401);
  });
});
