'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Employees', 'designation', {
      type: Sequelize.STRING,
      allowNull: true  // keep it optional to avoid breaking existing rows
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Employees', 'designation');
  }
};
