'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Teenindaja extends Model { 
    static associate(models) {
      Teenindaja.belongsTo(models.Tellimus, { foreignKey: 'TellimusID' });
      Teenindaja.belongsTo(models.Kuller, { foreignKey: 'KullerID' });
      
    }
  }

  Teenindaja.init({
    TeenindajaID: { 
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    Nimi: DataTypes.STRING,
    TellimusID: { 
      type: DataTypes.INTEGER,
      allowNull: false, 
      references: {
        model: 'Tellimus', 
        key: 'TellimusID',  
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    KullerID: { 
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
    sequelize, 
    modelName: 'Teenindaja', 
    tableName: 'Teenindaja', 
    freezeTableName: true,   
    timestamps: true         
  });

  return Teenindaja;
};