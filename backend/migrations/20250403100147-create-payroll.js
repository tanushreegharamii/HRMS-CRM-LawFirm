'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Payrolls', {
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
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      monthYear: {  // e.g., "2025-04"
        type: Sequelize.STRING,
        allowNull: false
      },
      baseSalary: {
        type: Sequelize.DECIMAL(10,2),
        allowNull: false
      },
      bonus: {
        type: Sequelize.DECIMAL(10,2),
        defaultValue: 0
      },
      deductions: {
        type: Sequelize.DECIMAL(10,2),
        defaultValue: 0
      },
      netPay: {   // baseSalary + bonus - deductions
        type: Sequelize.DECIMAL(10,2),
        allowNull: false
      },
      paidDate: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Payrolls');
  }
};
