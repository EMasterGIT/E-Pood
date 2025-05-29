'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    // Fetch real TellimusIDs and KullerIDs
    const tellimused = await queryInterface.sequelize.query(
      `SELECT "TellimusID" FROM "Tellimus" ORDER BY "TellimusID" ASC LIMIT 2;`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const kullerid = await queryInterface.sequelize.query(
      `SELECT "KullerID" FROM "Kuller" ORDER BY "KullerID" ASC LIMIT 2;`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    // Optional: check and log
    console.log('Using TellimusIDs:', tellimused.map(t => t.TellimusID));
    console.log('Using KullerIDs:', kullerid.map(k => k.KullerID));

    await queryInterface.bulkInsert('Teenindaja', [
      {
        Nimi: 'Teenindaja 1',
        KullerID: kullerid[0].KullerID,
        TellimusID: tellimused[0].TellimusID,
        createdAt: now,
        updatedAt: now
      },
      {
        Nimi: 'Teenindaja 2',
        KullerID: kullerid[1].KullerID,
        TellimusID: tellimused[1].TellimusID,
        createdAt: now,
        updatedAt: now
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Teenindaja', null, {});
  }
};
