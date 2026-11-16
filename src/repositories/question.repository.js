// Queries and transactions for the questions table.
// Every write that touches questions + choices lives in ONE transaction here,
// so the service stays mockable.
const { Question, Choice, sequelize } = require('../models');
const { Op } = require('sequelize');
const { toOffset } = require('../utils/paginate');

async function findAllPagedForLevel(levelId, { page, limit, q, sort, order }) {
  const offset = toOffset({ page, limit }).offset;
  const limitN = toOffset({ page, limit }).limit;

  const where = { level_id: levelId };
  if (q) {
    where.prompt = { [Op.iLike]: `%${q}%` };
  }

  const orderClause = sort ? [[sort, order || 'asc']] : [['position', 'asc'], ['id', 'asc']];

  const { rows, count } = await Question.findAndCountAll({
    where,
    order: orderClause,
    limit: limitN,
    offset,
    attributes: { exclude: ['level_id'] },
  });

  return { rows, count };
}

async function findById(questionId) {
  return Question.findByPk(questionId);
}

async function findForLevelWithChoices(questionId) {
  return Question.findByPk(questionId, {
    include: { model: Choice, as: 'choices' },
  });
}

async function getMaxPosition(levelId) {
  const [row] = await sequelize.query(
    `SELECT COALESCE(MAX(position), 0) AS maxpos FROM questions WHERE level_id = :levelId`,
    { replacements: { levelId }, type: sequelize.QueryTypes.SELECT }
  );
  return Number((row && row.maxpos) || 0);
}

async function repackPositions(levelId) {
  const questions = await Question.findAll({
    where: { level_id: levelId },
    order: [['position', 'asc'], ['id', 'asc']],
    attributes: ['id', 'position'],
  });

  const t = await sequelize.transaction();
  try {
    let pos = 0;
    for (const q of questions) {
      pos += 1;
      if (q.position !== pos) {
        await q.update({ position: pos }, { transaction: t });
      }
    }
    await t.commit();
  } catch (error) {
    await t.rollback();
    throw error;
  }
}

async function createWithChoices(levelId, { prompt, explanation, choices }) {
  const maxPos = await getMaxPosition(levelId);
  const position = maxPos + 1;

  const t = await sequelize.transaction();
  try {
    const question = await Question.create(
      { level_id: levelId, prompt, explanation, position },
      { transaction: t }
    );

    const choiceRows = choices.map((c, i) =>
      Choice.create(
        { question_id: question.id, choice_text: c.choice_text, is_correct: Boolean(c.is_correct) },
        { transaction: t }
      )
    );

    await Promise.all(choiceRows);
    await t.commit();

    return question;
  } catch (error) {
    await t.rollback();
    throw error;
  }
}

async function update(question, changes) {
  return question.update(changes);
}

async function destroy(question) {
  const levelId = question.level_id;
  await question.destroy();
  await repackPositions(levelId);
}

module.exports = {
  findAllPagedForLevel,
  findById,
  findForLevelWithChoices,
  getMaxPosition,
  repackPositions,
  createWithChoices,
  update,
  destroy,
};
