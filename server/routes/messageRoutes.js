const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { verifyToken } = require('../middleware/authMiddleware');

router.use(verifyToken);

router.route('/:id')
    .get(messageController.getMessageById)
    .put(messageController.updateMessage)
    .delete(messageController.deleteMessage);

router.route('/')
    .get(messageController.getMessagesByUserId)
    .post(messageController.createMessage)
    .all(messageController.getAllMessages);

module.exports = router;