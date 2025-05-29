'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    await queryInterface.bulkInsert('Toode', [
      {
        // ToodeID is typically auto-incremented, so you might omit it here.
        // However, if you explicitly want to set IDs, ensure no conflicts.
        ToodeID: 1,
        Nimi: 'Leib',         // Corrected from Nimetus
        Kirjeldus: 'Värske rukkileib', // Added based on Toode.js model
        Kategooria: 'Toit',
        Hind: 1.50,
        Laoseis: 100,         // Corrected from Kogus
        PiltURL: '', // Added based on Toode.js model
        createdAt: now,
        updatedAt: now
      },
      {
        ToodeID: 2,
        Nimi: 'Piim',         // Corrected from Nimetus
        Kirjeldus: 'Täispiim 2.5%',    // Added based on Toode.js model
        Kategooria: 'Joogid',
        Hind: 0.90,
        Laoseis: 200,         // Corrected from Kogus
        PiltURL: '',
        createdAt: now,
        updatedAt: now
      },
      // You can add more product data here
    ]);
  },

  async down(queryInterface, Sequelize) {
    // This will delete all entries from the 'Toode' table when rolling back this seeder.
    await queryInterface.bulkDelete('Toode', null, {});
  }
};