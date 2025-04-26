'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Employees', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      employee_id: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      employee_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: true
      },
      address: {
        type: Sequelize.STRING,
        allowNull: true
      },
      role: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'employee'  // 'admin' for admin accounts
      },
      department: {
        type: Sequelize.STRING,
        allowNull: true
      },
      
      join_date: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      aadhaar_number: {
        type: Sequelize.STRING,
        allowNull: true
      },
      profile_photo: {
        type: Sequelize.STRING,
        allowNull: true
      },
      aadhaar_image: {
        type: Sequelize.STRING,
        allowNull: true
      },
      salary: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
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
    await queryInterface.dropTable('Employees');
  }
};
