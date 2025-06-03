'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Toode extends Model {
    static associate(models) {
  
    }
  }

  Toode.init(
    {
      ToodeID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      Nimi: {
        type: DataTypes.STRING,
        allowNull: false
      },
      Kirjeldus: {
        type: DataTypes.TEXT
      },
      Hind: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        get() {
          const rawValue = this.getDataValue('Hind');
          return rawValue === null ? null : Number(rawValue);
        }
      },
      Kategooria: {
        type: DataTypes.STRING
      },
      Laoseis: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      PiltURL: {
        type: DataTypes.STRING 
      }
    },
    {
      sequelize,
      modelName: 'Toode',       
      tableName: 'Toode',       
      freezeTableName: true,    
      timestamps: true          
    }
  );

  return Toode;
};