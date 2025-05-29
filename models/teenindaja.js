'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Teenindaja extends Model { // Changed to class-based definition for consistency
    static associate(models) {
      Teenindaja.belongsTo(models.Tellimus, { foreignKey: 'TellimusID' });
      Teenindaja.belongsTo(models.Kuller, { foreignKey: 'KullerID' });
      // Add other associations for Teenindaja if it has any, e.g., hasMany something
    }
  }

  Teenindaja.init({
    TeenindajaID: { // <-- ADDED: Explicit Primary Key
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    Nimi: DataTypes.STRING,
    Tootelisamine: DataTypes.STRING, // Ensure this column is intended for the Teenindaja model
    TellimusID: { // Foreign Key to Tellimus
      type: DataTypes.INTEGER,
      allowNull: false, // Or true, depending on if every Teenindaja must have a Tellimus
      references: {
        model: 'Tellimus', // <-- References the PascalCase Tellimus model/table
        key: 'TellimusID',  // <-- References the primary key of Tellimus
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    KullerID: { // Foreign Key to Kuller
      type: DataTypes.INTEGER,
      allowNull: true, 
      references: {
        model: 'Kuller', 
        key: 'KullerID',  
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    }
  }, {
    sequelize, // Pass the sequelize instance
    modelName: 'Teenindaja', // <-- ADDED: Explicit modelName
    tableName: 'Teenindaja', // Explicitly set the database table name (PascalCase for consistency)
    freezeTableName: true,   // Prevents Sequelize from pluralizing
    timestamps: true         // If you want createdAt/updatedAt
  });

  return Teenindaja;
};