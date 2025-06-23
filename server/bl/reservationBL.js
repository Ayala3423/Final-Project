const genericService = require('../services/genericService');
const { log } = require("../utils/logger.js");
const { getPayPalAccessToken} = require('../services/paypalAuthService');
const { sendToOwner } = require('../services/payoutService');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

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
        return await genericService.delete('Reservation', id);
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
        return await genericService.getReservationsFullByValue(value);
    },

    async confirmPaymentAndPayout(orderID, reservationData) {
        log(`confirmPaymentAndPayout: Starting process for orderID=${orderID}`);

        const accessToken = await getPayPalAccessToken();

        log(`confirmPaymentAndPayout: Capturing PayPal order`);
        const captureRes = await fetch(`https://api-m.paypal.com/v2/checkout/orders/${orderID}/capture`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        const captureData = await captureRes.json();
        if (!captureRes.ok) {
            log(`confirmPaymentAndPayout: Capture failed: ${JSON.stringify(captureData)}`);
            throw new Error('PayPal capture failed');
        }

        const fullAmount = parseFloat(reservationData.totalPrice);
        const yourFee = +(fullAmount * 0.10).toFixed(2);
        const ownerAmount = +(fullAmount - yourFee).toFixed(2);

        log(`confirmPaymentAndPayout: Saving reservation to DB`);
        await genericService.create('Reservation', reservationData);

        log(`confirmPaymentAndPayout: Sending ${ownerAmount}₪ to owner ${reservationData.ownerId}`);
        await sendToOwner(reservationData.ownerId, ownerAmount, accessToken);

        log(`confirmPaymentAndPayout: Completed successfully`);
    }

};

module.exports = reservationBL;
