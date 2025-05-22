'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    await queryInterface.bulkInsert('tellimus', [
      {
        KasutajaID: 1,
        OstukorvID: 1,
        KullerID: 1,
        Staatus: 'Töötlemisel',
        Asukoht: 'Tallinn',
        createdAt: now,
        updatedAt: now
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tellimus', null, {});
  }
};
