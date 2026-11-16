// Translates between HTTP and the service. No SQL, no business rules.
// req.body never appears here: validated input comes from matchedData.
// Route params (levelId, questionId) are read from req.params.
const { matchedData } = require('express-validator');
const questionService = require('../services/question.service');

function toJson(question) {
  const q = question.toJSON ? question.toJSON() : question;
  delete q.level_id;
  return q;
}

async function listQuestions(req, res) {
  const input = matchedData(req, { locations: ['query', 'params'] });
  const { levelId, ...rest } = input;
  const result = await questionService.listQuestions(Number(levelId), rest);
  res.status(200).json(result);
}

async function getQuestion(req, res) {
  const input = matchedData(req, { locations: ['query', 'params'] });
  const question = await questionService.getQuestion(
    Number(input.levelId),
    Number(input.questionId)
  );
  res.status(200).json(toJson(question));
}

async function createQuestion(req, res) {
  const body = matchedData(req, { locations: ['body'] });
  const question = await questionService.createQuestion(
    Number(req.params.levelId),
    body
  );
  res.status(201).json(toJson(question));
}

async function updateQuestion(req, res) {
  const body = matchedData(req, { locations: ['body'] });
  const question = await questionService.updateQuestion(
    Number(req.params.levelId),
    Number(req.params.questionId),
    body
  );
  res.status(200).json(toJson(question));
}

async function deleteQuestion(req, res) {
  await questionService.deleteQuestion(
    Number(req.params.levelId),
    Number(req.params.questionId)
  );
  res.status(204).end();
}

module.exports = { listQuestions, getQuestion, createQuestion, updateQuestion, deleteQuestion };
