'use strict'; const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => { class OfflineCase extends Model { static associate(models) { OfflineCase.belongsTo(models.OfflineClient, { foreignKey: 'offlineClientId' }); OfflineCase.belongsTo(models.Advocate, { foreignKey: 'advocateId' }); } }

OfflineCase.init( { offlineClientId: { type: DataTypes.INTEGER, allowNull: false }, advocateId: { type: DataTypes.INTEGER, allowNull: false }, caseName: { type: DataTypes.STRING, allowNull: false }, caseType: { type: DataTypes.STRING }, caseStatus: { type: DataTypes.ENUM('running', 'disposed'), defaultValue: 'running' }, caseDetails: { type: DataTypes.TEXT }, aadhaarUrl: { type: DataTypes.STRING }, documents: { type: DataTypes.JSON }, uploadedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },   clientName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  offlineClientId: {
    type: DataTypes.INTEGER,
    allowNull: true,        
  },
  advocateId: {
    type: DataTypes.INTEGER,
    allowNull: true         
  },
  clientType: {
    type: DataTypes.STRING
  },
  country: {
    type: DataTypes.STRING
  },
  phNumber: {
    type: DataTypes.STRING
  },
  address: {
    type: DataTypes.STRING
  },
  associatedWithAdvocate: {
    type: DataTypes.STRING
  },
  advocateName: {
    type: DataTypes.STRING
  },
  advocatePhNumber: {
    type: DataTypes.STRING
  },
  isPaymentDone: {
    type: DataTypes.STRING
  },
  paymentMode: {
    type: DataTypes.STRING
  },
  paymentDateTime: {
    type: DataTypes.DATE
  },
  fees: {
    type: DataTypes.INTEGER
  },
  generateInvoice: {
    type: DataTypes.BOOLEAN
  }
},
{
  sequelize,
  modelName: 'OfflineCase'
}
);

return OfflineCase; };