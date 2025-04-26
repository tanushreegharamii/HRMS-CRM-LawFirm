'use strict';

module.exports = { async up(queryInterface, Sequelize) { await queryInterface.createTable('Terminations', { id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER }, employeeId: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'Employees', key: 'id' }, onDelete: 'CASCADE' }, reason: { type: Sequelize.STRING }, terminationDate: { type: Sequelize.DATE, allowNull: false }, notes: { type: Sequelize.TEXT }, createdAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }, updatedAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') } }); },

async down(queryInterface, Sequelize) { await queryInterface.dropTable('Terminations'); } };