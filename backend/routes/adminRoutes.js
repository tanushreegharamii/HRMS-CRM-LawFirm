// routes/adminRoute.js
const express = require('express');
const router = express.Router();
const  {registerEmployee, getAllEmployees, getEmployeeProfile,  promoteEmployee, terminateEmployee, updateEmployee, transferEmployee, getAllTerminatedEmployees} = require('../controllers/adminController');
const {verifyToken , isAdmin} = require('../middlewares/generateToken');
const upload = require('../middlewares/cloudinaryUpload')
// Admin-only routes
// router.post('/register-employee', registerEmployee);


router.post('/register-employee', upload.fields([{ name: 'aadhaar_image', maxCount: 1 },{ name: 'profile_photo', maxCount: 1 }]),registerEmployee);
router.get('/all-employees', verifyToken, isAdmin, getAllEmployees);
router.get('/employee-profile/:id', verifyToken, isAdmin, getEmployeeProfile);

router.post('/terminate/:employeeId', verifyToken, isAdmin, terminateEmployee);
router.get('/terminated-employees', verifyToken, isAdmin, getAllTerminatedEmployees);

router.put('/promote/:id', verifyToken, isAdmin, promoteEmployee);
router.put('/transfer', transferEmployee);

// update employee
// router.put('/update/:id', verifyToken, isAdmin, updateEmployee);
router.put('/update-employee/:id',verifyToken,isAdmin,upload.fields([{ name: 'profile_photo', maxCount: 1 },{ name: 'aadhaar_image', maxCount: 1 }]),updateEmployee);
  
module.exports = router;