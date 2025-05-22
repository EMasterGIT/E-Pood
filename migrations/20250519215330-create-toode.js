'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('toode', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      Nimetus: {
        type: Sequelize.STRING
      },
      Kategooria: {
        type: Sequelize.STRING
      },
      Hind: {
        type: Sequelize.DECIMAL
      },
      Kogus: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('toode');
  }
};