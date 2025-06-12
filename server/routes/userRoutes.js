const express = require('express');
const router = express.Router();
const  userController  = require('../controllers/userController');
const { verifyToken } = require('../middleware/authMiddleware');
console.log('ImHERE');

router.route('/signup')
    .post(userController.signup);

router.route('/login')
    .post(userController.login);

router.use(verifyToken);

router.route('/:id')
    .get(userController.getUserById)
    .put(userController.updateUser)
    .delete(userController.deleteUser);
router.route('/')
    .get(userController.getUsersByParams) 
    .all(userController.getAllUsers);

module.exports = router;