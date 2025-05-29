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
        model: 'Kasutaja', // <-- CORRECTED: PascalCase 'Kasutaja'
        key: 'KasutajaID',  // Make sure 'KasutajaID' is the actual primary key in your Kasutaja model
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
    modelName: 'Ostukorv', // Correct (PascalCase)
    tableName: 'Ostukorv', // Correct
    freezeTableName: true, // Correct
    timestamps: true
  });

  Ostukorv.associate = (models) => {
    Ostukorv.belongsTo(models.Kasutaja, { // This already correctly references models.Kasutaja (PascalCase)
      foreignKey: 'KasutajaID',
      as: 'kasutaja',
    });

    Ostukorv.hasMany(models.OstukorviToode, { // This already correctly references models.OstukorviToode (PascalCase)
      foreignKey: 'OstukorvID',
      as: 'ostukorviTooted',
    });

    Ostukorv.hasOne(models.Tellimus, { // This already correctly references models.Tellimus (PascalCase)
      foreignKey: 'OstukorvID',
      as: 'tellimus',
    });
  };

  return Ostukorv;
};