// leave request model

'use strict';

module.exports = (sequelize, DataTypes) => {
  const LeaveRequest = sequelize.define('LeaveRequest', {
    employeeId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    reason: {
      type: DataTypes.STRING,
      allowNull: true
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pending'
    }
  }, {
    tableName: 'LeaveRequests',
    freezeTableName: true
  });

  LeaveRequest.associate = function(models) {
    //alias
    LeaveRequest.belongsTo(models.Employee, { foreignKey: 'employeeId', as: 'employee' });

  };

  return LeaveRequest;
};
