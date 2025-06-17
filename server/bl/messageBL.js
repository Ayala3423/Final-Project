const genericService = require('../services/genericService');
const { log } =  require("../utils/logger.js");

const messageBL = {
    async getMessageById(id) {
        if (!id) {
            log('getMessageById: No ID provided');
            return null;
        }
        log(`getMessageById: Fetching message with id=${id}`);
        return await genericService.getById('message', id);
    },

    async createMessage(data) {
        log(`createMessage: Creating message with data=${JSON.stringify(data)}`);
        return await genericService.create('message', data);
    },

    async getAllMessages() {
        log('getAllMessages: Fetching all messages');
        return await genericService.getAll('message');
    },

    async getMessagesById(senderId) {
        if (!senderId) {
            log('getMessagesById: No senderId provided');
            return [];
        }
        log(`getMessagesById: Fetching messages for senderId=${senderId}`);
        return await genericService.getByParams('message', { senderId });
    },

    async deleteMessage(id) {
        if (!id) {
            log('deleteMessage: No ID provided');
            return null;
        }
        log(`deleteMessage: Deleting message with id=${id}`);
        return await genericService.delete('message', id);
    },

    async updateMessage(id, data) {
        if (!id || !data) {
            log(`updateMessage: Missing id or data (id=${id})`);
            return null;
        }
        log(`updateMessage: Updating message id=${id} with data=${JSON.stringify(data)}`);
        return await genericService.update('message', id, data);
    },

    async getMessagesByConversationId(conversationId) {
        if (!conversationId) {
            log('getMessagesByConversationId: No conversationId provided');
            return [];
        }
        log(`getMessagesByConversationId: Fetching messages for conversationId=${conversationId}`);
        return await genericService.getByParams('message', { conversationId });
    },

    async setReadMessages(messageIds, field) {
        if (!messageIds || !field) {
            log('setReadMessages: Missing messageIds or field');
            return null;
        }
        log(`setReadMessages: Updating messages ${messageIds} with field ${JSON.stringify(field)}`);
        return await genericService.update('message', messageIds, field);
    }
};

module.exports = messageBL;