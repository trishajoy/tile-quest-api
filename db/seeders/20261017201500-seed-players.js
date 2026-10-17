'use strict';

module.exports = {
  async up(queryInterface) {
    const [sessions] = await queryInterface.sequelize.query(
      `SELECT id, session_code FROM game_sessions ORDER BY session_code`
    );
    const sessionByCode = {};
    for (const row of sessions) sessionByCode[row.session_code] = row.id;

    const [users] = await queryInterface.sequelize.query(
      `SELECT user_id, school_id FROM users ORDER BY user_id`
    );
    const userBySchool = {};
    for (const row of users) userBySchool[row.school_id] = row.user_id;

    await queryInterface.sequelize.query(
      `INSERT INTO players (game_session_id, user_id, nickname, score, completed)
       VALUES
         (:sid_1, :uid_1, :nick_1, :score_1, :completed_1),
         (:sid_2, :uid_2, :nick_2, :score_2, :completed_2),
         (:sid_3, :uid_3, :nick_3, :score_3, :completed_3),
         (:sid_4, :uid_4, :nick_4, :score_4, :completed_4),
         (:sid_5, :uid_5, :nick_5, :score_5, :completed_5)
       ON CONFLICT DO NOTHING`,
      {
        replacements: {
          // Session TQ1001 (finished): 3 completed players + 1 who did not complete
          sid_1: sessionByCode['TQ1001'],
          uid_1: userBySchool['2099-0002'],
          nick_1: 'Jordan',
          score_1: 85,
          completed_1: true,

          sid_2: sessionByCode['TQ1001'],
          uid_2: userBySchool['2099-0003'],
          nick_2: 'Milo',
          score_2: 90,
          completed_2: true,

          sid_3: sessionByCode['TQ1001'],
          uid_3: userBySchool['2099-0004'],
          nick_3: 'Chloe',
          score_3: 78,
          completed_3: true,

          sid_4: sessionByCode['TQ1001'],
          uid_4: userBySchool['2099-0006'],
          nick_4: 'Nia',
          score_4: 45,
          completed_4: false,

          // Session TQ1002 (not finished): one player, not completed
          sid_5: sessionByCode['TQ1002'],
          uid_5: userBySchool['2099-0003'],
          nick_5: 'MiloAgain',
          score_5: 0,
          completed_5: false,
        },
      }
    );
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(
      `DELETE FROM players
       WHERE nickname IN (
         :nick_1, :nick_2, :nick_3, :nick_4, :nick_5
       )`,
      {
        replacements: {
          nick_1: 'Jordan', nick_2: 'Milo', nick_3: 'Chloe', nick_4: 'Nia', nick_5: 'MiloAgain',
        },
      }
    );
  },
};
