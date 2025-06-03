const genericService = require('../services/genericService');

const timeSlotBL = {

    async getTimeSlotById(id) {
        return await genericService.getById('TimeSlot', id);
    },

    async createTimeSlot(data) {
        return await genericService.create('TimeSlot', data);
    },

    async getAllTimeSlots(params) {
        return await genericService.getByForeignKey('TimeSlot',"parkingId",params.parkingId);
    },

    async updateTimeSlot(id, data) {
        return await genericService.update('TimeSlot', id, data);
    },

    async deleteTimeSlot(id) {
        return await genericService.remove('TimeSlot', id);
    }
    
};

module.exports = timeSlotBL;
