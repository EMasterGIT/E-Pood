'use strict';
const { Model, DataTypes } = require('sequelize'); 

module.exports = (sequelize) => {
  const Kuller = sequelize.define('Kuller', {
    
    KullerID: {
      type: DataTypes.INTEGER,
      primaryKey: true,    
      autoIncrement: true, 
      allowNull: false     
    },
    Nimi: {
      type: DataTypes.STRING,
      allowNull: true 
    },
    Telefoninumber: {
      type: DataTypes.STRING,
      allowNull: true 
    },
    Tähtaeg: {
      type: DataTypes.DATE,
      allowNull: true 
    }
  }, {
    tableName: 'Kuller', 
    freezeTableName: true, 
    timestamps: true, 
    sequelize, 
    modelName: 'Kuller' 
  });

  Kuller.associate = function(models) {

    Kuller.hasMany(models.Tellimus, { foreignKey: 'KullerID' });

 
    Kuller.hasMany(models.Teenindaja, { foreignKey: 'KullerID' });
  };

  return Kuller;
};
