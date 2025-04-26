//crm admin route

const express = require('express'); 
const router = express.Router(); 
const upload = require('../middlewares/crmCloudinary'); // supports single file 
const { registerAdvocate, updateAdvocateProfile, createOfflineCase, getAllAdvocates, getClientsForAdvocate, getAllClients, getOwnProfile, updateOwnProfile } = require('../crmControllers/advocateController');
const { registerOfflineClient } = require('../crmControllers/registerController');
const { verifyToken } = require('../middlewares/generateToken');
const { updateOfflineCase, getAllCases } = require('../crmControllers/caseController');

// register by advocate
router.post('/register', upload.single('profileImage'), registerAdvocate);
// update profile by advocate 
router.put('/update/:id', upload.single('profileImage'), updateAdvocateProfile);

// register offline client by advocate or admin 

const multiUpload = upload.fields([
  { name: 'aadhaar', maxCount: 1 },          // ✅ match with React
  { name: 'documents', maxCount: 10 }        // ✅ match with React
]);


router.post('/create-offline-clients', verifyToken, multiUpload, createOfflineCase); // ✅ must use multiUpload

router.get('/get-all-advocates', verifyToken, getAllAdvocates);
router.get('/all-client', verifyToken, getAllClients)
router.get('/own-client', verifyToken, getClientsForAdvocate)

//get all case of client by admin from case controller
router.get('/', getAllCases);
//modify case by advocate
router.put( "/update-case/:id", verifyToken, upload.fields([{ name: "documents", maxCount: 10 }]), updateOfflineCase );


module.exports = router;