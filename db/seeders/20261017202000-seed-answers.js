'use strict';

module.exports = {
  async up(queryInterface) {
    // Map session_code -> game session id
    const [sessions] = await queryInterface.sequelize.query(
      `SELECT id, session_code FROM game_sessions ORDER BY id`
    );
    const sessionCodeToId = {};
    for (const row of sessions) sessionCodeToId[row.session_code] = row.id;

    // Map "game_session_id|nickname" -> player id
    const [players] = await queryInterface.sequelize.query(
      `SELECT id, game_session_id, nickname FROM players ORDER BY id`
    );
    const playerByKey = {};
    for (const row of players) playerByKey[`${row.game_session_id}|${row.nickname}`] = row.id;

    // Map prompt -> question id
    const [questions] = await queryInterface.sequelize.query(
      `SELECT id, prompt FROM questions ORDER BY id`
    );
    const qByPrompt = {};
    for (const row of questions) qByPrompt[row.prompt] = row.id;

    // Map "question_id|choice_text" -> choice id
    const [choices] = await queryInterface.sequelize.query(
      `SELECT id, question_id, choice_text FROM choices ORDER BY id`
    );
    const choiceByKey = {};
    for (const row of choices) choiceByKey[`${row.question_id}|${row.choice_text}`] = row.id;

    const answeredAt = new Date('2026-10-17T09:15:00Z').toISOString();

    // Build (player_id, question_id, choice_id, is_correct) rows,
    // looking up every id from the database (never typing an id).
    const build = (sessionCode, nickname, prompt, choiceText, correct) => {
      const gsId = sessionCodeToId[sessionCode];
      const playerId = playerByKey[`${gsId}|${nickname}`];
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
    rows.push(build('TQ1001', 'Jordan', 'What is the first tile color?', 'Red', true));
    rows.push(build('TQ1001', 'Jordan', 'How many tiles are in a row?', '5', true));
    rows.push(build('TQ1001', 'Jordan', 'Which tile opens the gate?', 'Ruby', false));
    rows.push(build('TQ1001', 'Jordan', 'What comes after the blue tile?', 'Green', true));

    // Session TQ1001: Milo answers Q1-Q4
    rows.push(build('TQ1001', 'Milo', 'What is the first tile color?', 'Red', true));
    rows.push(build('TQ1001', 'Milo', 'How many tiles are in a row?', '4', false));
    rows.push(build('TQ1001', 'Milo', 'Which tile opens the gate?', 'Crystal', true));
    rows.push(build('TQ1001', 'Milo', 'What comes after the blue tile?', 'Green', true));

    // Session TQ1001: Chloe answers Q1-Q4
    rows.push(build('TQ1001', 'Chloe', 'What is the first tile color?', 'Blue', false));
    rows.push(build('TQ1001', 'Chloe', 'How many tiles are in a row?', '5', true));
    rows.push(build('TQ1001', 'Chloe', 'Which tile opens the gate?', 'Crystal', true));
    rows.push(build('TQ1001', 'Chloe', 'What comes after the blue tile?', 'Purple', false));

    // Session TQ1001: Nia answers only Q1-Q2 (did not complete)
    rows.push(build('TQ1001', 'Nia', 'What is the first tile color?', 'Red', true));
    rows.push(build('TQ1001', 'Nia', 'How many tiles are in a row?', '7', false));

    // Build replacements programmatically so every named parameter has a value.
    const replacements = {};
    const values = [];
    rows.forEach((row, i) => {
      const n = i + 1;
      replacements[`pid_${n}`] = row.player_id;
      replacements[`qid_${n}`] = row.question_id;
      replacements[`cid_${n}`] = row.choice_id;
      replacements[`corr_${n}`] = row.is_correct;
      replacements[`answered_at_${n}`] = row.answered_at;
      values.push(`(:pid_${n}, :qid_${n}, :cid_${n}, :corr_${n}, :answered_at_${n})`);
    });

    const sql = `
      INSERT INTO answers (player_id, question_id, choice_id, is_correct, answered_at)
       VALUES ${values.join(',\n        ')}
      ON CONFLICT DO NOTHING`;

    await queryInterface.sequelize.query(sql, { replacements });
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`DELETE FROM answers`);
  },
};
