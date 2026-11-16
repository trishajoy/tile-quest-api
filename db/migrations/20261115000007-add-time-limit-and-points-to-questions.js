'use strict';

// Week 13: each question has a time limit (seconds) and base points for scoring.
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('questions', 'time_limit', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 20,
    });
    await queryInterface.addColumn('questions', 'base_points', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1000,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('questions', 'time_limit');
    await queryInterface.removeColumn('questions', 'base_points');
  },
};
