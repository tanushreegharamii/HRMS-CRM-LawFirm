'use strict';

module.exports = (sequelize, DataTypes) => {
  const Attendance = sequelize.define('Attendance', {
    employeeId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    check_in: {
      type: DataTypes.TIME,
      allowNull: true
    },
    check_out: {
      type: DataTypes.TIME,
      allowNull: true
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'present'
    },
    remarks: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'Attendances',
    freezeTableName: true
  });

  Attendance.associate = function(models) {
    // Optionally, you can set an alias here if you plan to include Employee details:
    Attendance.belongsTo(models.Employee, { foreignKey: 'employeeId', as: 'employee' });
  };

  return Attendance;
};
