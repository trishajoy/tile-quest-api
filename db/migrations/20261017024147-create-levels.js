'use strict';

// Levels of the game. Each level has its own puzzles and questions.
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('levels', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      level_number: { type: Sequelize.INTEGER, allowNull: false },
      name: { type: Sequelize.STRING(100), allowNull: false },
      pass_score: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 70 },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });

    await queryInterface.addConstraint('levels', {
      fields: ['level_number'], type: 'unique', name: 'uq_levels_level_number',
    });
    await queryInterface.sequelize.query(
      'ALTER TABLE levels ADD CONSTRAINT ck_levels_level_number CHECK (level_number > 0)'
    );
    await queryInterface.sequelize.query(
      'ALTER TABLE levels ADD CONSTRAINT ck_levels_pass_score CHECK (pass_score BETWEEN 0 AND 100)'
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable('levels');
  },
};