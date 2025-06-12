const genericService = require('../services/genericService');

const messageBL = {

    async getMessageById(id) {
        if (!id) return null;
        return await genericService.getById('message', id);
    },

    async createMessage(data) {
        
        return await genericService.create('message', data);
    },

    async getAllMessages() {
        return await genericService.getAll('message', );
    },

    async getMessagesById(senderId) {
        if (!senderId) return [];
        return await genericService.getByParams('message', { senderId });
    },
    
    async deleteMessage(id) {
        if (!id) return null;
        return await genericService.delete('message', id);
    },

    async updateMessage(id, data) {
        if (!id || !data) return null;
        return await genericService.update('message', id, data);
    },

    async getMessagesByConversationId(conversationId) {
        if (!conversationId) return [];
        return await genericService.getByParams('message', { conversationId });
    }
};

module.exports = messageBL;
