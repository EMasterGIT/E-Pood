'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    
    await queryInterface.createTable('ostukorviToode', {
      OstukorviToodeID: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      OstukorvID: { 
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'ostukorv', 
          key: 'OstukorvID'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE' 
      },
      ToodeID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'toode', 
          key: 'ToodeID'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      Kogus: { 
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1 
      },
      Hind: { 
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
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

  down: async (queryInterface, Sequelize) => {
    
    await queryInterface.dropTable('ostukorviToode');
  }
};