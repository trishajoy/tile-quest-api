'use strict';

// Week 13: questions have a server-set position (1..n) for gameplay ordering.
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('questions', 'position', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('questions', 'position');
  },
};
