const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const folder = file.fieldname === 'aadhaar_image' ? 'aadhaar_docs' : 'profile_photo';
    return {
      folder,
      resource_type: file.mimetype === 'application/pdf' ? 'raw' : 'image',
      public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
    };
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 1 * 1024 * 1024, // 1 MB max
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPG, PNG, and PDF files are allowed'), false);
    }
  }
});

module.exports = upload;
