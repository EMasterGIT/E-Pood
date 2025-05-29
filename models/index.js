'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env]; 
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

console.log('[DEBUG] Starting model loading...');

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    try {
      const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
      db[model.name] = model;
      console.log(`[DEBUG] Successfully loaded model: ${model.name}. Its type is: ${model.name ? (model.prototype instanceof Sequelize.Model ? 'Sequelize.Model' : 'NOT Sequelize.Model (Object)') : 'UNKNOWN - model.name missing'}`);
    } catch (error) {
      console.error(`[ERROR] Failed to load model from file: ${file}. Error:`, error.message);
    }
  });

console.log('[DEBUG] All files read. Models collected:');
Object.keys(db).forEach(key => {
  console.log(`  - db.${key}: ${db[key] ? 'LOADED' : 'UNDEFINED'}`);
});

console.log('[DEBUG] Starting associations...');
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    console.log(`[DEBUG] Associating model: ${modelName}`);
    try {
      db[modelName].associate(db); // Pass the full db object for associations
      console.log(`[DEBUG] Associated ${modelName} successfully.`);
    } catch (error) {
      console.error(`[ERROR] Failed to associate model ${modelName}. Error:`, error.message);
      // If this happens, it's usually the "not a subclass" error
    }
  }
});
console.log('[DEBUG] Associations complete.');

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;