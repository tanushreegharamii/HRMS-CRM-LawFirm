'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Case extends Model {
    static associate(models) {
      Case.belongsTo(models.Client, { foreignKey: 'clientId' });
      Case.belongsTo(models.Advocate, { foreignKey: 'advocateId' });
    }
  }

  Case.init({
    clientId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    advocateId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    caseName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    caseType: {
      type: DataTypes.STRING,
      allowNull: true
    },
    caseStatus: {
      type: DataTypes.ENUM('running', 'disposed'),
      defaultValue: 'running'
    },
    caseDetails: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    aadhaarUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    documents: {
      type: DataTypes.JSON,
      allowNull: true
    },
    uploadedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'Case',
  });

  return Case;
};
