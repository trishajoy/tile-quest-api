'use strict';

// Quiz questions. Each question belongs to one level.
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('questions', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      level_id: { type: Sequelize.INTEGER, allowNull: false },
      prompt: { type: Sequelize.TEXT, allowNull: false },
      explanation: { type: Sequelize.TEXT, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });

    await queryInterface.addConstraint('questions', {
      fields: ['level_id'], type: 'foreign key', name: 'fk_questions_level_id',
      references: { table: 'levels', field: 'id' },
      onDelete: 'RESTRICT', onUpdate: 'CASCADE',
    });
    await queryInterface.addIndex('questions', ['level_id'], { name: 'idx_questions_level_id' });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('questions');
  },
};