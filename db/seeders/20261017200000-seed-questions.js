'use strict';

module.exports = {
  async up(queryInterface) {
    const [levels] = await queryInterface.sequelize.query(
      `SELECT id, level_number FROM levels ORDER BY level_number`
    );
    const levelByNumber = {};
    for (const row of levels) levelByNumber[row.level_number] = row.id;

    await queryInterface.sequelize.query(
      `INSERT INTO questions (level_id, prompt, explanation)
       VALUES
         (:level_id_1, :prompt_1, :explanation_1),
         (:level_id_2, :prompt_2, :explanation_2),
         (:level_id_3, :prompt_3, :explanation_3),
         (:level_id_4, :prompt_4, :explanation_4)
       ON CONFLICT DO NOTHING`,
      {
        replacements: {
          level_id_1: levelByNumber[1],
          prompt_1: 'What is the first tile color?',
          explanation_1: 'Red is the starting color.',
          level_id_2: levelByNumber[2],
          prompt_2: 'How many tiles are in a row?',
          explanation_2: null,
          level_id_3: levelByNumber[3],
          prompt_3: 'Which tile opens the gate?',
          explanation_3: 'The crystal tile.',
          level_id_4: levelByNumber[1],
          prompt_4: 'What comes after the blue tile?',
          explanation_4: 'The green tile follows.',
        },
      }
    );
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(
      `DELETE FROM questions
       WHERE prompt IN (
         :prompt_1, :prompt_2, :prompt_3, :prompt_4
       )`,
      {
        replacements: {
          prompt_1: 'What is the first tile color?',
          prompt_2: 'How many tiles are in a row?',
          prompt_3: 'Which tile opens the gate?',
          prompt_4: 'What comes after the blue tile?',
        },
      }
    );
  },
};
