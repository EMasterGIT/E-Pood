'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Ostukorv = sequelize.define('Ostukorv', {
    OstukorvID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    KasutajaID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Kasutaja', 
        key: 'KasutajaID',  
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    Staatus: {
      type: DataTypes.ENUM('Aktiivne', 'Kinnitatud'), 
      allowNull: false,
      defaultValue: 'Aktiivne'
    }
  }, {
    sequelize,
    modelName: 'Ostukorv', 
    tableName: 'Ostukorv', 
    freezeTableName: true, 
    timestamps: true
  });

  Ostukorv.associate = (models) => {
    Ostukorv.belongsTo(models.Kasutaja, { 
      foreignKey: 'KasutajaID',
      as: 'kasutaja',
    });

    Ostukorv.hasMany(models.OstukorviToode, { 
      foreignKey: 'OstukorvID',
      as: 'ostukorviTooted',
    });

    Ostukorv.hasOne(models.Tellimus, { 
      foreignKey: 'OstukorvID',
      as: 'tellimus',
    });
  };

  return Ostukorv;
};