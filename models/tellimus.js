// models/tellimus.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Tellimus extends Model {
    static associate(models) {
      
      Tellimus.belongsTo(models.Kasutaja, { foreignKey: 'KasutajaID', as: 'kasutaja' });
      Tellimus.belongsTo(models.Ostukorv, { foreignKey: 'OstukorvID', as: 'ostukorv' });
      Tellimus.belongsTo(models.Kuller, { foreignKey: 'KullerID', as: 'kuller' });
    
    }
  }

  Tellimus.init(
    {
      TellimusID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true
      },
      KasutajaID: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      OstukorvID: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      KullerID: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      Staatus: {
        type: DataTypes.STRING,
        defaultValue: 'Ootel'
      },
      Asukoht: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'Tellimus',
      tableName: 'Tellimus',
      timestamps: true
    }
  );

  return Tellimus;
};