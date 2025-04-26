//employee model

'use strict';

module.exports = (sequelize, DataTypes) => {
  const Employee = sequelize.define('Employee', {
    employee_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    employee_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'employee'
    },
    department: {
      type: DataTypes.STRING,
      allowNull: true
    },
    designation: DataTypes.STRING,
    join_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    status: DataTypes.STRING,
    jobLocation: DataTypes.STRING,
    aadhaar_number: {
      type: DataTypes.STRING,
      allowNull: true
    },
    profile_photo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    aadhaar_image: {
      type: DataTypes.STRING,
      allowNull: true
    },
    salary: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'Employees',
    freezeTableName: true
  });

  Employee.associate = function(models) {
    // Explicitly set alias "attendances" (all lowercase)
    Employee.hasMany(models.Attendance, { foreignKey: 'employeeId', as: 'attendances' });
    Employee.hasMany(models.LeaveRequest, { foreignKey: 'employeeId', as: 'leaveRequests' });
    Employee.hasMany(models.Payroll, { foreignKey: 'employeeId', as: 'payroll' });
    // And so on for other associations...
  };

  return Employee;
};
