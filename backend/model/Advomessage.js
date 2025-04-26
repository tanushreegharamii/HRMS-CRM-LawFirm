'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class AdvoMessage extends Model {
    static associate(models) {
      AdvoMessage.belongsTo(models.AdvoChatRoom, {
        foreignKey: 'advoChatRoomId',
        as: 'chatRoom',
      });

      // Sender is always an advocate
      AdvoMessage.belongsTo(models.Advocate, {
        foreignKey: 'senderId',
        as: 'sender',
      });
    }
  }

  AdvoMessage.init({
    advoChatRoomId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    messageText: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    attachments: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'AdvoMessage',
  });

  return AdvoMessage;
};
