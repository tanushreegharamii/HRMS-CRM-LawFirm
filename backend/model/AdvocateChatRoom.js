'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class AdvoChatRoom extends Model {
    static associate(models) {
      // One chatroom has many messages
      AdvoChatRoom.hasMany(models.AdvoMessage, {
        foreignKey: 'advoChatRoomId',
        as: 'messages',
        onDelete: 'CASCADE',
      });

      // Associate to two advocates
      AdvoChatRoom.belongsTo(models.Advocate, {
        foreignKey: 'advocateOneId',
        as: 'Initiator',
      });

      AdvoChatRoom.belongsTo(models.Advocate, {
        foreignKey: 'advocateTwoId',
        as: 'Receiver',
      });
    }
  }

  AdvoChatRoom.init({
    advocateOneId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    advocateTwoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'AdvoChatRoom',
  });

  return AdvoChatRoom;
};
