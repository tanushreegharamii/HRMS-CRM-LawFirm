const express = require('express');
const router = express.Router();
const upload = require('../middlewares/crmCloudinary'); // ✅ your Cloudinary-based multer

const {
  createCase,
  getAllCases,
  updateCase,
  updateCaseFiles,
  deleteCase,
  getCasesByClientId,
  getOwnProfile,
  updateOwnProfile
} = require('../crmControllers/clientController');
const { verifyToken } = require('../middlewares/generateToken');
const { getAllAdvocates } = require('../crmControllers/advocateController');

// ✅ File Upload Fields
const multiUpload = upload.fields([
  { name: 'aadhaar', maxCount: 1 },
  { name: 'documents', maxCount: 10 }
]);

// ✅ ROUTES

// Create a new case (with files)
router.post('/create', verifyToken, multiUpload, createCase);

// Get all cases (admin or future client filtering)
router.get('/', getAllCases);

router.get('/own-profile', verifyToken, getOwnProfile);

router.put(
  '/update-profile',
  verifyToken,
  upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'aadhaar', maxCount: 1 },
  ]),
  updateOwnProfile
);



// useless
router.get('/get/:id', verifyToken, getCasesByClientId);

// Update case info (text fields only)
router.put('/update/:id', verifyToken, updateCase);

// Update case files (aadhaar / documents)
router.put('/update-files/:id', verifyToken, multiUpload, updateCaseFiles);

// Delete a case
router.delete('/delete/:id', verifyToken, deleteCase);

router.get('/get-advocates', getAllAdvocates);

module.exports = router;
