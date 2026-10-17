'use strict';

module.exports = {
  async up(queryInterface) {
    const [questions] = await queryInterface.sequelize.query(
      `SELECT id, prompt FROM questions ORDER BY id`
    );
    const qByPrompt = {};
    for (const row of questions) qByPrompt[row.prompt] = row.id;

    await queryInterface.sequelize.query(
      `INSERT INTO choices (question_id, choice_text, is_correct)
       VALUES
         (:qid_1, :text_1, :correct_1),
         (:qid_2, :text_2, :correct_2),
         (:qid_3, :text_3, :correct_3),
         (:qid_4, :text_4, :correct_4),
         (:qid_5, :text_5, :correct_5),
         (:qid_6, :text_6, :correct_6),
         (:qid_7, :text_7, :correct_7),
         (:qid_8, :text_8, :correct_8),
         (:qid_9, :text_9, :correct_9),
         (:qid_10, :text_10, :correct_10),
         (:qid_11, :text_11, :correct_11),
         (:qid_12, :text_12, :correct_12),
         (:qid_13, :text_13, :correct_13),
         (:qid_14, :text_14, :correct_14),
         (:qid_15, :text_15, :correct_15),
         (:qid_16, :text_16, :correct_16)
       ON CONFLICT DO NOTHING`,
      {
        replacements: {
          // Question 1: "What is the first tile color?" — correct: Red
          qid_1: qByPrompt['What is the first tile color?'],
          text_1: 'Red',
          correct_1: true,
          qid_2: qByPrompt['What is the first tile color?'],
          text_2: 'Blue',
          correct_2: false,
          qid_3: qByPrompt['What is the first tile color?'],
          text_3: 'Green',
          correct_3: false,
          qid_4: qByPrompt['What is the first tile color?'],
          text_4: 'Yellow',
          correct_4: false,

          // Question 2: "How many tiles are in a row?" — correct: 5
          qid_5: qByPrompt['How many tiles are in a row?'],
          text_5: '4',
          correct_5: false,
          qid_6: qByPrompt['How many tiles are in a row?'],
          text_6: '5',
          correct_6: true,
          qid_7: qByPrompt['How many tiles are in a row?'],
          text_7: '6',
          correct_7: false,
          qid_8: qByPrompt['How many tiles are in a row?'],
          text_8: '7',
          correct_8: false,

          // Question 3: "Which tile opens the gate?" — correct: Crystal
          qid_9: qByPrompt['Which tile opens the gate?'],
          text_9: 'Crystal',
          correct_9: true,
          qid_10: qByPrompt['Which tile opens the gate?'],
          text_10: 'Ruby',
          correct_10: false,
          qid_11: qByPrompt['Which tile opens the gate?'],
          text_11: 'Sapphire',
          correct_11: false,
          qid_12: qByPrompt['Which tile opens the gate?'],
          text_12: 'Emerald',
          correct_12: false,

          // Question 4: "What comes after the blue tile?" — correct: Green
          qid_13: qByPrompt['What comes after the blue tile?'],
          text_13: 'Green',
          correct_13: true,
          qid_14: qByPrompt['What comes after the blue tile?'],
          text_14: 'Red',
          correct_14: false,
          qid_15: qByPrompt['What comes after the blue tile?'],
          text_15: 'Blue',
          correct_15: false,
          qid_16: qByPrompt['What comes after the blue tile?'],
          text_16: 'Purple',
          correct_16: false,
        },
      }
    );
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(
      `DELETE FROM choices
       WHERE choice_text IN (
         :text_1, :text_2, :text_3, :text_4,
         :text_5, :text_6, :text_7, :text_8,
         :text_9, :text_10, :text_11, :text_12,
         :text_13, :text_14, :text_15, :text_16
       )`,
      {
        replacements: {
          text_1: 'Red', text_2: 'Blue', text_3: 'Green', text_4: 'Yellow',
          text_5: '4', text_6: '5', text_7: '6', text_8: '7',
          text_9: 'Crystal', text_10: 'Ruby', text_11: 'Sapphire', text_12: 'Emerald',
          text_13: 'Green', text_14: 'Red', text_15: 'Blue', text_16: 'Purple',
        },
      }
    );
  },
};
