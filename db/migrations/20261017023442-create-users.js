'use strict';

// One table for everyone. `role` separates players from admins.
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      school_id: { type: Sequelize.STRING(20), allowNull: false },
      name: { type: Sequelize.STRING(120), allowNull: false },
      email: { type: Sequelize.STRING(150), allowNull: false },
      role: { type: Sequelize.STRING(10), allowNull: false, defaultValue: 'player' },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });

    await queryInterface.addConstraint('users', {
      fields: ['school_id'], type: 'unique', name: 'uq_users_school_id',
    });
    await queryInterface.addConstraint('users', {
      fields: ['email'], type: 'unique', name: 'uq_users_email',
    });
    await queryInterface.addConstraint('users', {
      fields: ['role'], type: 'check', name: 'ck_users_role',
      where: { role: ['player', 'admin'] },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('users');
  },
};