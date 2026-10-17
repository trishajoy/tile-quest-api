'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('answers', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      player_id: { type: Sequelize.INTEGER, allowNull: false },
      question_id: { type: Sequelize.INTEGER, allowNull: false },
      choice_id: { type: Sequelize.INTEGER, allowNull: false },
      is_correct: { type: Sequelize.BOOLEAN, allowNull: false },
      answered_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });

    await queryInterface.addConstraint('answers', {
      fields: ['player_id', 'question_id'],
      type: 'unique',
      name: 'uq_answers_player_question',
    });
    await queryInterface.addConstraint('answers', {
      fields: ['player_id'],
      type: 'foreign key',
      name: 'fk_answers_player_id',
      references: { table: 'players', field: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    await queryInterface.addConstraint('answers', {
      fields: ['question_id'],
      type: 'foreign key',
      name: 'fk_answers_question_id',
      references: { table: 'questions', field: 'id' },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    });
    await queryInterface.addConstraint('answers', {
      fields: ['choice_id'],
      type: 'foreign key',
      name: 'fk_answers_choice_id',
      references: { table: 'choices', field: 'id' },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    });
    await queryInterface.addIndex('answers', ['question_id'], { name: 'idx_answers_question_id' });
    await queryInterface.addIndex('answers', ['choice_id'], { name: 'idx_answers_choice_id' });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('answers');
  },
};
