'use strict';

module.exports = (sequelize, DataTypes) => {
  const EmployeeAction = sequelize.define('EmployeeAction', {
    employeeId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    actionType: {  // e.g., 'termination', 'transfer', 'promotion'
      type: DataTypes.STRING,
      allowNull: false
    },
    details: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    actionDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'EmployeeActions',
    freezeTableName: true
  });

  EmployeeAction.associate = function(models) {
    EmployeeAction.belongsTo(models.Employee, { foreignKey: 'employeeId' });
  };

  return EmployeeAction;
};
