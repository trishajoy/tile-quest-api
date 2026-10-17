'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(
      `INSERT INTO levels (level_number, name, pass_score)
       VALUES
         (:level_number_1, :name_1, :pass_score_1),
         (:level_number_2, :name_2, :pass_score_2),
         (:level_number_3, :name_3, :pass_score_3),
         (:level_number_4, :name_4, :pass_score_4),
         (:level_number_5, :name_5, :pass_score_5)
       ON CONFLICT DO NOTHING`,
      {
        replacements: {
          level_number_1: 1,
          name_1: 'Meadow Gate',
          pass_score_1: 60,
          level_number_2: 2,
          name_2: 'River Crossing',
          pass_score_2: 65,
          level_number_3: 3,
          name_3: 'Crystal Cavern',
          pass_score_3: 70,
          level_number_4: 4,
          name_4: 'Sky Garden',
          pass_score_4: 75,
          level_number_5: 5,
          name_5: 'Ancient Summit',
          pass_score_5: 80,
        },
      }
    );
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(
      `DELETE FROM levels
       WHERE level_number IN (
         :level_number_1, :level_number_2, :level_number_3,
         :level_number_4, :level_number_5
       )`,
      {
        replacements: {
          level_number_1: 1,
          level_number_2: 2,
          level_number_3: 3,
          level_number_4: 4,
          level_number_5: 5,
        },
      }
    );
  },
};
