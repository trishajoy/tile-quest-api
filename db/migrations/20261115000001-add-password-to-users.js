'use strict';

// Week 12: add password_hash so accounts can log in.
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'password_hash', {
      type: Sequelize.STRING(60),
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('users', 'password_hash');
  },
};
