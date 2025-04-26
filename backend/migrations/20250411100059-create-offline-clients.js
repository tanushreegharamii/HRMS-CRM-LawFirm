// create offline client migration file

'use strict'; 
module.exports = { async up(queryInterface, Sequelize) {
   await queryInterface.createTable('OfflineClients', 
    { id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER }, 
    fullName: { type: Sequelize.STRING, allowNull: false }, 
    phone: { type: Sequelize.STRING, allowNull: false }, 
    address: { type: Sequelize.STRING }, 
    city: { type: Sequelize.STRING }, 
    country: { type: Sequelize.STRING }, 
    createdByAdvocateId: { type: Sequelize.INTEGER, allowNull: true }, 
    createdByAdmin: { type: Sequelize.BOOLEAN, defaultValue: false }, 
    createdAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') }, 
    updatedAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') } }); }, 
    async down(queryInterface, Sequelize) { await queryInterface.dropTable('OfflineClients'); } };