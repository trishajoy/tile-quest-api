'use strict';

// Week 13: levels have a nullable picture URL (uploaded by the host).
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('levels', 'picture', {
      type: Sequelize.STRING(500),
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('levels', 'picture');
  },
};
