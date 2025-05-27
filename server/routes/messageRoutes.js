const express = require('express');
const router = express.Router();
const { messageController } = require('../controllers/messageController');
const { verifyToken } = require('../middleware/authMiddleware');

router.use(verifyToken);

router.route('/:id')
    .get(messageController.getMessageById)
    .put(messageController.updateMessage)
    .delete(messageController.deleteMessage);

router.route('/')
    .all(messageController.getAllMessages)
    .post(messageController.createMessage);

module.exports = router;