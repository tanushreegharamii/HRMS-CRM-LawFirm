// routes/payrollRoute.js
const express = require('express');
const router = express.Router();
const {updatePayroll, createPayroll} = require('../controllers/payrollController');
const {verifyToken , isAdmin} = require('../middlewares/generateToken');

//create payroll
router.post('/create', verifyToken, isAdmin, createPayroll);

// Admin updates employee payroll
router.post('/update', verifyToken, isAdmin, updatePayroll);



module.exports = router;
