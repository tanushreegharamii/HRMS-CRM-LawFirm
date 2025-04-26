'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Promotions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      employeeId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Employees',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      previousDesignation: {
        type: Sequelize.STRING
      },
      newDesignation: {
        type: Sequelize.STRING
      },
      promotionDate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Promotions');
  }
};
