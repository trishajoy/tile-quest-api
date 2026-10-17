'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('players', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      game_session_id: { type: Sequelize.INTEGER, allowNull: false },
      user_id: { type: Sequelize.INTEGER, allowNull: false },
      nickname: { type: Sequelize.STRING(30), allowNull: false },
      score: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      completed: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });

    await queryInterface.addConstraint('players', {
      fields: ['game_session_id', 'user_id'],
      type: 'unique',
      name: 'uq_players_session_user',
    });
    await queryInterface.addConstraint('players', {
      fields: ['game_session_id'],
      type: 'foreign key',
      name: 'fk_players_game_session_id',
      references: { table: 'game_sessions', field: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    await queryInterface.addConstraint('players', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'fk_players_user_id',
      references: { table: 'users', field: 'user_id' },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    });
    await queryInterface.sequelize.query(
      'ALTER TABLE "players" ADD CONSTRAINT "ck_players_score" CHECK ("score" >= 0)'
    );
    await queryInterface.addIndex('players', ['user_id'], { name: 'idx_players_user_id' });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('players');
  },
};
