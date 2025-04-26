// routes/authRoute.js
const express = require('express');
const router = express.Router();

const { generateToken } = require('../middlewares/generateToken');
const { registerClient } = require('../crmControllers/registerController');
const { getCurrentUser } = require('../controllers/authController');

// Login route (admin and employee)
router.post('/register', registerClient);

module.exports = router;
