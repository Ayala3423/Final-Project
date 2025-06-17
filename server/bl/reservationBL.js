const genericService = require('../services/genericService');
import { log } from "../utils/logger.js";

const reservationBL = {
    
    async getReservationById(id) {
        log(`getReservationById: Fetching reservation with id=${id}`);
        if (!id) return null;
        return await genericService.getById('Reservation', id);
    },

    async updateReservation(id, data) {
        log(`updateReservation: Updating reservation id=${id} with data=${JSON.stringify(data)}`);
        const existing = await genericService.getById('Reservation', id);
        if (!existing) {
            log(`updateReservation: Reservation id=${id} not found`);
            return null;
        }
        return await genericService.update('Reservation', id, data);
    },

    async deleteReservation(id) {
        log(`deleteReservation: Deleting reservation id=${id}`);
        const existing = await genericService.getById('Reservation', id);
        if (!existing) {
            log(`deleteReservation: Reservation id=${id} not found`);
            return null;
        }
        return await genericService.remove('Reservation', id);
    },

    async createReservation(data) {
        log(`createReservation: Creating reservation with data=${JSON.stringify(data)}`);
        return await genericService.create('Reservation', data);
    },

    async getAllReservations() {
        log('getAllReservations: Fetching all reservations');
        return await genericService.getAll('Reservation');
    },

    async getReservationsByValue(value) {
        log(`getReservationsByValue: Fetching reservations with value=${JSON.stringify(value)}`);
        if (!value) return [];
        return await genericService.getByParamsLimit('Reservation', value);
    }
    
};

module.exports = reservationBL;