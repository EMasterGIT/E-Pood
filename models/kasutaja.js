// models/Kasutaja.js
'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Kasutaja extends Model {
    static associate(models) {
      Kasutaja.hasMany(models.Ostukorv, { foreignKey: 'KasutajaID' });
      Kasutaja.hasMany(models.Tellimus, { foreignKey: 'KasutajaID' });
      
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
      modelName: 'Kasutaja', 
      tableName: 'Kasutaja', 
      freezeTableName: true, 
      timestamps: true
    }
  );

  return Kasutaja;
};