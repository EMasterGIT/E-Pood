'use strict';
module.exports = (sequelize, DataTypes) => {
  const Kuller = sequelize.define('kuller', {
    Nimi: DataTypes.STRING,
    Telefoninumber: DataTypes.STRING,
    Tähtaeg: DataTypes.DATE
  }, {});
  
  Kuller.associate = function(models) {
    Kuller.hasMany(models.tellimus, { foreignKey: 'KullerID' });
    Kuller.hasMany(models.teenindaja, { foreignKey: 'KullerID' });
  };

  return Kuller;
};
