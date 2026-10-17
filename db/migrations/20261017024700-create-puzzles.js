'use strict';

// Tile layouts for a level. Each puzzle belongs to one level.
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('puzzles', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      level_id: { type: Sequelize.INTEGER, allowNull: false },
      title: { type: Sequelize.STRING(255), allowNull: false },
      grid_rows: { type: Sequelize.INTEGER, allowNull: false },
      grid_cols: { type: Sequelize.INTEGER, allowNull: false },
      tile_layout: { type: Sequelize.JSONB, allowNull: false },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });

    await queryInterface.addConstraint('puzzles', {
      fields: ['level_id'], type: 'foreign key', name: 'fk_puzzles_level_id',
      references: { table: 'levels', field: 'id' },
      onDelete: 'RESTRICT', onUpdate: 'CASCADE',
    });
    await queryInterface.sequelize.query(
      'ALTER TABLE "puzzles" ADD CONSTRAINT "ck_puzzles_grid" CHECK ("grid_rows" > 0 AND "grid_cols" > 0)'
    );
    await queryInterface.addIndex('puzzles', ['level_id'], { name: 'idx_puzzles_level_id' });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('puzzles');
  },
};
