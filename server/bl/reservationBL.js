const genericService = require('../services/genericService');
const { log } = require("../utils/logger.js");
const { getPayPalAccessToken } = require('../services/paypalAuthService');
const sendRenewalEmail = require('../services/emailService.js');
const { sendToOwner } = require('../services/payoutService');
const { redisClient, getOrSetCache } = require('../utils/utils');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const reservationBL = {

    async getReservationById(id) {
        log(`getReservationById: Fetching reservation with id=${id}`);
        if (!id) return null;

        const cacheKey = `reservation:${id}`;
        return await getOrSetCache(cacheKey, 300, async () => {
            return await genericService.getById('Reservation', id);
        });
    },

    async updateReservation(id, data) {
        log(`updateReservation: Updating reservation id=${id} with data=${JSON.stringify(data)}`);

        const existing = await genericService.getById('Reservation', id);
        if (!existing) {
            log(`updateReservation: Reservation id=${id} not found`);
            return null;
        }

        const updatedReservation = await genericService.update('Reservation', id, data);

        await redisClient.del(`reservation:${id}`);
        await redisClient.del('reservations:all');

        return updatedReservation;
    },

    async deleteReservation(id) {
        log(`deleteReservation: Deleting reservation id=${id}`);

        const existing = await genericService.getById('Reservation', id);
        if (!existing) {
            log(`deleteReservation: Reservation id=${id} not found`);
            return null;
        }

        const result = await genericService.delete('Reservation', id);

        await redisClient.del(`reservation:${id}`);
        await redisClient.del('reservations:all');

        return result;
    },

    async createReservation(data) {
        log(`createReservation: Creating reservation with data=${JSON.stringify(data)}`);
        const newReservation = await genericService.create('Reservation', data);

        await redisClient.del('reservations:all');

        return newReservation;
    },

    async getAllReservations() {
        const cacheKey = 'reservations:all';
        return await getOrSetCache(cacheKey, 300, async () => {
            log('getAllReservations: Fetching all reservations');
            return await genericService.getAll('Reservation');
        });
    },

    async getReservationsByValue(value) {
        log(`getReservationsByValue: Fetching reservations with value=${JSON.stringify(value)}`);
        if (!value) return [];

        const cacheKey = `reservations:search:${JSON.stringify(value)}`;
        return await getOrSetCache(cacheKey, 300, async () => {
            return await genericService.getReservationsFullByValue(value);
        });
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

        const captureId = captureData.purchase_units?.[0]?.payments?.captures?.[0]?.id;
        if (!captureId) {
            log("⚠️ Warning: Could not extract captureId from PayPal response.");
        }

        const fullAmount = parseFloat(reservationData.totalPrice);
        const yourFee = +(fullAmount * 0.10).toFixed(2);
        const ownerAmount = +(fullAmount - yourFee).toFixed(2);

        log(`confirmPaymentAndPayout: Saving reservation to DB`);

        reservationData.captureId = captureId;
        const savedReservation = await genericService.create('Reservation', reservationData);

        setTimeout(async () => {
            await sendRenewalEmail(savedReservation);
        }, 30 * 24 * 60 * 60 * 1000);

        await redisClient.del('reservations:all');

        log(`confirmPaymentAndPayout: Sending ${ownerAmount}₪ to owner ${reservationData.ownerId}`);
        await sendToOwner(reservationData.ownerId, ownerAmount, accessToken);

        log(`confirmPaymentAndPayout: Completed successfully`);
    },

    async refundPaymentAndPayout(reservationId) {
        console.log(`🔄 refundPaymentAndPayout: Trying to refund reservation ID: ${reservationId}`);

        const reservation = await genericService.getById('Reservation', reservationId);
        if (!reservation) {
            throw new Error(`Reservation with ID ${reservationId} not found`);
        }

        const captureId = reservation.captureId;
        if (!captureId) {
            throw new Error(`No captureId found for reservation ID ${reservationId}`);
        }

        const accessToken = await getPayPalAccessToken();

        const refundRes = await fetch(`https://api-m.paypal.com/v2/payments/captures/${captureId}/refund`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        const refundData = await refundRes.json();

        if (!refundRes.ok) {
            console.error('❌ Refund failed:', refundData);
            throw new Error(refundData.message || 'Refund failed');
        }

        // 5. עדכון סטטוס ההזמנה במסד הנתונים
        await genericService.update('Reservation', reservationId, { status: 'cancelled' });

        console.log(`✅ Refund succeeded and reservation ${reservationId} marked as cancelled`);
    },

    async renewReservation(reservationId) {
        const oldReservation = await genericService.getById('Reservation', reservationId);
        if (!oldReservation) throw new Error('Reservation not found');

        const now = new Date();
        const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        const endOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 2, 0);

        const newReservationData = {
            renterId: oldReservation.renterId,
            ownerId: oldReservation.ownerId,
            parkingId: oldReservation.parkingId,
            reservationStart: startOfNextMonth.toISOString(),
            reservationEnd: endOfNextMonth.toISOString(),
            totalPrice: oldReservation.totalPrice, 
        };

        const newReservation = await genericService.create('Reservation', newReservationData);

        return newReservation;
    }

};

module.exports = reservationBL;