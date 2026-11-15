'use strict';

// Week 12: widen the role check constraint to accept PLAYER / HOST / ADMIN.
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('users', 'ck_users_role');
    await queryInterface.addConstraint('users', {
      fields: ['role'],
      type: 'check',
      name: 'ck_users_role',
      where: { role: ['player', 'admin', 'PLAYER', 'ADMIN', 'HOST'] },
    });
  },

  async down(queryInterface) {
    await queryInterface.removeConstraint('users', 'ck_users_role');
    await queryInterface.addConstraint('users', {
      fields: ['role'],
      type: 'check',
      name: 'ck_users_role',
      where: { role: ['player', 'admin'] },
    });
  },
};
