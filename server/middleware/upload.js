// middlewares/upload.js
import multer from 'multer';
import path from 'path';

// הגדרה לאחסון התמונות בתיקייה מקומית (אפשר להחליף ל־Cloudinary בעתיד)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/profileImages'); // ודאי שתיקייה זו קיימת
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// קבלה רק של קבצי תמונה
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) cb(null, true);
  else cb(new Error('רק קבצי תמונה מותרים'));
};

export const upload = multer({ storage, fileFilter });
