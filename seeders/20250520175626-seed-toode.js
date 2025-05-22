'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    await queryInterface.bulkInsert('toode', [
      {
        id: 1,
        Nimetus: 'Leib',
        Kategooria: 'Toit',
        Hind: 1.50,
        Kogus: 100,
        Asukoht: 'Riiul 1',
        createdAt: now,
        updatedAt: now
      },
      {
        id: 2,
        Nimetus: 'Piim',
        Kategooria: 'Joogid',
        Hind: 0.90,
        Kogus: 200,
        Asukoht: 'Külmik',
        createdAt: now,
        updatedAt: now
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('toode', null, {});
  }
};
