// payroll model

'use strict';

module.exports = (sequelize, DataTypes) => {
  const Payroll = sequelize.define('Payroll', {
    employeeId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    monthYear: {
      type: DataTypes.STRING,
      allowNull: false
    },
    baseSalary: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    bonus: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },
    deductions: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },
    netPay: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    paidDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    }
  }, {
    tableName: 'Payrolls',
    freezeTableName: true
  });

  Payroll.associate = function(models) {
    Payroll.belongsTo(models.Employee, { foreignKey: 'employeeId' , as: 'employee' });
  };

  return Payroll;
};
