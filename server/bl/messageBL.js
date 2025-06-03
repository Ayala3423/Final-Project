const genericService = require('../dal/genericService');

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
    }
};

module.exports = messageBL;
