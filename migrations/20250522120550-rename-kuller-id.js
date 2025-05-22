'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
   
    await queryInterface.renameColumn('kuller', 'id', 'KullerID');
  },

  down: async (queryInterface, Sequelize) => {
    
    await queryInterface.renameColumn('kuller', 'KullerID', 'id');
  }
};
