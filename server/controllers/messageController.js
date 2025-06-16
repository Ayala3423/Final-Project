const messageBL = require('../bl/messageBL');

const messageController = {

    async getMessageById(req, res) {
        try {
            const message = await messageBL.getMessageById(req.params.id);
            if (!message) {
                return res.status(404).json({ message: 'Message not found' });
            }
            res.status(200).json(message);
        } catch (error) {
            console.error('Error fetching message:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    async createMessage(req, res) {
        try {
            console.log('Creating message with data:', req.body);

            const newMessage = await messageBL.createMessage(req.body);
            res.status(201).json(newMessage);
        } catch (error) {
            console.error('Error creating message:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    async getAllMessages(req, res) {
        try {
            const messages = await messageBL.getAllMessages();
            res.status(200).json(messages);
        } catch (error) {
            console.error('Error fetching messages:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    async updateMessage(req, res) {
        try {
            const message = await messageBL.getMessageById(req.params.id);
            if (!message) {
                return res.status(404).json({ message: 'Message not found' });
            }
            const updatedMessage = await messageBL.updateMessage(req.params.id, req.body);
            res.status(200).json(updatedMessage);
        } catch (error) {
            console.error('Error updating message:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    async deleteMessage(req, res) {
        try {
            const message = await messageBL.getMessageById(req.params.id);
            if (!message) {
                return res.status(404).json({ message: 'Message not found' });
            }
            await messageBL.deleteMessage(req.params.id);
            res.status(204).send();
        } catch (error) {
            console.error('Error deleting message:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    async getMessagesBySenderId(req, res) {
        try {
            const senderId = req.query.senderId;
            if (!senderId) {
                return res.status(400).json({ message: 'Sender ID is required' });
            }
            const messages = await messageBL.getMessagesById(senderId);
            res.status(200).json(messages);
        } catch (error) {
            console.error('Error fetching messages by sender ID:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    async getMessagesByConversationId(req, res) {
        try {
            const conversationId = req.query.conversationId;
            if (!conversationId) {
                return res.status(400).json({ message: 'Conversation ID is required' });
            }
            const messages = await messageBL.getMessagesByConversationId(conversationId);
            res.status(200).json(messages);
        } catch (error) {
            console.error('Error fetching messages by conversation ID:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    async setReadMessages(req, res) {
        try {
            const { messageIds, field } = req.body;
            if (!messageIds) {
                return res.status(400).json({ message: 'Conversation ID is required' });
            }
            const messages = await messageBL.setReadMessages(messageIds, field);
            res.status(200).json(messages);
        } catch (error) {
            console.error('Error fetching messages by conversation ID:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};

module.exports = messageController;