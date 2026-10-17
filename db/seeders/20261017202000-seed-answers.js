'use strict';

module.exports = {
  async up(queryInterface) {
    const [players] = await queryInterface.sequelize.query(
      `SELECT id, game_session_id, nickname FROM players ORDER BY id`
    );
    const playerByKey = {};
    for (const row of players) playerByKey[`${row.game_session_id}|${row.nickname}`] = row.id;

    const [questions] = await queryInterface.sequelize.query(
      `SELECT id, prompt FROM questions ORDER BY id`
    );
    const qByPrompt = {};
    for (const row of questions) qByPrompt[row.prompt] = row.id;

    const [choices] = await queryInterface.sequelize.query(
      `SELECT id, question_id, choice_text FROM choices ORDER BY id`
    );
    const choiceByKey = {};
    for (const row of choices) choiceByKey[`${row.question_id}|${row.choice_text}`] = row.id;

    const answeredAt = new Date('2026-10-17T09:15:00Z').toISOString();

    const insert = (sessionCode, nickname, prompt, choiceText, correct) => {
      const playerId = playerByKey[`${sessionCode}|${nickname}`];
      const questionId = qByPrompt[prompt];
      const choiceId = choiceByKey[`${questionId}|${choiceText}`];
      return {
        player_id: playerId,
        question_id: questionId,
        choice_id: choiceId,
        is_correct: correct,
        answered_at: answeredAt,
      };
    };

    const rows = [];

    // Session TQ1001 (finished): Jordan answers Q1-Q4
    rows.push(insert('TQ1001', 'Jordan', 'What is the first tile color?', 'Red', true));
    rows.push(insert('TQ1001', 'Jordan', 'How many tiles are in a row?', '5', true));
    rows.push(insert('TQ1001', 'Jordan', 'Which tile opens the gate?', 'Ruby', false));
    rows.push(insert('TQ1001', 'Jordan', 'What comes after the blue tile?', 'Green', true));

    // Session TQ1001: Milo answers Q1-Q4
    rows.push(insert('TQ1001', 'Milo', 'What is the first tile color?', 'Red', true));
    rows.push(insert('TQ1001', 'Milo', 'How many tiles are in a row?', '4', false));
    rows.push(insert('TQ1001', 'Milo', 'Which tile opens the gate?', 'Crystal', true));
    rows.push(insert('TQ1001', 'Milo', 'What comes after the blue tile?', 'Green', true));

    // Session TQ1001: Chloe answers Q1-Q4
    rows.push(insert('TQ1001', 'Chloe', 'What is the first tile color?', 'Blue', false));
    rows.push(insert('TQ1001', 'Chloe', 'How many tiles are in a row?', '5', true));
    rows.push(insert('TQ1001', 'Chloe', 'Which tile opens the gate?', 'Crystal', true));
    rows.push(insert('TQ1001', 'Chloe', 'What comes after the blue tile?', 'Purple', false));

    // Session TQ1001: Nia answers only Q1-Q2 (did not complete)
    rows.push(insert('TQ1001', 'Nia', 'What is the first tile color?', 'Red', true));
    rows.push(insert('TQ1001', 'Nia', 'How many tiles are in a row?', '7', false));

    await queryInterface.sequelize.query(
      `INSERT INTO answers (player_id, question_id, choice_id, is_correct, answered_at)
       VALUES
         (:pid_1, :qid_1, :cid_1, :corr_1, :answered_at_1),
         (:pid_2, :qid_2, :cid_2, :corr_2, :answered_at_2),
         (:pid_3, :qid_3, :cid_3, :corr_3, :answered_at_3),
         (:pid_4, :qid_4, :cid_4, :corr_4, :answered_at_4),
         (:pid_5, :qid_5, :cid_5, :corr_5, :answered_at_5),
         (:pid_6, :qid_6, :cid_6, :corr_6, :answered_at_6),
         (:pid_7, :qid_7, :cid_7, :corr_7, :answered_at_7),
         (:pid_8, :qid_8, :cid_8, :corr_8, :answered_at_8),
         (:pid_9, :qid_9, :cid_9, :corr_9, :answered_at_9),
         (:pid_10, :qid_10, :cid_10, :corr_10, :answered_at_10),
         (:pid_11, :qid_11, :cid_11, :corr_11, :answered_at_11),
         (:pid_12, :qid_12, :cid_12, :corr_12, :answered_at_12),
         (:pid_13, :qid_13, :cid_13, :corr_13, :answered_at_13),
         (:pid_14, :qid_14, :cid_14, :corr_14, :answered_at_14)
       ON CONFLICT DO NOTHING`,
      {
        replacements: {
          pid_1: rows[0].player_id, qid_1: rows[0].question_id, cid_1: rows[0].choice_id, corr_1: rows[0].is_correct, answered_at_1: rows[0].answered_at,
          pid_2: rows[1].player_id, qid_2: rows[1].question_id, cid_2: rows[1].choice_id, corr_2: rows[1].is_correct, answered_at_2: rows[1].answered_at,
          pid_3: rows[2].player_id, qid_3: rows[2].question_id, cid_3: rows[2].choice_id, corr_3: rows[2].is_correct, answered_at_3: rows[2].answered_at,
          pid_4: rows[3].player_id, qid_4: rows[3].question_id, cid_4: rows[3].choice_id, corr_4: rows[3].is_correct, answered_at_4: rows[3].answered_at,
          pid_5: rows[4].player_id, qid_5: rows[4].question_id, cid_5: rows[4].choice_id, corr_5: rows[4].is_correct, answered_at_5: rows[4].answered_at,
          pid_6: rows[5].player_id, qid_6: rows[5].question_id, cid_6: rows[5].choice_id, corr_6: rows[5].is_correct, answered_at_6: rows[5].answered_at,
          pid_7: rows[6].player_id, qid_7: rows[6].question_id, cid_7: rows[6].choice_id, corr_7: rows[6].is_correct, answered_at_7: rows[6].answered_at,
          pid_8: rows[7].player_id, qid_8: rows[7].question_id, cid_8: rows[7].choice_id, corr_8: rows[7].is_correct, answered_at_8: rows[7].answered_at,
          pid_9: rows[8].player_id, qid_9: rows[8].question_id, cid_9: rows[8].choice_id, corr_9: rows[8].is_correct, answered_at_9: rows[8].answered_at,
          pid_10: rows[9].player_id, qid_10: rows[9].question_id, cid_10: rows[9].choice_id, corr_10: rows[9].is_correct, answered_at_10: rows[9].answered_at,
          pid_11: rows[10].player_id, qid_11: rows[10].question_id, cid_11: rows[10].choice_id, corr_11: rows[10].is_correct, answered_at_11: rows[10].answered_at,
          pid_12: rows[11].player_id, qid_12: rows[11].question_id, cid_12: rows[11].choice_id, corr_12: rows[11].is_correct, answered_at_12: rows[11].answered_at,
          pid_13: rows[12].player_id, qid_13: rows[12].question_id, cid_13: rows[12].choice_id, corr_13: rows[12].is_correct, answered_at_13: rows[12].answered_at,
          pid_14: rows[13].player_id, qid_14: rows[13].question_id, cid_14: rows[13].choice_id, corr_14: rows[13].is_correct, answered_at_14: rows[13].answered_at,
        },
      }
    );
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`DELETE FROM answers`);
  },
};
