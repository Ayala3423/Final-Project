const genericService = require('../services/genericService');

const messageBL = {

    async getMessageById(id) {
        if (!id) return null;
        return await genericService.getById(id);
    },

    async createMessage(data) {
        return await genericService.create(data);
    },

    async getAllMessages() {
        return await genericService.getAll();
    },

    async getMessagesByUserId(userId) {
        if (!userId) return [];
        return await genericService.getByValue('message', { userId });
    },
    
    async deleteMessage(id) {
        if (!id) return null;
        return await genericService.delete(id);
    },

    async updateMessage(id, data) {
        if (!id || !data) return null;
        return await genericService.update(id, data);
    },
};

module.exports = messageBL;
