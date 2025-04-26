// promotion model

'use strict';
module.exports = (sequelize, DataTypes) => {
  const Promotion = sequelize.define('Promotion', {
    employeeId: DataTypes.INTEGER,
    previousDesignation: DataTypes.STRING,
    newDesignation: DataTypes.STRING,
    promotionDate: DataTypes.DATE
  }, {});
  
  Promotion.associate = function(models) {
    Promotion.belongsTo(models.Employee, {
      foreignKey: 'employeeId',
      onDelete: 'CASCADE'
    });
  };
  
  return Promotion;
};
