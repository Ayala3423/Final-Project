const genericService = require('../services/genericService');
const reservationBL = {
    
    async getReservationById(id) {
        if (!id) return null;
        return await genericService.getById(id);
    },

    async updateReservation(id, data) {
        const existing = await genericService.getById(id);
        if (!existing) return null;
        return await genericService.update(id, data);
    },

    async deleteReservation(id) {
        const existing = await genericService.getById(id);
        if (!existing) return null;
        return await genericService.remove(id);
    },

    async createReservation(data) {
        return await genericService.create('reservation', data);
    },

    async getAllReservations() {
        return await genericService.getAll();
    },

    async getReservationsByValue(value) {
        if (!value) return [];
        console.log("Fetching reservations with value:", value);
        
        return await genericService.getByParamsLimit('reservation', value);
    }
    
};

module.exports = reservationBL;
