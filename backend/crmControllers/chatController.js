// chatcontroller

const { ChatRoom, Message, Advocate, Client } = require('../model');

module.exports = { //  1. Initiate Chat Room (or find existing one) initiateChat: async (req, res) => { try { const { clientId, advocateId } = req.body;

    initiateChat: async (req, res) => {
        try {
            const advocateId = req.body.advocateId;
            const clientId = req.user.id; // ✅ Extracted from cookie token

            if (!clientId || !advocateId) {
                return res.status(400).json({ message: 'clientId and advocateId are required' });
            }

            let chatRoom = await ChatRoom.findOne({ where: { clientId, advocateId } });

            if (!chatRoom) {
                chatRoom = await ChatRoom.create({ clientId, advocateId });
            }

            res.status(200).json({ message: 'Chat room ready', data: chatRoom });
        } catch (error) {
            console.error('🔥 initiateChat error:', error);
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }
    ,
    // ✅ 2. Send message sendMessage
    sendMessage: async (req, res) => {
        try {
            const { chatRoomId } = req.params;
            const senderId = req.user.id;        // ✅ from cookie/JWT
            const senderRole = req.user.role;    // ✅ from cookie/JWT
            const { messageText } = req.body;

            if (!chatRoomId || !senderId || !senderRole) {
                return res.status(400).json({ message: 'Required fields missing' });
            }

            let attachments = [];

            if (req.files?.attachments?.length > 0) {
                attachments = req.files.attachments.map(file => ({
                    url: file.path,
                    uploadedAt: new Date()
                }));
            }

            const newMessage = await Message.create({
                chatRoomId,
                senderId,
                senderRole,
                messageText,
                attachments
            });

            // ✅ Update ChatRoom's updatedAt manually
            await ChatRoom.update(
                { updatedAt: new Date() },
                { where: { id: chatRoomId } }
            );

            res.status(201).json({ message: 'Message sent with files', data: newMessage });

        } catch (error) {
            console.error('🔥 sendMessage error:', error);
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }
    ,

    // ✅ 3. Get all messages from a chat room
    // chatController.js


    getMessages: async (req, res) => {
        try {
          const { chatRoomId } = req.params;
      
          const chatRoom = await ChatRoom.findOne({
            where: { id: chatRoomId },
            include: [
              { model: Client, as: 'Client' }  // ✅ Fetch client info (not advocate)
            ]
          });
      
          const messages = await Message.findAll({
            where: { chatRoomId },
            order: [['createdAt', 'ASC']]
          });
      
          if (!chatRoom) {
            return res.status(404).json({ message: "Chat room not found" });
          }
      
          res.status(200).json({
            messages,
            client: chatRoom.Client  // ✅ Sending client info correctly
          });
      
        } catch (error) {
          console.error('🔥 getMessages error:', error);
          res.status(500).json({ message: 'Server error', error: error.message });
        }
      }
      
      
    ,
    // ✅ Get all chatrooms for a client 
    getChatRoomsForClient: async (req, res) => {
        try {
            const clientId = req.user.id; // ✅ from verified token
            const rooms = await ChatRoom.findAll({
                where: { clientId: req.user.id },
                include: [{ model: Advocate, as: 'Advocate' }],
                order: [['updatedAt', 'DESC']]
            });


            res.status(200).json({ data: rooms });
        } catch (error) {
            console.error('❌ Get chat rooms for client error:', error);
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },


    // ✅ Get all chatrooms for an advocate
    // ✅ Controller: Get all chatrooms for logged-in advocate
    getChatRoomsForAdvocate: async (req, res) => {
        try {
            const advocateId = req.user.id;

            const rooms = await ChatRoom.findAll({
                where: { advocateId },
                include: [{ model: Client, as: 'Client' }],
                order: [['updatedAt', 'DESC']]
            });

            res.status(200).json({ data: rooms });
        } catch (error) {
            console.error('❌ Get chat rooms for advocate error:', error);
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },



    //  We reusing the same ChatRoom table with clientId and advocateId fields, and 
    //  just treat one advocate as a 'client' for advocate-to-advocate chat.”
    //   100% doable. Let’s treat one of the advocates as clientId and the other as advocateId when 
    //  creating the chatroom. That way, your existing schema and logic will work!

    initiateAdvoToAdvoChat: async (req, res) => {
        try {
            const currentAdvocateId = req.user.id;             // Logged-in advocate
            const targetAdvocateId = req.params.advocateId;     // Advocate to chat with

            if (!currentAdvocateId || !targetAdvocateId) {
                return res.status(400).json({ message: "Advocate IDs required" });
            }

            if (currentAdvocateId == targetAdvocateId) {
                return res.status(400).json({ message: "Cannot chat with yourself" });
            }

            // ✅ We'll store currentAdvocate as clientId and target as advocateId
            let chatRoom = await ChatRoom.findOne({
                where: {
                    clientId: currentAdvocateId,
                    advocateId: targetAdvocateId,
                }
            });

            if (!chatRoom) {
                chatRoom = await ChatRoom.create({
                    clientId: currentAdvocateId,
                    advocateId: targetAdvocateId
                });
            }

            res.status(200).json({ message: "Chat room ready", data: chatRoom });

        } catch (error) {
            console.error("❌ initiateAdvoToAdvoChat error:", error);
            res.status(500).json({ message: "Server error", error: error.message });
        }
    },






}

