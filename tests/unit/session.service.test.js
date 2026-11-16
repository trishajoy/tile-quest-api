// Unit tests for session.service.js. Repositories are mocked, no database needed.
const { notFound, conflict, forbidden, badRequest } = require('../../src/errors/app-error');

jest.mock('../../src/repositories/session.repository', () => ({
  findByCode: jest.fn(),
  findById: jest.fn(),
  startSession: jest.fn(),
  advanceSession: jest.fn(),
  closeSession: jest.fn(),
  getCurrentQuestion: jest.fn(),
  countQuestionsForLevel: jest.fn(),
  getSessionWithPlayers: jest.fn(),
  countPlayers: jest.fn(),
}));

jest.mock('../../src/repositories/answer.repository', () => ({
  findByPlayerAndQuestion: jest.fn(),
  recordAnswerAndScore: jest.fn(),
  countAnswersForPlayer: jest.fn(),
}));

jest.mock('../../src/repositories/player.repository', () => ({
  findById: jest.fn(),
  findBySessionAndUser: jest.fn(),
  findBySession: jest.fn(),
  createPlayer: jest.fn(),
  setCompleted: jest.fn(),
  getUser: jest.fn(),
}));

jest.mock('../../src/services/scoring', () => ({
  pointsFor: jest.fn(),
}));

const sessionRepository = require('../../src/repositories/session.repository');
const answerRepository = require('../../src/repositories/answer.repository');
const playerRepository = require('../../src/repositories/player.repository');
const scoring = require('../../src/services/scoring');

const sessionService = require('../../src/services/session.service');

describe('session.service.startSession', () => {
  beforeEach(() => jest.clearAllMocks());

  test('starts a LOBBY game -> RUNNING', async () => {
    sessionRepository.findByCode.mockResolvedValue({
      id: 1,
      session_code: '100001',
      level_id: 1,
      current_position: 0,
      ended_at: null,
    });
    sessionRepository.countQuestionsForLevel.mockResolvedValue(4);
    sessionRepository.startSession.mockResolvedValue({ id: 1, current_position: 1 });

    const result = await sessionService.startSession('100001', 1);

    expect(sessionRepository.startSession).toHaveBeenCalled();
    expect(result.current_position).toBe(1);
  });

  test('already running -> 409 ALREADY_IN_GAME', async () => {
    sessionRepository.findByCode.mockResolvedValue({
      id: 1,
      session_code: '100001',
      current_position: 1,
      ended_at: null,
    });

    await expect(sessionService.startSession('100001', 1)).rejects.toMatchObject({
      status: 409,
      code: 'ALREADY_IN_GAME',
    });
  });

  test('session not found -> 404', async () => {
    sessionRepository.findByCode.mockResolvedValue(null);

    await expect(sessionService.startSession('99999', 1)).rejects.toMatchObject({
      status: 404,
      code: 'SESSION_NOT_FOUND',
    });
  });

  test('no questions -> 409 NO_QUESTIONS', async () => {
    sessionRepository.findByCode.mockResolvedValue({
      id: 1,
      session_code: '100001',
      current_position: 0,
      ended_at: null,
      level_id: 1,
    });
    sessionRepository.countQuestionsForLevel.mockResolvedValue(0);

    await expect(sessionService.startSession('100001', 1)).rejects.toMatchObject({
      status: 409,
      code: 'NO_QUESTIONS',
    });
  });
});

describe('session.service.advanceSession', () => {
  beforeEach(() => jest.clearAllMocks());

  test('advances to next question', async () => {
    sessionRepository.findByCode.mockResolvedValue({
      id: 1,
      session_code: '100001',
      current_position: 1,
      ended_at: null,
      level_id: 1,
    });
    sessionRepository.countQuestionsForLevel.mockResolvedValue(4);
    sessionRepository.advanceSession.mockResolvedValue({ id: 1, current_position: 2 });

    const result = await sessionService.advanceSession('100001', 1, 2);

    expect(result.current_position).toBe(2);
  });

  test('not running -> 409', async () => {
    sessionRepository.findByCode.mockResolvedValue({
      id: 1,
      session_code: '100001',
      current_position: 0,
      ended_at: null,
    });

    await expect(sessionService.advanceSession('100001', 1, 1)).rejects.toMatchObject({
      status: 409,
      code: 'NOT_RUNNING',
    });
  });

  test('not next question -> 409 NOT_NEXT_QUESTION', async () => {
    sessionRepository.findByCode.mockResolvedValue({
      id: 1,
      session_code: '100001',
      current_position: 1,
      ended_at: null,
      level_id: 1,
    });
    sessionRepository.countQuestionsForLevel.mockResolvedValue(4);

    await expect(sessionService.advanceSession('100001', 1, 3)).rejects.toMatchObject({
      status: 409,
      code: 'NOT_NEXT_QUESTION',
    });
  });

  test('no more questions -> 409 NO_MORE_QUESTIONS', async () => {
    sessionRepository.findByCode.mockResolvedValue({
      id: 1,
      session_code: '100001',
      current_position: 4,
      ended_at: null,
      level_id: 1,
    });
    sessionRepository.countQuestionsForLevel.mockResolvedValue(4);

    await expect(sessionService.advanceSession('100001', 1, 5)).rejects.toMatchObject({
      status: 409,
      code: 'NO_MORE_QUESTIONS',
    });
  });
});

describe('session.service.submitAnswer', () => {
  beforeEach(() => jest.clearAllMocks());

  test('records answer and score', async () => {
    const session = {
      id: 1,
      session_code: '100001',
      current_position: 1,
      ended_at: null,
      level_id: 1,
      question_started_at: new Date(Date.now() - 5000),
    };
    sessionRepository.findByCode.mockResolvedValue(session);
    playerRepository.findBySessionAndUser.mockResolvedValue({ id: 5, user_id: 1 });
    sessionRepository.getCurrentQuestion.mockResolvedValue({
      id: 1,
      level_id: 1,
      position: 1,
      choices: [
        { id: 1, is_correct: true },
        { id: 2, is_correct: false },
      ],
      toJSON: () => ({ id: 1, level_id: 1, position: 1, base_points: 1000, time_limit: 20 }),
    });
    answerRepository.findByPlayerAndQuestion.mockResolvedValue(null);
    answerRepository.countAnswersForPlayer.mockResolvedValue(1);
    sessionRepository.countQuestionsForLevel.mockResolvedValue(1);
    scoring.pointsFor.mockReturnValue(750);
    answerRepository.recordAnswerAndScore.mockResolvedValue({ id: 10 });
    playerRepository.setCompleted.mockResolvedValue({ id: 5, completed: true });

    const result = await sessionService.submitAnswer('100001', 1, 1, 1);

    expect(result.points).toBe(750);
    expect(result.is_correct).toBe(true);
    expect(answerRepository.recordAnswerAndScore).toHaveBeenCalledWith(5, 1, 1, true, 750);
    expect(playerRepository.setCompleted).toHaveBeenCalledWith(5, true);
  });

  test('not running -> 409', async () => {
    sessionRepository.findByCode.mockResolvedValue({
      id: 1,
      session_code: '100001',
      current_position: 0,
      ended_at: null,
    });

    await expect(sessionService.submitAnswer('100001', 1, 1, 1)).rejects.toMatchObject({
      status: 409,
      code: 'NOT_RUNNING',
    });
  });

  test('not seated -> 403', async () => {
    sessionRepository.findByCode.mockResolvedValue({
      id: 1,
      session_code: '100001',
      current_position: 1,
      ended_at: null,
      level_id: 1,
    });
    playerRepository.findBySessionAndUser.mockResolvedValue(null);

    await expect(sessionService.submitAnswer('100001', 1, 1, 1)).rejects.toMatchObject({
      status: 403,
      code: 'FORBIDDEN',
    });
    expect(playerRepository.findBySessionAndUser).toHaveBeenCalledWith(1, 1);
  });

  test('already answered -> 409 ALREADY_ANSWERED', async () => {
    sessionRepository.findByCode.mockResolvedValue({
      id: 1,
      session_code: '100001',
      current_position: 1,
      ended_at: null,
      level_id: 1,
    });
    playerRepository.findBySessionAndUser.mockResolvedValue({ id: 5, user_id: 1 });
    sessionRepository.getCurrentQuestion.mockResolvedValue({
      id: 1,
      level_id: 1,
      position: 1,
      choices: [{ id: 1, is_correct: true }],
    });
    answerRepository.findByPlayerAndQuestion.mockResolvedValue({ id: 1 });

    await expect(sessionService.submitAnswer('100001', 1, 1, 1)).rejects.toMatchObject({
      status: 409,
      code: 'ALREADY_ANSWERED',
    });
  });
});

describe('session.service.closeSession', () => {
  beforeEach(() => jest.clearAllMocks());

  test('closes a running session', async () => {
    sessionRepository.findByCode.mockResolvedValue({
      id: 1,
      session_code: '100001',
      ended_at: null,
    });
    sessionRepository.closeSession.mockResolvedValue({ id: 1, ended_at: new Date() });

    const result = await sessionService.closeSession('100001', 1);

    expect(result.ended_at).toBeDefined();
  });

  test('already closed -> 409', async () => {
    sessionRepository.findByCode.mockResolvedValue({
      id: 1,
      session_code: '100001',
      ended_at: new Date(),
    });

    await expect(sessionService.closeSession('100001', 1)).rejects.toMatchObject({
      status: 409,
      code: 'ALREADY_CLOSED',
    });
  });
});

describe('session.service.getLeaderboard', () => {
  beforeEach(() => jest.clearAllMocks());

  test('returns ranked players', async () => {
    sessionRepository.findByCode.mockResolvedValue({ id: 1, session_code: '100001' });
    playerRepository.findBySession.mockResolvedValue([
      { user_id: 1, nickname: 'Milo', score: 90, completed: true },
      { user_id: 2, nickname: 'Jordan', score: 85, completed: true },
    ]);
    playerRepository.getUser
      .mockResolvedValueOnce({ user_id: 1, school_id: '2099-0003' })
      .mockResolvedValueOnce({ user_id: 2, school_id: '2099-0002' });

    const result = await sessionService.getLeaderboard('100001', 1, 10);

    expect(result.length).toBe(2);
    expect(result[0].rank).toBe(1);
    expect(result[1].rank).toBe(2);
  });
});

describe('session.service.rankByScore', () => {
  test('ties share ranks', () => {
    const players = [
      { nickname: 'A', score: 100 },
      { nickname: 'B', score: 100 },
      { nickname: 'C', score: 50 },
    ];
    const ranked = sessionService.rankByScore(players);
    expect(ranked[0].rank).toBe(1);
    expect(ranked[1].rank).toBe(1);
    expect(ranked[2].rank).toBe(3);
  });
});
