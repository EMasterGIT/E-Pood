'use strict';
module.exports = (sequelize, DataTypes) => {
  const Tellimus = sequelize.define('tellimus', {
    KasutajaID: DataTypes.INTEGER,
    OstukorvID: DataTypes.INTEGER,
    KullerID: DataTypes.INTEGER,
    Staatus: DataTypes.STRING,
    Asukoht: DataTypes.STRING
  }, {});
  
  Tellimus.associate = function(models) {
    Tellimus.belongsTo(models.kasutaja, { foreignKey: 'KasutajaID' });
    Tellimus.belongsTo(models.ostukorv, { foreignKey: 'OstukorvID' });
    Tellimus.belongsTo(models.kuller, { foreignKey: 'KullerID' });
    Tellimus.hasMany(models.teenindaja, { foreignKey: 'TellimusID' });
  };

  return Tellimus;
};
