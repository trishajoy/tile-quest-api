'use strict';

// Week 13: track when the current question started so we can score by elapsed time.
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('game_sessions', 'question_started_at', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('game_sessions', 'question_started_at');
  },
};
