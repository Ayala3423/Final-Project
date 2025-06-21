const multer = require('multer');
const path = require('path');
const fs = require('fs');

function createUploadMiddleware(folderName) {
  const uploadDir = path.join(__dirname, `../uploads/${folderName}`);

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
  });

  const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('רק קבצי תמונה מותרים'));
    }
  };

  return multer({ storage, fileFilter });
}

module.exports = { createUploadMiddleware };
