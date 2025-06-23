const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken } = require('../middleware/authMiddleware');
//const { upload } = require('../middleware/upload'); // הוספת multer
const { createUploadMiddleware } = require('../middleware/upload');

const upload = createUploadMiddleware('profileImages');

router.route('/signup')
    .post(upload.single('profileImage'), userController.signup);

router.route('/login')
    .post(userController.login);

router.use(verifyToken);

router.route('/:id')
    .get(userController.getUserById)
    .put(upload.single('profileImage'), userController.updateUser) 
    .delete(userController.deleteUser);

router.route('/')
    .get(userController.getUsersByParams)
    .all(userController.getAllUsers); 

module.exports = router;
