'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Client extends Model {
    static associate(models) {
      // define associations here if needed later
      // e.g., Client.hasMany(models.Case)
    }
  }

  Client.init(
    {
      name: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
      phone: { type: DataTypes.STRING, allowNull: false },
      address: { type: DataTypes.STRING },
      city: { type: DataTypes.STRING },
      country: { type: DataTypes.STRING },
      password: { type: DataTypes.STRING, allowNull: false },
      profileImage: { type: DataTypes.STRING, allowNull: true }
    },
    {
      sequelize,
      modelName: 'Client',
      tableName: 'Clients',
      timestamps: true
    }
  );
  
  Client.associate = function(models) {
    Client.hasMany(models.Case, { foreignKey: 'clientId' });
  };
  
  return Client;
};
