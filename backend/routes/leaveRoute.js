// routes/leaveRoute.js
const express = require('express');
const router = express.Router();
const { applyLeave, updateLeaveRequestStatus, getAllLeaveRequests} = require('../controllers/leaveController');
const {verifyToken, isAdmin } = require('../middlewares/generateToken');

// Employee applies for leave
router.post('/request', verifyToken, applyLeave);

// admin sees who ever requested leave
router.get('/leave-request', verifyToken, isAdmin, getAllLeaveRequests)


// Admin updates leave request status (approve or deny)
router.put('/action/:id', verifyToken, isAdmin, updateLeaveRequestStatus);
module.exports = router;