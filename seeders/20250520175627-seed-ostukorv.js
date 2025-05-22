'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.bulkInsert('ostukorv', [
      {
        KasutajaID: 1,
        ToodeID: 1,
        Kogus: 2,
        createdAt: now,
        updatedAt: now
      },
      {
        KasutajaID: 2,
        ToodeID: 2,
        Kogus: 1,
        createdAt: now,
        updatedAt: now
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ostukorv', null, {});
  }
};
