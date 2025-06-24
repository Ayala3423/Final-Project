const genericService = require('../services/genericService');
const { log } = require("../utils/logger.js");
const { redisClient, getOrSetCache } = require('../utils/utils');

const timeSlotBL = {

    async getTimeSlotById(id) {
        log(`getTimeSlotById: Fetching TimeSlot with id=${id}`);

        const cacheKey = `timeslot:${id}`;
        return await getOrSetCache(cacheKey, 300, async () => {
            return await genericService.getById('TimeSlot', id);
        });
    },

    async createTimeSlot(data) {
        log(`createTimeSlot: Creating TimeSlot with data=${JSON.stringify(data)}`);
        const newTimeSlot = await genericService.create('TimeSlot', data);

        // ניקוי Cache
        await redisClient.del(`timeslots:parking:${data.parkingId}`);

        return newTimeSlot;
    },

    async getAllTimeSlots(params) {
        log(`getAllTimeSlots: Fetching all TimeSlots for parkingId=${params.parkingId}`);

        const cacheKey = `timeslots:parking:${params.parkingId}`;
        return await getOrSetCache(cacheKey, 300, async () => {
            return await genericService.getByForeignKey('TimeSlot', "parkingId", params.parkingId);
        });
    },

    async updateTimeSlot(id, data) {
        log(`updateTimeSlot: Updating TimeSlot id=${id} with data=${JSON.stringify(data)}`);

        const updatedTimeSlot = await genericService.update('TimeSlot', id, data);

        await redisClient.del(`timeslot:${id}`);
        await redisClient.del(`timeslots:parking:${data.parkingId}`);

        return updatedTimeSlot;
    },

    async deleteTimeSlot(id) {
        log(`deleteTimeSlot: Deleting TimeSlot id=${id}`);

        const existing = await genericService.getById('TimeSlot', id);
        if (!existing) {
            log(`deleteTimeSlot: TimeSlot id=${id} not found`);
            return null;
        }

        const result = await genericService.remove('TimeSlot', id);

        await redisClient.del(`timeslot:${id}`);
        await redisClient.del(`timeslots:parking:${existing.parkingId}`);

        return result;
    },

    async getTimeSlotsByParkingId(parkingId) {
        log(`getTimeSlotsByParkingId: Fetching TimeSlots for parkingId=${parkingId}`);

        const cacheKey = `timeslots:parking:${parkingId}`;
        return await getOrSetCache(cacheKey, 300, async () => {
            return await genericService.getByForeignKey('TimeSlot', 'parkingId', parkingId);
        });
    },

};

module.exports = timeSlotBL;