'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    await queryInterface.bulkInsert('Toode', [
      {
       
        ToodeID: 1,
        Nimi: 'Leib',        
        Kirjeldus: 'Värske rukkileib', 
        Kategooria: 'Toit',
        Hind: 1.50,
        Laoseis: 100,         
        PiltURL: '', 
        createdAt: now,
        updatedAt: now
      },
      {
        ToodeID: 2,
        Nimi: 'Piim',         
        Kirjeldus: 'Täispiim 2.5%',    
        Kategooria: 'Joogid',
        Hind: 0.90,
        Laoseis: 200,         
        PiltURL: '',
        createdAt: now,
        updatedAt: now
      },
      
    ]);
  },

  async down(queryInterface, Sequelize) {
    
    await queryInterface.bulkDelete('Toode', null, {});
  }
};