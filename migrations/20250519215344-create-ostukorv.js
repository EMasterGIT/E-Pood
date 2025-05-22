'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ostukorv', {
      OstukorvID: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      KasutajaID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'kasutaja', // table name in your DB (plural if needed)
          key: 'KasutajaID'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      ToodeID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'toode', // table name in your DB
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      Kogus: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ostukorv');
  }
};
