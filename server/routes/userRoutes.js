const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken } = require('../middleware/authMiddleware');
//const { upload } = require('../middleware/upload'); // הוספת multer
const { createUploadMiddleware } = require('../middleware/upload');

console.log('ImHERE');
const upload = createUploadMiddleware('profileImages');

// הרשמה עם תמונת פרופיל
router.route('/signup')
    .post(upload.single('profileImage'), userController.signup);

// התחברות
router.route('/login')
    .post(userController.login);

// שאר הפעולות דורשות התחברות
router.use(verifyToken);



// עדכון משתמש עם אפשרות להעלות תמונה
router.route('/:id')
    .get(userController.getUserById)
    .put(upload.single('profileImage'), userController.updateUser) // כאן התמיכה ב-FormData
    .delete(userController.deleteUser);

// חיפוש משתמשים לפי פרמטרים / כולם
router.route('/')
    .get(userController.getUsersByParams)
    .all(userController.getAllUsers); // אולי כדאי לבדוק אם all נחוץ

module.exports = router;
