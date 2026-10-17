'use strict';

module.exports = {
  async up(queryInterface) {
    const [levels] = await queryInterface.sequelize.query(
      `SELECT id, level_number FROM levels ORDER BY level_number`
    );
    const levelByNumber = {};
    for (const row of levels) levelByNumber[row.level_number] = row.id;

    const started = new Date('2026-10-17T09:00:00Z');
    const ended = new Date('2026-10-17T09:30:00Z');

    await queryInterface.sequelize.query(
      `INSERT INTO game_sessions (session_code, level_id, started_at, ended_at)
       VALUES
         (:code_1, :level_id_1, :started_1, :ended_1),
         (:code_2, :level_id_2, :started_2, :ended_2)
       ON CONFLICT DO NOTHING`,
      {
        replacements: {
          code_1: '100001',
          level_id_1: levelByNumber[1],
          started_1: started.toISOString(),
          ended_1: ended.toISOString(),
          code_2: '100002',
          level_id_2: levelByNumber[2],
          started_2: started.toISOString(),
          ended_2: null,
        },
      }
    );
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(
      `DELETE FROM game_sessions
       WHERE session_code IN (:code_1, :code_2)`,
      {
        replacements: {
          code_1: '100001',
          code_2: '100002',
        },
      }
    );
  },
};
