// Migration file This creates new column on employees existing table
//creates new column on employees existing table

'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Employees', 'status', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'active' // Options can be: active, terminated, on_leave, etc.
    });
    await queryInterface.addColumn('Employees', 'jobLocation', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Employees', 'status');
    await queryInterface.removeColumn('Employees', 'jobLocation');
  }
};
