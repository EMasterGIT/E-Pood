// models/kasutaja.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class kasutaja extends Model {
    static associate(models) {
      kasutaja.hasMany(models.ostukorv, { foreignKey: 'KasutajaID' });
      kasutaja.hasMany(models.tellimus, { foreignKey: 'KasutajaID' });
    }
  }

  kasutaja.init(
    {
      KasutajaID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
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
      modelName: 'kasutaja',
      tableName: 'kasutaja',
      timestamps: false
    }
  );

  return kasutaja;
};
