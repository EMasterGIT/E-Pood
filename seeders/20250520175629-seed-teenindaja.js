'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    await queryInterface.bulkInsert('teenindaja', [
      {
        Nimi: 'Kai Kaubik',
        Tootelisamine: 'Lisatud leib',
        TellimusID: 1,
        KullerID: 1,
        createdAt: now,
        updatedAt: now

      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('teenindaja', null, {});
  }
};
