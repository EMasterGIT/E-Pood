'use strict';
module.exports = (sequelize, DataTypes) => {
  const Ostukorv = sequelize.define('ostukorv', {
    KasutajaID: DataTypes.INTEGER,
    ToodeID: DataTypes.INTEGER,
    Kogus: DataTypes.INTEGER
  }, {});
  
  Ostukorv.associate = function(models) {
    Ostukorv.belongsTo(models.kasutaja, { foreignKey: 'KasutajaID' });
    Ostukorv.belongsTo(models.toode, { foreignKey: 'ToodeID' });
    Ostukorv.hasMany(models.tellimus, { foreignKey: 'OstukorvID' });
  };

  return Ostukorv;
};
