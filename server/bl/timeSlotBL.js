const genericService = require('../services/genericService');
import { log } from "../utils/logger.js";

const timeSlotBL = {

    async getTimeSlotById(id) {
        log(`getTimeSlotById: Fetching TimeSlot with id=${id}`);
        return await genericService.getById('TimeSlot', id);
    },

    async createTimeSlot(data) {
        log(`createTimeSlot: Creating TimeSlot with data=${JSON.stringify(data)}`);
        return await genericService.create('TimeSlot', data);
    },

    async getAllTimeSlots(params) {
        log(`getAllTimeSlots: Fetching all TimeSlots for parkingId=${params.parkingId}`);
        return await genericService.getByForeignKey('TimeSlot', "parkingId", params.parkingId);
    },

    async updateTimeSlot(id, data) {
        log(`updateTimeSlot: Updating TimeSlot id=${id} with data=${JSON.stringify(data)}`);
        return await genericService.update('TimeSlot', id, data);
    },

    async deleteTimeSlot(id) {
        log(`deleteTimeSlot: Deleting TimeSlot id=${id}`);
        return await genericService.remove('TimeSlot', id);
    },

    async getTimeSlotsByParkingId(parkingId) {
        log(`getTimeSlotsByParkingId: Fetching TimeSlots for parkingId=${parkingId}`);
        return await genericService.getByForeignKey('TimeSlot', 'parkingId', parkingId);
    },

};

module.exports = timeSlotBL;