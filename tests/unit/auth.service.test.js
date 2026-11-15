// Unit tests for the auth service. The repository is mocked so no database is needed.
const { AppError } = require('../../src/errors/app-error');

jest.mock('../../src/repositories/user.repository', () => ({
  findBySchoolId: jest.fn(),
  findByEmail: jest.fn(),
  findForLogin: jest.fn(),
  create: jest.fn(),
  sequelize: { query: jest.fn() },
}));

const userRepository = require('../../src/repositories/user.repository');
const password = require('../../src/security/password');
const token = require('../../src/security/token');

jest.mock('../../src/security/password', () => ({
  hash: jest.fn(),
  matches: jest.fn(),
}));
jest.mock('../../src/security/token', () => ({
  issue: jest.fn(),
}));

const authService = require('../../src/services/auth.service');

describe('auth.service.register', () => {
  beforeEach(() => jest.clearAllMocks());

  test('hashes password and creates a PLAYER', async () => {
    password.hash.mockResolvedValue('$2b$10$hashed');
    userRepository.create.mockResolvedValue({
      user_id: 1,
      school_id: '2099-9901',
      role: 'PLAYER',
      toJSON: () => ({ user_id: 1, school_id: '2099-9901', role: 'PLAYER' }),
    });

    const user = await authService.register({
      school_id: '2099-9901',
      full_name: 'Test',
      email: 'test@test.com',
      password: 'Pass123',
    });

    expect(password.hash).toHaveBeenCalledWith('Pass123');
    expect(userRepository.create).toHaveBeenCalledWith({
      school_id: '2099-9901',
      full_name: 'Test',
      email: 'test@test.com',
      role: 'PLAYER',
      password_hash: '$2b$10$hashed',
    });
    expect(user.role).toBe('PLAYER');
  });

  test('taken school ID throws 409 SCHOOL_ID_TAKEN', async () => {
    userRepository.findBySchoolId.mockResolvedValue({ user_id: 1 });

    await expect(authService.register({
      school_id: '2099-0001',
      full_name: 'Test',
      email: 'new@test.com',
      password: 'Pass123',
    })).rejects.toMatchObject({ status: 409, code: 'SCHOOL_ID_TAKEN' });
  });

  test('taken email throws 409 EMAIL_TAKEN', async () => {
    userRepository.findBySchoolId.mockResolvedValue(null);
    userRepository.findByEmail.mockResolvedValue({ user_id: 1 });

    await expect(authService.register({
      school_id: '2099-9999',
      full_name: 'Test',
      email: 'taken@test.com',
      password: 'Pass123',
    })).rejects.toMatchObject({ status: 409, code: 'EMAIL_TAKEN' });
  });
});

describe('auth.service.login', () => {
  beforeEach(() => jest.clearAllMocks());

  test('wrong password throws INVALID_CREDENTIALS', async () => {
    userRepository.findForLogin.mockResolvedValue({
      user_id: 1,
      password_hash: '$2b$10$hash',
    });
    password.matches.mockResolvedValue(false);

    await expect(authService.login({
      school_id: '2099-0001',
      password: 'wrong',
    })).rejects.toMatchObject({ status: 401, code: 'INVALID_CREDENTIALS' });
    expect(password.matches).toHaveBeenCalledWith('wrong', '$2b$10$hash');
  });

  test('unknown school ID throws the same INVALID_CREDENTIALS', async () => {
    userRepository.findForLogin.mockResolvedValue(null);
    password.matches.mockResolvedValue(false);

    await expect(authService.login({
      school_id: '9999-9999',
      password: 'anything',
    })).rejects.toMatchObject({ status: 401, code: 'INVALID_CREDENTIALS' });
    expect(password.matches).toHaveBeenCalledWith('anything', null);
  });

  test('valid credentials return token', async () => {
    const user = {
      user_id: 1,
      school_id: '2099-0001',
      role: 'admin',
      password_hash: '$2b$10$hash',
    };
    userRepository.findForLogin.mockResolvedValue(user);
    password.matches.mockResolvedValue(true);
    token.issue.mockReturnValue('fake-token');

    const result = await authService.login({
      school_id: '2099-0001',
      password: 'correct',
    });

    expect(token.issue).toHaveBeenCalledWith(user);
    expect(result.token).toBe('fake-token');
    expect(result.token_type).toBe('Bearer');
    expect(result.expires_in).toBe(3600);
  });
});
