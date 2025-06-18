const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { verifyToken } = require('../middleware/authMiddleware');
const { ro } = require('@faker-js/faker');

router.use(verifyToken);

router.route('/unRead')
    .get(messageController.getUnReadMessages);

router.route('/conversation')
    .get(messageController.getMessagesByConversationId)
    .put(messageController.setReadMessages);

router.route('/:id')
    .get(messageController.getMessageById)
    .put(messageController.updateMessage)
    .delete(messageController.deleteMessage);

router.route('/')
    .get(messageController.getUserCoversations)
    .post(messageController.createMessage)
    .all(messageController.getAllMessages);

module.exports = router;