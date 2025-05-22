'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tellimus', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      KasutajaID: {
        type: Sequelize.INTEGER
      },
      OstukorvID: {
        type: Sequelize.INTEGER
      },
      KullerID: {
        type: Sequelize.INTEGER
      },
      Staatus: {
        type: Sequelize.STRING
      },
      Asukoht: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('tellimus');
  }
};