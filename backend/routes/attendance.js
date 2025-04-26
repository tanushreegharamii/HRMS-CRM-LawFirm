// routes/attendanceRoute.js
const express = require('express');
const router = express.Router();
const {markAttendance, getAllAttendance} = require('../controllers/attendanceController');
const {verifyToken, isAdmin } = require('../middlewares/generateToken');
// Employee marks their attendance
router.post('/mark', verifyToken, markAttendance);
router.get('/records', verifyToken, isAdmin, getAllAttendance)
module.exports = router;
