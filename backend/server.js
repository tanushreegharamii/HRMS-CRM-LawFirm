// server.js
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const multer = require('multer'); // 🛠️ Missing import for multer error handling
dotenv.config();

const { Message } = require('./model');

const app = express();
const http = require('http');
const server = http.createServer(app);

// 🔌 SOCKET.IO CONFIG
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Middlewares
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Test route
app.get('/get', (req, res) => {
  res.send('yes from server');
});

// Routes
app.use('/api/auth', require('./routes/authRoute'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/payroll', require('./routes/parollRoute'));
app.use('/api/leave', require('./routes/leaveRoute'));
app.use('/api/promotions', require('./routes/promotionRoute'));
app.use('/api/client-register', require('./crmRoutes/registerRoute'));
app.use('/api/client', require('./crmRoutes/clientRoute'));
app.use('/api/advocate', require('./crmRoutes/advocateRoute'));
app.use('/api/chat', require('./crmRoutes/chatRoute'));
app.use('/api/getcase', require('./crmRoutes/getCaseRoutes'));
app.use('/api/create-case-by-client', require('./crmRoutes/clientCreateCase'));
app.use('/api/hr-actions', require('./routes/hrAction'));
// app.use('/api/advochat', require('./crmRoutes/advoChatRoute'));  // comment if not ready
app.use('/api/crm-admin', require('./crmRoutes/crmAdminRoute'));

// Error Handler should be BEFORE server starts
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large. Max 1MB allowed.' });
    }
    return res.status(400).json({ message: err.message });
  }

  if (err.code === 'INVALID_FILE_TYPE') {
    return res.status(400).json({ message: 'Only JPG, PNG, and PDF files are allowed.' });
  }

  console.error("❌ Unknown server error:", err);
  res.status(500).json({ message: 'Something went wrong. Please try again later.' });
});

// Socket.IO logic
io.on('connection', (socket) => {
  console.log('🟢 Connected:', socket.id);

  socket.on('join_room', (chatRoomId) => {
    socket.join(chatRoomId);
    console.log(`🛏️ ${socket.id} joined room ${chatRoomId}`);
  });

  socket.on('send_message', async (data) => {
    try {
      const newMsg = await Message.create({
        chatRoomId: data.chatRoomId,
        senderId: data.senderId,
        senderRole: data.senderRole,
        messageText: data.messageText,
        attachments: data.attachments || [],
      });

      io.to(data.chatRoomId).emit('receive_message', newMsg);
    } catch (err) {
      console.error('❌ Error saving message:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('🔴 Disconnected:', socket.id);
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server (with socket.io) running on port ${PORT}`);
});
