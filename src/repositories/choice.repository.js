// Queries for the choices table.
const { Choice } = require('../models');

async function findByQuestion(questionId) {
  return Choice.findAll({
    where: { question_id: questionId },
    order: [['id', 'asc']],
  });
}

async function countCorrect(questionId) {
  return Choice.count({ where: { question_id: questionId, is_correct: true } });
}

module.exports = { findByQuestion, countCorrect };
