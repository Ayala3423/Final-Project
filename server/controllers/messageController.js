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
    }, 
    async getMessagesByUserId(req, res) {
        try {
            const userId = req.user.id; // Assuming user ID is stored in req.user
            const messages = await messageBL.getMessagesByUserId(userId);
            res.status(200).json(messages);
        } catch (error) {
            console.error('Error fetching user messages:', error);
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
    }
    
};

module.exports = messageController;