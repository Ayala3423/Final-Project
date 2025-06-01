// bl/messageBL.js

const genericService = require('../dal/genericService');

const messageBL = {

    async getMessageById(id) {
        if (!id) return null;
        return await genericService.getById(id);
    },

    async createMessage(data) {
        // אפשר להוסיף ולידציה פשוטה פה לפי הצורך
        return await genericService.create(data);
    },

    async getAllMessages() {
        return await genericService.getAll();
    }
};

module.exports = messageBL;
