'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Transfers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      employeeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Employees',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      fromDepartment: {
        type: Sequelize.STRING
      },
      toDepartment: {
        type: Sequelize.STRING
      },
      fromLocation: {
        type: Sequelize.STRING
      },
      toLocation: {
        type: Sequelize.STRING
      },
      transferDate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      reason: {
        type: Sequelize.STRING
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Transfers');
  }
};
