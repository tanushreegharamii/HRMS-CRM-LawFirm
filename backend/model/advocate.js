'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Advocate extends Model {
    static associate(models) {
      Advocate.hasMany(models.Case, { foreignKey: 'advocateId' });
    }
  }

  Advocate.init({
    name: {
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
      type: DataTypes.TEXT,
      allowNull: true
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true
    },
    experience: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    specialization: {
      type: DataTypes.STRING,
      allowNull: true
    },
    profileImage: {
      type: DataTypes.STRING,
      allowNull: true
    },
    licenseNumber: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    
  }, {
    sequelize,
    modelName: 'Advocate',
  });
  Advocate.associate = function(models) {
    Advocate.hasMany(models.Case, { foreignKey: 'advocateId' });
  };
  

  return Advocate;
};
