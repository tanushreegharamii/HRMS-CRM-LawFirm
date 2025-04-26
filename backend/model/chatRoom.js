'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ChatRoom extends Model {
    static associate(models) {
      // 💬 One chatroom has many messages
      ChatRoom.hasMany(models.Message, { foreignKey: 'chatRoomId' });

      // ✅ Standard associations for client ↔ advocate chat
      ChatRoom.belongsTo(models.Client, {
        foreignKey: 'clientId',
        as: 'Client'
      });

      ChatRoom.belongsTo(models.Advocate, {
        foreignKey: 'advocateId',
        as: 'Advocate'
      });

      // ✅ NEW: Advocate-to-Advocate support (current advocate is clientId)
      ChatRoom.belongsTo(models.Advocate, {
        foreignKey: 'clientId',
        as: 'ClientAsAdvocate'
      });
    }
  }

  ChatRoom.init(
    {
      clientId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      advocateId: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'ChatRoom'
    }
  );

  return ChatRoom;
};
