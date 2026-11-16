// Pure scoring function. No database, no fakes, easy to unit test.
//
// points = round(base × (1 − elapsed / (2 × limit)))
// wrong or late → 0
//
// Example: base 1000, limit 20 s, correct at 10 s → 750.
// Edge values: 0 ms → full base; exactly the limit → half; limit+1 ms → 0; wrong → 0.
function pointsFor(question, isCorrect, elapsedMs) {
  if (!isCorrect) return 0;
  const base = Number(question.base_points) || 0;
  const limit = Number(question.time_limit) || 0;
  if (base <= 0 || limit <= 0) return 0;
  // Late answer: elapsed beyond the limit scores 0.
  if (elapsedMs > limit * 1000) return 0;
  const points = Math.round(base * (1 - elapsedMs / (2 * limit * 1000)));
  return points < 0 ? 0 : points;
}

module.exports = { pointsFor };
