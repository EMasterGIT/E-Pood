'use strict';
module.exports = (sequelize, DataTypes) => {
  const Toode = sequelize.define('toode', {
    ToodeID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    Nimetus: DataTypes.STRING,
    Kategooria: DataTypes.STRING,
    Hind: DataTypes.DECIMAL,
    Kogus: DataTypes.INTEGER,
    Asukoht: DataTypes.STRING
  }, 
  {
    tableName: 'toode',
    freezeTableName: true
  });

  Toode.associate = function(models) {
    Toode.hasMany(models.ostukorv, { foreignKey: 'ToodeID' });
  };

  return Toode;
};
