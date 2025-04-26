// termination model

'use strict'; 
module.exports = (sequelize, DataTypes) => { const Termination = sequelize.define('Termination', { employeeId: { type: DataTypes.INTEGER, allowNull: false }, reason: { type: DataTypes.STRING }, terminationDate: { type: DataTypes.DATE }, notes: { type: DataTypes.TEXT } }, {});

Termination.associate = function (models) { Termination.belongsTo(models.Employee, { foreignKey: 'employeeId', onDelete: 'CASCADE' }); };

return Termination; };