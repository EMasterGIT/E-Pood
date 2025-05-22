'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    await queryInterface.bulkInsert('kuller', [
      {
        Nimi: 'Mati Maantee',
        Telefoninumber: '5550011',
        Tähtaeg: new Date('2025-05-25'),
        createdAt: now,
        updatedAt: now
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('kuller', null, {});
  }
};
