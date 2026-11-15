// Rules for the levels resource. Queries live in the repository.
const { notFound, conflict } = require('../errors/app-error');
const levelRepository = require('../repositories/level.repository');
const questionRepository = require('../repositories/question.repository');

function toJson(level) {
  const l = level.toJSON ? level.toJSON() : level;
  return l;
}

async function listLevels({ page, limit, q, sort, order }) {
  const { rows, count } = await levelRepository.findAllPaged({ page, limit, q, sort, order });
  return { rows: rows.map(toJson), count };
}

async function getLevel(levelId) {
  const level = await levelRepository.findById(levelId);
  if (!level) throw notFound('LEVEL_NOT_FOUND', `No level with id ${levelId}.`);
  return toJson(level);
}

async function getLevelWithQuestions(levelId) {
  const level = await levelRepository.findWithQuestions(levelId);
  if (!level) throw notFound('LEVEL_NOT_FOUND', `No level with id ${levelId}.`);
  const l = toJson(level);
  l.questions = (l.questions || []).map((q) => ({
    id: q.id,
    prompt: q.prompt,
    explanation: q.explanation,
    position: q.position,
    choices: (q.choices || []).map((c) => ({
      id: c.id,
      choice_text: c.choice_text,
      is_correct: c.is_correct,
    })),
  }));
  return l;
}

async function checkLevelFrozen(levelId) {
  if (await levelRepository.isUsedByGame(levelId)) {
    throw conflict('LEVEL_FROZEN', 'This level is already used by a game and cannot be changed.');
  }
}

async function createLevel({ level_number, name, pass_score }) {
  return levelRepository.create({ level_number, name, pass_score });
}

async function updateLevel(levelId, changes) {
  const level = await levelRepository.findById(levelId);
  if (!level) throw notFound('LEVEL_NOT_FOUND', `No level with id ${levelId}.`);

  await checkLevelFrozen(levelId);

  return levelRepository.update(level, changes);
}

async function uploadPicture(levelId, pictureUrl) {
  const level = await levelRepository.findById(levelId);
  if (!level) throw notFound('LEVEL_NOT_FOUND', `No level with id ${levelId}.`);
  await checkLevelFrozen(levelId);
  return levelRepository.update(level, { picture: pictureUrl });
}

module.exports = {
  listLevels,
  getLevel,
  getLevelWithQuestions,
  checkLevelFrozen,
  createLevel,
  updateLevel,
  uploadPicture,
};
