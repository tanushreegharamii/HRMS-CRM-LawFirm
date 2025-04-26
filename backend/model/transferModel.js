// transfer model

'use strict';
module.exports = (sequelize, DataTypes) => {
  const Transfer = sequelize.define('Transfer', {
    employeeId: DataTypes.INTEGER,
    fromDepartment: DataTypes.STRING,
    toDepartment: DataTypes.STRING,
    fromLocation: DataTypes.STRING,
    toLocation: DataTypes.STRING,
    transferDate: DataTypes.DATE,
    reason: DataTypes.STRING
  }, {});

  Transfer.associate = function(models) {
    Transfer.belongsTo(models.Employee, {
      foreignKey: 'employeeId',
      onDelete: 'CASCADE'
    });
  };

  return Transfer;
};
