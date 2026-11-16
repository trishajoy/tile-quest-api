// Unit tests for scoring.js. Pure function, no database, no mocks.
const { pointsFor } = require('../../src/services/scoring');

function question(base = 1000, limit = 20) {
  return { base_points: base, time_limit: limit };
}

describe('scoring.pointsFor', () => {
  test('0 ms -> full base', () => {
    expect(pointsFor(question(), true, 0)).toBe(1000);
  });
  test('half limit -> 3/4 base', () => {
    expect(pointsFor(question(), true, 10000)).toBe(750);
  });
  test('exactly limit -> half base', () => {
    expect(pointsFor(question(), true, 20000)).toBe(500);
  });
  test('limit + 1 ms -> 0', () => {
    expect(pointsFor(question(), true, 20001)).toBe(0);
  });
  test('wrong answer -> 0', () => {
    expect(pointsFor(question(), false, 1000)).toBe(0);
  });
  test('late answer (way over limit) -> 0', () => {
    expect(pointsFor(question(), true, 100000)).toBe(0);
  });
  test('base 500, limit 10, correct at 5s -> 375', () => {
    expect(pointsFor(question(500, 10), true, 5000)).toBe(375);
  });
  test('rounding rounds down', () => {
    expect(pointsFor(question(100, 10), true, 3333)).toBe(83);
  });
});
