// migrations/XXXXXXXXXXXXXX-create-kasutaja.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('kasutaja', {
      KasutajaID: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      Nimi: {
        type: Sequelize.STRING,
        allowNull: false
      },
      Email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      Telefoninumber: {
        type: Sequelize.STRING
      },
      Parool: {
        type: Sequelize.STRING,
        allowNull: false
      },
      Roll: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'user'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('kasutaja');
  }
};
