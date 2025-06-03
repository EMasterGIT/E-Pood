module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ostukorv', {
      OstukorvID: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      KasutajaID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'kasutaja', 
          key: 'KasutajaID' 
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      Staatus: {
        type: Sequelize.ENUM('Aktiivne', 'Kinnitatud'),
        allowNull: false,
        defaultValue: 'Aktiivne'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('ostukorv');
  }
};