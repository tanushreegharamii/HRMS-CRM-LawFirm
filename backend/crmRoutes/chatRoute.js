// chat route
const express = require('express'); const router = express.Router(); 
const upload = require('../middlewares/crmCloudinary'); // your existing config 
const { initiateChat, sendMessage, getMessages, getChatRoomsForClient, getChatRoomsForAdvocate, initiateAdvoToAdvoChat } = require('../crmControllers/chatController');
const { verifyToken } = require('../middlewares/generateToken');
const { createOrGetAdvocateChatRoom } = require('../crmControllers/advocateController');

const messageUpload = upload.fields([ { name: 'attachments', maxCount: 15 } ]);

//  Routes  for advocate to client and client to advocate only
router.post('/initiate', verifyToken, initiateChat); 
router.post('/:chatRoomId/message', verifyToken, messageUpload, sendMessage); // supports file 
router.get('/:chatRoomId/getmessage', verifyToken, getMessages);

// get Chat RoomsFor Client
router.get('/client-inbox', verifyToken, getChatRoomsForClient);

// get Chat RoomsFor Client
router.get('/advocate-inbox', verifyToken, getChatRoomsForAdvocate);


//advocate to advocate chat only
//  Create or get chatroom between two advocates
router.get('/advocate-chat/:advocateId', verifyToken, initiateAdvoToAdvoChat);

module.exports = router;