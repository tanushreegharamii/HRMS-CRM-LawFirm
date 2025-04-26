const express = require('express');
const router = express.Router();
const promotionController = require('../controllers/promotionController');
const { verifyToken, isAdmin } = require('../middlewares/generateToken');

//promote employee 
router.post('/', promotionController.promoteEmployee);
// get all promotions
router.get('/get',verifyToken, isAdmin, promotionController.getAllPromotions);

module.exports = router;
