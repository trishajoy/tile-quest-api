'use strict';

// Answer options for a question. Exactly one option per question is correct.
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('choices', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      question_id: { type: Sequelize.INTEGER, allowNull: false },
      choice_text: { type: Sequelize.STRING(255), allowNull: false },
      is_correct: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });

    await queryInterface.addConstraint('choices', {
      fields: ['question_id'], type: 'foreign key', name: 'fk_choices_question_id',
      references: { table: 'questions', field: 'id' },
      onDelete: 'CASCADE', onUpdate: 'CASCADE',
    });
    await queryInterface.addIndex('choices', ['question_id'], { name: 'idx_choices_question_id' });

    // At most one correct choice per question.
    await queryInterface.addIndex('choices', ['question_id'], {
      name: 'uq_choices_one_correct_per_question',
      unique: true,
      where: { is_correct: true },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('choices');
  },
};