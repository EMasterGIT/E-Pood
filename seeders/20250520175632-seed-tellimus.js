'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    // Get the first 2 carts
    const carts = await queryInterface.sequelize.query(
      `SELECT "OstukorvID", "KasutajaID"
       FROM "Ostukorv"
       ORDER BY "OstukorvID" ASC
       LIMIT 2;`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    // Get the first 2 kullers
    const kullers = await queryInterface.sequelize.query(
      `SELECT "KullerID"
       FROM "Kuller"
       ORDER BY "KullerID" ASC
       LIMIT 2;`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    await queryInterface.bulkInsert('Tellimus', [
      {
        KasutajaID: carts[0].KasutajaID,
        OstukorvID: carts[0].OstukorvID,
        KullerID: kullers[0].KullerID,
        Staatus: 'Pending',
        Asukoht: 'Tallinn, Example St 10',
        createdAt: now,
        updatedAt: now
      },
      {
        KasutajaID: carts[1].KasutajaID,
        OstukorvID: carts[1].OstukorvID,
        KullerID: kullers[1].KullerID,
        Staatus: 'Processing',
        Asukoht: 'Tartu, Main Rd 5',
        createdAt: now,
        updatedAt: now
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Tellimus', null, {});
  }
};
