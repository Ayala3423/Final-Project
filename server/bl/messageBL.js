const genericService = require('../services/genericService');
const { log } = require("../utils/logger.js");
const { redisClient, getOrSetCache } = require('../utils/utils');

const messageBL = {
    async getMessageById(id) {
        if (!id) {
            log('getMessageById: No ID provided');
            return null;
        }

        const cacheKey = `message:${id}`;
        return await getOrSetCache(cacheKey, 300, async () => {
            log(`getMessageById: Fetching message with id=${id}`);
            return await genericService.getById('message', id);
        });
    },

    async createMessage(data) {
        log(`createMessage: Creating message with data=${JSON.stringify(data)}`);
        const newMessage = await genericService.create('message', data);

        // מחיקת Cache של השיחה הרלוונטית
        await redisClient.del(`conversation:${data.conversationId}`);
        await redisClient.del(`conversations:${data.senderId}`);
        await redisClient.del(`unread:${data.receiverId}`);

        return newMessage;
    },

    async getAllMessages() {
        const cacheKey = `messages:all`;
        return await getOrSetCache(cacheKey, 300, async () => {
            log('getAllMessages: Fetching all messages');
            return await genericService.getAll('message');
        });
    },

 async getConversationsById(userId) {
    if (!userId) {
        log('getMessagesById: No senderId provided');
        return [];
    }

    const cacheKey = `conversations:${userId}`;
    return await getOrSetCache(cacheKey, 300, async () => {
        log(`getMessagesById: Fetching messages for senderId=${userId}`);
        
        const conversations = await genericService.getUserConversations(userId);
        console.log(`getMessagesById: Fetched ${conversations.length} conversations for senderId=${userId}`);
        console.log(`getMessagesById: Fetched conversations: ${JSON.stringify(conversations)}`);

        for (const convo of conversations) {
            const partnerId = convo.senderId === userId ? convo.receiverId : convo.senderId;
            console.log(`getMessagesById: Fetching partner info for partnerId=${partnerId}`);
            try {
                const partner = await genericService.getUserById(partnerId);
                convo.partnerName = partner?.name || 'Unknown';
                console.log(`getMessagesById: Partner info for ID=${partnerId} is ${convo.partnerName}`);
            } catch (err) {
                console.error(`Failed to fetch partner info for ID=${partnerId}`, err);
                convo.partnerName = 'Unknown';
            }
        }

        return conversations;
    });
}

,
    async deleteMessage(id) {
        if (!id) {
            log('deleteMessage: No ID provided');
            return null;
        }

        const message = await genericService.getById('message', id);

        log(`deleteMessage: Deleting message with id=${id}`);
        const result = await genericService.delete('message', id);

        // מחיקת Cache של ההודעה והשיחה שלה
        await redisClient.del(`message:${id}`);
        if (message) {
            await redisClient.del(`conversation:${message.conversationId}`);
            await redisClient.del(`conversations:${message.senderId}`);
            await redisClient.del(`unread:${message.receiverId}`);
        }

        return result;
    },

    async updateMessage(id, data) {
        if (!id || !data) {
            log(`updateMessage: Missing id or data (id=${id})`);
            return null;
        }

        log(`updateMessage: Updating message id=${id} with data=${JSON.stringify(data)}`);
        const updatedMessage = await genericService.update('message', id, data);

        await redisClient.del(`message:${id}`);
        if (data.conversationId) {
            await redisClient.del(`conversation:${data.conversationId}`);
        }

        return updatedMessage;
    },

    async getMessagesByConversationId(conversationId) {
        if (!conversationId) {
            log('getMessagesByConversationId: No conversationId provided');
            return [];
        }

        const cacheKey = `conversation:${conversationId}`;
        return await getOrSetCache(cacheKey, 300, async () => {
            log(`getMessagesByConversationId: Fetching messages for conversationId=${conversationId}`);
            return await genericService.getByParams('message', { conversationId });
        });
    },

    async setReadMessages(messageIds, field) {
        if (!messageIds || !field) {
            log('setReadMessages: Missing messageIds or field');
            return null;
        }

        log(`setReadMessages: Updating messages ${messageIds} with field ${JSON.stringify(field)}`);
        const updatedMessages = await genericService.update('message', messageIds, field);

        for (const id of messageIds) {
            await redisClient.del(`message:${id}`);
        }

        return updatedMessages;
    },

    async getUnReadMessages(userId) {
        if (!userId) {
            log('getUnReadMessages: No userId provided');
            return [];
        }

        const cacheKey = `unread:${userId}`;
        return await getOrSetCache(cacheKey, 120, async () => {
            log(`getUnReadMessages: Fetching unread messages for userId=${userId}`);
            return await genericService.getByParams('message', { receiverId: userId, isRead: false });
        });
    }
};

module.exports = messageBL;