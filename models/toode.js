'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Toode extends Model {
    static associate(models) {
      // Define associations for Toode here if it has any, e.g.:
      // Toode.hasMany(models.OstukorviToode, { foreignKey: 'ToodeID' });
      // Toode.hasMany(models.TellimuseToode, { foreignKey: 'ToodeID' }); // If you have a join table
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
        type: DataTypes.STRING // URL to product image
      }
    },
    {
      sequelize,
      modelName: 'Toode',       // <-- MUST be PascalCase 'Toode'
      tableName: 'Toode',       // <-- Recommended: PascalCase 'Toode'
      freezeTableName: true,    // <-- IMPORTANT: Ensures tableName is used exactly
      timestamps: true          // Or false, depending on your needs
    }
  );

  return Toode;
};