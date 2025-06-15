const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/upload'); // הוספת multer

console.log('ImHERE');

// הרשמה עם תמונת פרופיל
router.route('/signup')
    .post(upload.single('profileImage'), userController.signup);

router.route('/login')
    .post(userController.login);

// שאר הפעולות דורשות התחברות
router.use(verifyToken);

router.route('/:id')
    .get(userController.getUserById)
    .put(userController.updateUser)
    .delete(userController.deleteUser);

router.route('/')
    .get(userController.getUsersByParams)
    .all(userController.getAllUsers);

module.exports = router;
