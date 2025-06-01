// bl/reservationBL.js
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
        // אפשר להוסיף ולידציות בסיסיות כאן
        return await genericService.create(data);
    },

    async getAllReservations() {
        return await genericService.getAll();
    }
};

module.exports = reservationBL;
