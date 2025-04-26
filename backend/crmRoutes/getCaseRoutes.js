// advocate only case route

const express = require('express');
const router = express.Router();
const {
  getAllCases,
  getRunningCases,
  getDisposedCases,
  getCaseById
} = require('../crmControllers/caseController');
const { verifyToken } = require('../middlewares/generateToken');

router.get('/cases/all', verifyToken, getAllCases);

router.get('/cases/running',verifyToken, getRunningCases);
router.get('/cases/disposed',verifyToken, getDisposedCases);
 // keep this LAST
router.get('/cases/:id', verifyToken, getCaseById); 

module.exports = router;
