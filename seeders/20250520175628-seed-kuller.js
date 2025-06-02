'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    
    await queryInterface.bulkInsert('Kuller', [
      {
        Nimi: 'Kuller Mart',
        Telefoninumber: '+372 5551 1111',
        Tähtaeg: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        createdAt: now,
        updatedAt: now
      },
      {
        Nimi: 'Kuller Kati',
        Telefoninumber: '+372 5552 2222',
        Tähtaeg: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        createdAt: now,
        updatedAt: now
      },
      {
        Nimi: 'Kuller Jaan',
        Telefoninumber: '+372 5553 3333',
        Tähtaeg: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        createdAt: now,
        updatedAt: now
      },
      {
        Nimi: 'Kuller Mari',
        Telefoninumber: '+372 5554 4444',
        Tähtaeg: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        createdAt: now,
        updatedAt: now
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Kuller', null, {});
  }
};