'use strict';
const { Model, DataTypes } = require('sequelize'); // Ensure DataTypes is imported

module.exports = (sequelize) => {
  const Kuller = sequelize.define('Kuller', {
    // Define KullerID as the primary key
    KullerID: {
      type: DataTypes.INTEGER,
      primaryKey: true,    // <--- THIS IS CRUCIAL: Marks it as the primary key
      autoIncrement: true, // <--- Recommended for primary keys to auto-generate values
      allowNull: false     // <--- Recommended for primary keys
    },
    Nimi: {
      type: DataTypes.STRING,
      allowNull: true // Assuming Nimi can be null, adjust as per your requirement
    },
    Telefoninumber: {
      type: DataTypes.STRING,
      allowNull: true // Assuming Telefoninumber can be null
    },
    Tähtaeg: {
      type: DataTypes.DATE,
      allowNull: true // Assuming Tähtaeg can be null
    }
  }, {
    tableName: 'Kuller', // Use this if you want the table name to be exactly 'kuller' (lowercase, singular)
    freezeTableName: true, // This is important if you set tableName to prevent Sequelize from pluralizing
    timestamps: true, // Keep this if you want createdAt/updatedAt columns
    sequelize, // Pass the sequelize instance
    modelName: 'Kuller' // Explicitly set the model name
  });

  Kuller.associate = function(models) {
    // Kuller (the current model) has many Tellimus
    // The foreignKey should match the column name in the Tellimus table that references KullerID
    Kuller.hasMany(models.Tellimus, { foreignKey: 'KullerID' });

    // Kuller (the current model) has many Teenindaja
    // The foreignKey should match the column name in the Teenindaja table that references KullerID
    Kuller.hasMany(models.Teenindaja, { foreignKey: 'KullerID' });
  };

  return Kuller;
};
