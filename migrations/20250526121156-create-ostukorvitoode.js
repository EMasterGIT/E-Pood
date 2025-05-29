'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create the OstukorviToode table
    await queryInterface.createTable('ostukorviToode', {
      OstukorviToodeID: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      OstukorvID: { // Foreign Key to the new Ostukorv (header) table
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'ostukorv', // Make sure your Ostukorv header table is named 'Ostukorv'
          key: 'OstukorvID'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE' // Or 'SET NULL' if you prefer
      },
      ToodeID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'toode', // Assuming your product table is named 'toode'
          key: 'ToodeID' // Assuming your product ID column is named 'ToodeID'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      Kogus: { // Quantity of this product in the cart
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1 // Default quantity when added
      },
      Hind: { // Price of the product when it was added to the cart
        type: Sequelize.DECIMAL(10, 2), // Adjust precision and scale as needed (e.g., 10 total digits, 2 after decimal)
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
    // Drop the OstukorviToode table if rolling back
    await queryInterface.dropTable('ostukorviToode');
  }
};