const { Op } = require('sequelize');
const db = require('../models');
const { User } = require('../models');
const { Message } = require('../models');
const { v4: uuidv4 } = require('uuid');

const genericService = {

    async getById(model, id) {
        const Model = require(`../models/${model}`);
        return await Model.findByPk(id);
    },

    async update(model, id, data) {
        const Model = require(`../models/${model}`);

        if (Array.isArray(id)) {
            const result = await Model.update(data, { where: { id } });
            return result;
        } else {
            const instance = await Model.findByPk(id);
            if (!instance) return null;
            return await instance.update(data);
        }
    },

    async delete(model, id) {
        const Model = require(`../models/${model}`);
        return await Model.destroy({ where: { id } });
    },

    async getByParams(model, params) {
        const Model = require(`../models/${model}`);
        return await Model.findAll({
            where: params,
        });
    },

    async getByParamsLimit(model, params) {
        console.log('getByParamsLimit');

        const Model = require(`../models/${model}`);

        const { page = 1, limit = 10, ...filters } = params;
        const offset = (page - 1) * limit;

        return await Model.findAll({
            where: filters,
            limit: parseInt(limit),
            offset: parseInt(offset)
        });
    },

    async create(model, data) {
        console.log(`Creating new ${model} with data:`, data);

        const Model = require(`../models/${model}`);

        if (Array.isArray(data)) {
            return await Model.bulkCreate(data);
        } else {
            return await Model.create(data);

        }
    },

    async getAdvanced(model, conditions, include = null) {
        const Model = require(`../models/${model}`);
        const options = { where: conditions };
        if (include) {
            const associations = Array.isArray(include)
                ? include.map(name => ({ model: require(`../models/${name}`) }))
                : [{ model: require(`../models/${include}`) }];
            options.include = associations;
        }
        return await Model.findAll(options);
    },

    async getByForeignKey(model, foreignKey, value) {
        const Model = require(`../models/${model}`);
        const where = {};
        where[foreignKey] = value;
        return await Model.findAll({ where });
    },

    async getAll(model) {
        const Model = require(`../models/${model}`);
        return await Model.findAll();
    },

    async purgeSoftDeletes() {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - 30);

        await db.User.destroy({ where: { deletedAt: { [Op.lte]: cutoffDate } }, force: true });
        await db.Parking.destroy({ where: { deletedAt: { [Op.lte]: cutoffDate } }, force: true });
        await db.Message.destroy({ where: { deletedAt: { [Op.lte]: cutoffDate } }, force: true });
        await db.Report.destroy({ where: { deletedAt: { [Op.lte]: cutoffDate } }, force: true });
        await db.Reservation.destroy({ where: { deletedAt: { [Op.lte]: cutoffDate } }, force: true });
        await db.TimeSlot.destroy({ where: { deletedAt: { [Op.lte]: cutoffDate } }, force: true });

        console.log('Purge done');
    },

    async sendAutoNotifications() {
        // 1. מציאת המשתמש מנהל
        const adminUser = await User.findOne({ where: { role: 'admin' } });
        if (!adminUser) {
            console.error('Admin user not found');
            return;
        }

        // 2. מציאת כל המשתמשים שהם לא מנהלים
        const users = await User.findAll({
            where: { role: { [Op.ne]: 'admin' } }
        });

        const messagesToCreate = [];

        // 3. עבור כל משתמש יוצרים לו הודעה עם conversationId ייחודי לו
        for (const user of users) {
            const conversationId = await genericService.getOrCreateConversationId(adminUser.id, user.id);

            messagesToCreate.push({
                senderId: adminUser.id,
                receiverId: user.id,
                content: 'זו הודעה אוטומטית מהמנהל',
                sentAt: new Date(),
                isRead: false,
                conversationId
            });
        }

        // 4. יצירה בבאלק
        await Message.bulkCreate(messagesToCreate);

        console.log(`Sent notification messages to ${users.length} users from admin (id=${adminUser.id})`);
    },

    async getUserConversations(userId) {
        // לוקחים את כל ההודעות שהמשתמש קשור אליהן (כשולח או כמקבל)
        const messages = await Message.findAll({
            where: {
                [Op.or]: [
                    { senderId: userId },
                    { receiverId: userId }
                ]
            },
            order: [['sentAt', 'DESC']]
        });

        return messages;
    },

    async getOrCreateConversationId(senderId, receiverId) {
        const existingMessage = await Message.findOne({
            where: {
                [Op.or]: [
                    { senderId, receiverId },
                    { senderId: receiverId, receiverId: senderId }
                ]
            }
        });

        if (existingMessage) {
            return existingMessage.conversationId;
        } else {
            return uuidv4(); // מחזיר conversationId חדש
        }
    },

    async getReservationsFullByValue(value) {
        let { page = 1, limit = 20, ...filters } = value;

        page = Number(page);
        limit = Number(limit);

        if (isNaN(page) || page < 1) page = 1;
        if (isNaN(limit) || limit < 1) limit = 20;

        const offset = (page - 1) * limit;

        const reservations = await db.Reservation.findAll({
            where: filters,
            limit,
            offset,
            order: [['createdAt', 'DESC']],
            include: [
                {
                    model: db.Parking,
                    attributes: ['id', 'address', 'description', 'averageRating', 'imageUrl']
                },
                {
                    model: db.User,
                    as: 'Renter',
                    attributes: ['id', 'name', 'email']
                },
                {
                    model: db.TimeSlot,
                    attributes: ['startTime', 'endTime']
                }
            ]
        });

        return reservations;
    },

    async sendNotification(receiverId, content) {
        await Message.create({
            senderId: "1",
            receiverId,
            content,
            sentAt: new Date(),
            isRead: false,
        });

        console.log(`Notification sent to user ${receiverId}: ${content}`);
    }

};

module.exports = genericService;