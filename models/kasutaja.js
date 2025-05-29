// models/Kasutaja.js
'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Kasutaja extends Model {
    static associate(models) {
      Kasutaja.hasMany(models.Ostukorv, { foreignKey: 'KasutajaID' });
      Kasutaja.hasMany(models.Tellimus, { foreignKey: 'KasutajaID' });
      // Add any other Kasutaja associations here
    }
  }

  Kasutaja.init(
    {
      KasutajaID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      Nimi: {
        type: DataTypes.STRING,
        allowNull: false
      },
      Email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      Telefoninumber: {
        type: DataTypes.STRING
      },
      Parool: {
        type: DataTypes.STRING,
        allowNull: false
      },
      Roll: {
        type: DataTypes.STRING,
        defaultValue: 'user',
      }
    },
    {
      sequelize,
      modelName: 'Kasutaja', // MUST be PascalCase
      tableName: 'Kasutaja', // MUST be PascalCase and match 'model' in other references
      freezeTableName: true, // IMPORTANT: ensures tableName is used exactly
      timestamps: true
    }
  );

  return Kasutaja;
};