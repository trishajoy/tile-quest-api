'use strict';

module.exports = {
  async up(queryInterface) {
    const [levels] = await queryInterface.sequelize.query(
      `SELECT id, level_number FROM levels ORDER BY level_number`
    );
    const levelByNumber = {};
    for (const row of levels) levelByNumber[row.level_number] = row.id;

    await queryInterface.sequelize.query(
      `INSERT INTO puzzles (level_id, title, grid_rows, grid_cols, tile_layout)
       VALUES
         (:level_id_1, :title_1, :rows_1, :cols_1, :layout_1),
         (:level_id_2, :title_2, :rows_2, :cols_2, :layout_2)
       ON CONFLICT DO NOTHING`,
      {
        replacements: {
          level_id_1: levelByNumber[1],
          title_1: 'Meadow Gate Layout',
          rows_1: 5,
          cols_1: 5,
          layout_1: JSON.stringify([
            ['grass', 'grass', 'grass', 'grass', 'grass'],
            ['grass', 'tile', 'tile', 'tile', 'grass'],
            ['grass', 'tile', 'goal', 'tile', 'grass'],
            ['grass', 'tile', 'tile', 'tile', 'grass'],
            ['grass', 'grass', 'grass', 'grass', 'grass'],
          ]),
          level_id_2: levelByNumber[2],
          title_2: 'River Crossing Layout',
          rows_2: 4,
          cols_2: 6,
          layout_2: JSON.stringify([
            ['water', 'water', 'water', 'water', 'water', 'water'],
            ['water', 'tile', 'tile', 'tile', 'tile', 'water'],
            ['water', 'tile', 'goal', 'tile', 'tile', 'water'],
            ['water', 'water', 'water', 'water', 'water', 'water'],
          ]),
        },
      }
    );
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(
      `DELETE FROM puzzles
       WHERE title IN (:title_1, :title_2)`,
      {
        replacements: {
          title_1: 'Meadow Gate Layout',
          title_2: 'River Crossing Layout',
        },
      }
    );
  },
};
