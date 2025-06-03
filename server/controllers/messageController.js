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
    }
    
};

module.exports = messageController;