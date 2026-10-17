'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(
      `INSERT INTO users (school_id, full_name, email, role)
       VALUES
         (:school_id_1, :full_name_1, :email_1, :role_1),
         (:school_id_2, :full_name_2, :email_2, :role_2),
         (:school_id_3, :full_name_3, :email_3, :role_3),
         (:school_id_4, :full_name_4, :email_4, :role_4),
         (:school_id_5, :full_name_5, :email_5, :role_5),
         (:school_id_6, :full_name_6, :email_6, :role_6)
       ON CONFLICT DO NOTHING`,
      {
        replacements: {
          school_id_1: '2099-0001',
          full_name_1: 'Avery Morgan',
          email_1: 'avery.morgan@tilequest.test',
          role_1: 'admin',
          school_id_2: '2099-0002',
          full_name_2: "Jordan O'Brien",
          email_2: 'jordan.obrien@tilequest.test',
          role_2: 'player',
          school_id_3: '2099-0003',
          full_name_3: 'Milo Santos',
          email_3: 'milo.santos@tilequest.test',
          role_3: 'player',
          school_id_4: '2099-0004',
          full_name_4: 'Chloe Étoile',
          email_4: 'chloe.etoile@tilequest.test',
          role_4: 'player',
          school_id_5: '2099-0005',
          full_name_5: 'Alexandria Penelope Christopherina Maximilian Theodore Bartholomew Fitzgerald Montgomery Harrington Kensington',
          email_5: 'alexandria.montgomery@tilequest.test',
          role_5: 'player',
          school_id_6: '2099-0006',
          full_name_6: 'Nia Park',
          email_6: 'nia.park@tilequest.test',
          role_6: 'player',
        },
      }
    );
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(
      `DELETE FROM users
       WHERE school_id IN (
         :school_id_1, :school_id_2, :school_id_3,
         :school_id_4, :school_id_5, :school_id_6
       )`,
      {
        replacements: {
          school_id_1: '2099-0001',
          school_id_2: '2099-0002',
          school_id_3: '2099-0003',
          school_id_4: '2099-0004',
          school_id_5: '2099-0005',
          school_id_6: '2099-0006',
        },
      }
    );
  },
};
