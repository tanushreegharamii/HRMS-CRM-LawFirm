// advocateChatController

const { AdvoChatRoom, AdvoMessage, Advocate } = require('../model');
const Sequelize = require("sequelize");

module.exports = {

    initiateAdvoChat : async (req, res) => {
        const senderId = req.user.id;
        const receiverId = req.params.receiverId;
      
        if (senderId === receiverId) {
          return res.status(400).json({ message: "Cannot chat with yourself" });
        }
      
        let room = await AdvoChatRoom.findOne({
          where: {
            [Sequelize.Op.or]: [
              { advocateOneId: senderId, advocateTwoId: receiverId },
              { advocateOneId: receiverId, advocateTwoId: senderId },
            ],
          },
        });
      
        if (!room) {
          room = await AdvoChatRoom.create({
            advocateOneId: senderId,
            advocateTwoId: receiverId,
          });
        }
      
        res.status(200).json({ message: 'Room ready', data: room });
      }

    ,

    sendAdvoMessage: async (req, res) => {
        try {
          const { advoChatRoomId } = req.params;
          const senderId = req.user.id;
          const { messageText, attachments } = req.body;
      
          const room = await AdvoChatRoom.findOne({ where: { id: advoChatRoomId } });
      
          if (!room || (room.advocateOneId !== senderId && room.advocateTwoId !== senderId)) {
            return res.status(403).json({ message: "Access denied to send message." });
          }
      
          const newMessage = await AdvoMessage.create({
            advoChatRoomId,
            senderId,
            messageText,
            attachments: attachments || [],
          });
      
          res.status(201).json({ message: "Message sent", data: newMessage });
        } catch (error) {
          console.error("🔥 sendAdvoMessage error:", error);
          res.status(500).json({ message: "Server error", error: error.message });
        }
      }
      
    ,
  getAdvoMessages: async (req, res) => {
    try {
      const { advoChatRoomId } = req.params;
      const userId = req.user.id;

      // ✅ Ensure the logged-in advocate is part of the room
      const room = await AdvoChatRoom.findOne({
        where: { id: advoChatRoomId },
      });

      if (!room || (room.advocateOneId !== userId && room.advocateTwoId !== userId)) {
        return res.status(403).json({ message: "Access denied to this chatroom." });
      }

      const messages = await AdvoMessage.findAll({
        where: { advoChatRoomId },
        order: [['createdAt', 'ASC']],
        include: [{ model: Advocate, as: 'sender', attributes: ['id', 'name', 'email'] }],
      });

      const otherAdvocateId = room.advocateOneId === userId ? room.advocateTwoId : room.advocateOneId;
      const otherAdvocate = await Advocate.findByPk(otherAdvocateId);

      res.status(200).json({
        messages,
        targetAdvocate: otherAdvocate,
      });
    } catch (error) {
      console.error("🔥 getAdvoMessages error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
};





 
  