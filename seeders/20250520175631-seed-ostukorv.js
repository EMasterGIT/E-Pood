'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    const carts = await queryInterface.bulkInsert('Ostukorv', [
      {
        KasutajaID: 1,
        Staatus: 'Active',
        createdAt: now,
        updatedAt: now
      },
      {
        KasutajaID: 2,
        Staatus: 'Active',
        createdAt: now,
        updatedAt: now
      },
      {
        KasutajaID: 1,
        Staatus: 'Ordered',
        createdAt: now,
        updatedAt: now
      }
    ], {
      returning: true // This is critical for PostgreSQL to get the inserted rows
    });

    // Optional: Log to verify what's inserted
    console.log('Seeded Ostukorv carts:', carts);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Ostukorv', null, {});
  }
};
