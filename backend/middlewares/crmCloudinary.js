const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    let folder = 'crm_uploads';

    if (file.fieldname === 'aadhaarCard') {
      folder = 'crm_aadhaar_docs';
    } else if (file.fieldname === 'profileImage') {
      folder = 'crm_profile_images';
    } else if (file.fieldname === 'caseDocuments') {
      folder = 'crm_case_documents';
    }

    return {
      folder,
      resource_type: file.mimetype === 'application/pdf' ? 'raw' : 'image',
      public_id: `${Date.now()}-${file.originalname.split('.')[0]}`
    };
  }
});


const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      const error = new Error("Only JPG, PNG, and PDF files are allowed.");
      error.code = "INVALID_FILE_TYPE"; // important
      cb(error, false);
    }
  },  
});



const handleMulterError = (field) => {
  return (req, res, next) => {
    const uploader = upload.single(field);

    uploader(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: "File too large. Max 1MB allowed." });
      } else if (err) {
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  };
};

module.exports = upload;
// module.exports = handleMulterError;