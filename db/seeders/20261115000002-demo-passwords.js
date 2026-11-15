'use strict';

const bcrypt = require('bcryptjs');

// One demo password for all seeded accounts. Trisha chose it; never the AklatArena one.
const DEMO_PASSWORD = 'TileQuest-Demo-2026';

module.exports = {
  async up(queryInterface) {
    const hash = await bcrypt.hash(DEMO_PASSWORD, 10);

    // Idempotent: only users without a password get one. Running twice changes nothing.
    await queryInterface.sequelize.query(
      `UPDATE users
       SET password_hash = :hash
       WHERE password_hash IS NULL`,
      { replacements: { hash } }
    );
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(
      `UPDATE users
       SET password_hash = NULL
       WHERE password_hash IS NOT NULL`
    );
  },
};
