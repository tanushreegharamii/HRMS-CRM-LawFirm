'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class OfflineClient extends Model {
    static associate(models) {
      // Later: OfflineClient.hasMany(models.Case, { foreignKey: 'offlineClientId' });
    }
  }

  OfflineClient.init(
    {
      fullName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false
      },
      address: {
        type: DataTypes.STRING
      },
      city: {
        type: DataTypes.STRING
      },
      country: {
        type: DataTypes.STRING
      },
      createdByAdvocateId: {
        type: DataTypes.INTEGER
      },
      createdByAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    },
    {
      sequelize,
      modelName: 'OfflineClient'
    }
  );

  return OfflineClient;
};
