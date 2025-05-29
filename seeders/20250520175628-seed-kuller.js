'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    await queryInterface.bulkInsert('Kuller', [
      {
        Nimi: 'Kuller 1',
        createdAt: now,
        updatedAt: now
      },
      {
        Nimi: 'Kuller 2',
        createdAt: now,
        updatedAt: now
      }
    ], {
      returning: true // Works in PostgreSQL
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Kuller', null, {});
  }
};
