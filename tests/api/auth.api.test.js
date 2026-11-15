// HTTP tests for auth endpoints. Real requests through the whole app to the TEST database.
const { app, request, bearer } = require('../setup/helpers');
const { sequelize } = require('../../src/models');

afterAll(() => sequelize.close());

describe('POST /auth/register', () => {
  test('registers a new account as PLAYER, answers 201', async () => {
    const res = await request(app).post('/api/v1/auth/register').send({
      school_id: '2099-9901',
      full_name: 'Register User',
      email: 'register@test.com',
      password: 'RegisterPass123',
    });
    expect(res.status).toBe(201);
    expect(res.body.user.role).toBe('PLAYER');
    expect(res.body.user.password_hash).toBeUndefined();
  });

  test('same school ID answers 409 SCHOOL_ID_TAKEN', async () => {
    const res = await request(app).post('/api/v1/auth/register').send({
      school_id: '2099-9901',
      full_name: 'Dup',
      email: 'dup@test.com',
      password: 'DupPass123',
    });
    expect(res.status).toBe(409);
    expect(res.body.error.code).toBe('SCHOOL_ID_TAKEN');
  });

  test('same email answers 409 EMAIL_TAKEN', async () => {
    const res = await request(app).post('/api/v1/auth/register').send({
      school_id: '2099-9902',
      full_name: 'Email Dup',
      email: 'register@test.com',
      password: 'EmailDupPass123',
    });
    expect(res.status).toBe(409);
    expect(res.body.error.code).toBe('EMAIL_TAKEN');
  });

  test('weak password answers 400 VALIDATION_FAILED', async () => {
    const res = await request(app).post('/api/v1/auth/register').send({
      school_id: '2099-9903',
      full_name: 'Weak',
      email: 'weak@test.com',
      password: 'short',
    });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_FAILED');
  });

  test('body asks role ADMIN but account comes back PLAYER', async () => {
    const res = await request(app).post('/api/v1/auth/register').send({
      school_id: '2099-9904',
      full_name: 'Wants Admin',
      email: 'wantsadmin@test.com',
      password: 'AdminPass123',
      role: 'ADMIN',
    });
    expect(res.status).toBe(201);
    expect(res.body.user.role).toBe('PLAYER');
  });
});

describe('POST /auth/login', () => {
  test('login with demo password answers 200 with token', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({
      school_id: '2099-0001',
      password: 'TileQuest-Demo-2026',
    });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.token_type).toBe('Bearer');
    expect(res.body.expires_in).toBe(3600);
    expect(res.body.user.password_hash).toBeUndefined();
  });

  test('wrong password answers 401 INVALID_CREDENTIALS', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({
      school_id: '2099-0001',
      password: 'wrong-password',
    });
    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('INVALID_CREDENTIALS');
    expect(res.body.error.message).toBe('Wrong school ID or password.');
  });

  test('unknown school ID answers 401 with identical body', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({
      school_id: '9999-9999',
      password: 'TileQuest-Demo-2026',
    });
    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('INVALID_CREDENTIALS');
    expect(res.body.error.message).toBe('Wrong school ID or password.');
  });
});

describe('GET /auth/me', () => {
  let adminToken;

  beforeAll(async () => {
    const res = await request(app).post('/api/v1/auth/login').send({
      school_id: '2099-0001',
      password: 'TileQuest-Demo-2026',
    });
    adminToken = res.body.token;
  });

  test('with valid token answers 200 with account', async () => {
    const res = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.user.school_id).toBe('2099-0001');
    expect(res.body.user.role).toBe('admin');
    expect(res.body.user.password_hash).toBeUndefined();
  });

  test('no token answers 401 AUTH_REQUIRED', async () => {
    const res = await request(app).get('/api/v1/auth/me');
    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('AUTH_REQUIRED');
  });

  test('changed token answers 401 INVALID_TOKEN', async () => {
    const res = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', 'Bearer wrong-token');
    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('INVALID_TOKEN');
  });

  test('X-Demo-User only answers 401', async () => {
    const res = await request(app)
      .get('/api/v1/auth/me')
      .set('X-Demo-User', '2099-0001');
    expect(res.status).toBe(401);
  });
});
