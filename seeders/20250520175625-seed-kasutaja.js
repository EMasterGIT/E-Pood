'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    await queryInterface.bulkInsert('Kasutaja', [
      {
        KasutajaID: 1,
        Nimi: 'User One',
        Email: 'user1@example.com',
        Telefoninumber: '1234567890',
        Parool: '123', 
        Roll: 'user',
        createdAt: now,
        updatedAt: now
      },
      {
        KasutajaID: 2,
        Nimi: 'User Two',
        Email: 'user2@example.com',
        Telefoninumber: '0987654321',
        Parool: '123',
        Roll: 'user',
        createdAt: now,
        updatedAt: now
      },
      {
        KasutajaID: 3,
        Nimi: 'Admin',
        Email: 'admin@rimi.com',
        Telefoninumber: '0987654321',
        Parool: '123',
        Roll: 'admin',
        createdAt: now,
        updatedAt: now
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Kasutaja', null, {});
  }
};
