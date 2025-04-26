const express = require('express');
const router = express.Router();
const {
  createClientCaseByClient,
  getAllClientCasesByClient,
  updateClientCaseByClient,
  deleteClientCaseByClient
} = require('../crmControllers/clientCreateCase');
const { verifyToken } = require('../middlewares/generateToken');
const upload = require('../middlewares/crmCloudinary'); // multer config

router.post('/client/cases', verifyToken, upload.fields([
  { name: 'aadhaar', maxCount: 1 },
  { name: 'documents', maxCount: 10 }
]), createClientCaseByClient);

router.get('/client/cases', verifyToken, getAllClientCasesByClient);

router.put('/client/cases/:id', verifyToken, upload.fields([
  { name: 'aadhaar', maxCount: 1 },
  { name: 'documents', maxCount: 10 }
]), updateClientCaseByClient);

router.delete('/client/cases/:id', verifyToken, deleteClientCaseByClient);

module.exports = router;
