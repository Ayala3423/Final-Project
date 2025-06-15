const multer = require('multer');
const path = require('path');
const fs = require('fs');

// תיקיית יעד להעלאת תמונות פרופיל
const uploadDir = path.join(__dirname, '../uploads');

// ודא שהתיקייה קיימת
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// הגדרת אחסון הקובץ
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // נשמר בתוך /uploads/profileImages
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// קבלת קבצים מסוג תמונה בלבד
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('רק קבצי תמונה מותרים'));
  }
};

// יצוא ה־middleware
const upload = multer({ storage, fileFilter });

module.exports = { upload };
