// Rules for questions (CHILD) and choices (OPTION).
// The transaction that creates question + choices lives in the repository.
const { notFound, conflict, badRequest } = require('../errors/app-error');
const questionRepository = require('../repositories/question.repository');
const levelRepository = require('../repositories/level.repository');
const choiceRepository = require('../repositories/choice.repository');
const levelService = require('./level.service');

function toJson(question) {
  const q = question.toJSON ? question.toJSON() : question;
  delete q.level_id;
  return q;
}

async function listQuestions(levelId, { page, limit, q, sort, order }) {
  const level = await levelRepository.findById(levelId);
  if (!level) throw notFound('LEVEL_NOT_FOUND', `No level with id ${levelId}.`);

  const { rows, count } = await questionRepository.findAllPagedForLevel(levelId, {
    page, limit, q, sort, order,
  });
  return { rows: rows.map(toJson), count };
}

async function getQuestion(levelId, questionId) {
  const question = await questionRepository.findForLevelWithChoices(questionId);
  if (!question || question.level_id !== Number(levelId)) {
    throw notFound('QUESTION_NOT_FOUND', `No question with id ${questionId} in level ${levelId}.`);
  }
  return toJson(question);
}

async function createQuestion(levelId, { prompt, explanation, choices }) {
  const level = await levelRepository.findById(levelId);
  if (!level) throw notFound('LEVEL_NOT_FOUND', `No level with id ${levelId}.`);

  // Exactly one correct option.
  const correctCount = choices.filter((c) => c.is_correct).length;
  if (correctCount !== 1) {
    throw badRequest('ONE_CORRECT_OPTION', 'A question must have exactly one correct option.');
  }

  return questionRepository.createWithChoices(levelId, { prompt, explanation, choices });
}

async function updateQuestion(levelId, questionId, changes) {
  const question = await questionRepository.findById(questionId);
  if (!question || question.level_id !== Number(levelId)) {
    throw notFound('QUESTION_NOT_FOUND', `No question with id ${questionId} in level ${levelId}.`);
  }

  await levelService.checkLevelFrozen(levelId);

  return questionRepository.update(question, changes);
}

async function deleteQuestion(levelId, questionId) {
  const question = await questionRepository.findById(questionId);
  if (!question || question.level_id !== Number(levelId)) {
    throw notFound('QUESTION_NOT_FOUND', `No question with id ${questionId} in level ${levelId}.`);
  }

  await levelService.checkLevelFrozen(levelId);

  return questionRepository.destroy(question);
}

async function countCorrectOptions(questionId) {
  return choiceRepository.countCorrect(questionId);
}

module.exports = {
  listQuestions,
  getQuestion,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  countCorrectOptions,
};
