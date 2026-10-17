'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('game_sessions', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      session_code: { type: Sequelize.STRING(10), allowNull: false },
      level_id: { type: Sequelize.INTEGER, allowNull: false },
      started_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      ended_at: { type: Sequelize.DATE, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });

    await queryInterface.addConstraint('game_sessions', {
      fields: ['session_code'],
      type: 'unique',
      name: 'uq_game_sessions_session_code',
    });
    await queryInterface.addConstraint('game_sessions', {
      fields: ['level_id'],
      type: 'foreign key',
      name: 'fk_game_sessions_level_id',
      references: { table: 'levels', field: 'id' },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    });
    await queryInterface.sequelize.query(
      'ALTER TABLE "game_sessions" ADD CONSTRAINT "ck_game_sessions_times" CHECK ("ended_at" IS NULL OR "ended_at" >= "started_at")'
    );
    await queryInterface.addIndex('game_sessions', ['level_id'], { name: 'idx_game_sessions_level_id' });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('game_sessions');
  },
};
