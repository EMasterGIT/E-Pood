'use strict';
module.exports = (sequelize, DataTypes) => {
  const Teenindaja = sequelize.define('teenindaja', {
    Nimi: DataTypes.STRING,
    Tootelisamine: DataTypes.STRING,
    TellimusID: DataTypes.INTEGER,
    KullerID: DataTypes.INTEGER
  }, {});
  
  Teenindaja.associate = function(models) {
    Teenindaja.belongsTo(models.tellimus, { foreignKey: 'TellimusID' });
    Teenindaja.belongsTo(models.kuller, { foreignKey: 'KullerID' });
  };

  return Teenindaja;
};
