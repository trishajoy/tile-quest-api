// Queries and transactions for the levels table.
const { Level, Question, Choice } = require('../models');
const { Op } = require('sequelize');
const { toOffset } = require('../utils/paginate');

async function findAllPaged({ page, limit, q, sort, order }) {
  const offset = toOffset({ page, limit }).offset;
  const limitN = toOffset({ page, limit }).limit;

  const where = {};
  if (q) {
    where.name = { [Op.iLike]: `%${q}%` };
  }

  const orderClause = sort ? [[sort, order || 'asc']] : [['level_number', 'asc']];

  const { rows, count } = await Level.findAndCountAll({
    where,
    order: orderClause,
    limit: limitN,
    offset,
    attributes: { exclude: [] },
  });

  return { rows, count };
}

async function findById(levelId) {
  return Level.findByPk(levelId);
}

async function findWithQuestions(levelId) {
  return Level.findByPk(levelId, {
    include: {
      model: Question,
      as: 'questions',
      include: { model: Choice, as: 'choices' },
      order: [['position', 'asc'], ['id', 'asc']],
    },
  });
}

async function isUsedByGame(levelId) {
  const { sequelize } = require('../models');
  const [rows] = await sequelize.query(
    `SELECT 1 FROM game_sessions WHERE level_id = :levelId LIMIT 1`,
    { replacements: { levelId }, type: sequelize.QueryTypes.SELECT }
  );
  return Boolean(rows);
}

async function create(data) {
  return Level.create(data);
}

async function update(level, changes) {
  return level.update(changes);
}

module.exports = { findAllPaged, findById, findWithQuestions, isUsedByGame, create, update };
