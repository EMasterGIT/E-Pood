'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class OstukorviToode extends Model {}
  OstukorviToode.init({
    OstukorviToodeID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    OstukorvID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Ostukorv', 
        key: 'OstukorvID'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    ToodeID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Toode',    
        key: 'ToodeID'     
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    Kogus: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Hind: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'OstukorviToode', 
    tableName: 'OstukorviToode', 
    freezeTableName: true,       
    timestamps: true
  });

  OstukorviToode.associate = (models) => {
    OstukorviToode.belongsTo(models.Ostukorv, { 
      foreignKey: 'OstukorvID',
      as: 'ostukorv',
    });
    OstukorviToode.belongsTo(models.Toode, { 
      foreignKey: 'ToodeID',
      as: 'toode',
    });
  };

  return OstukorviToode;
};