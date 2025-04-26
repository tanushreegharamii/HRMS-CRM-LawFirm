// routes/authRoute.js
const express = require('express');
const router = express.Router();
const {login, getCurrentUser, logout} = require('../controllers/authController');
const { generateToken, verifyToken } = require('../middlewares/generateToken');

// Login route (admin and employee)
router.post('/login', login);
router.get('/me', getCurrentUser);

router.get('/logout', logout); 
module.exports = router;

