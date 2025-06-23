const genericService = require('../services/genericService');
const { Op } = require('sequelize');
const { getCoordinatesFromAddress, haversineDistance } = require('../utils/utils');
const { log } = require("../utils/logger.js");

function isToday(date) {
    const now = new Date();
    return new Date(date).toDateString() === now.toDateString();
}

function getTimeString(date) {
    return date.toTimeString().slice(0, 5);
}

const parkingBL = {
    async getParkingById(id) {
        log(`getParkingById: Fetching parking with id=${id}`);
        return await genericService.getById('Parking', id);
    },

    async updateParking(id, data) {
        log(`updateParking: Updating parking id=${id} with data=${JSON.stringify(data)}`);
        return await genericService.update('Parking', id, data);
    },

    async deleteParking(id) {
        log(`deleteParking: Deleting parking with id=${id}`);
        return await genericService.delete('Parking', id);
    },

    async getParkingsByParams(filters, pagination) {
        log(`getParkingsByParams: filters=${JSON.stringify(filters)}, pagination=${JSON.stringify(pagination)}`);
        return await genericService.getByParamsLimit('Parking', filters, pagination);
    },

    async createParking(data) {
        log(`createParking: Creating with address=${data.address}`);
        const { latitude, longitude } = await getCoordinatesFromAddress(data.address);
        data.latitude = latitude;
        data.longitude = longitude;
        return await genericService.create('Parking', data);
    },

    async getAllParkings(user) {
        log(`getAllParkings: role=${user.role}`);
        if (user.role === "admin") {
            return await genericService.getAll('Parking');
        } else if (user.role === "owner") {
            return await genericService.getByForeignKey('Parking', 'ownerId', user.id);
        } else {
            throw new Error('Unauthorized role parking');
        }
    },

    async searchParkings(query) {
        log(`searchParkings: query=${JSON.stringify(query)}`);

        let {
            lat, lng, radius = 5000, type = 'temporary',
            minPrice = 0, maxPrice = 100000000000,
            startTime = new Date(), hours = 2,
            searchText // הפרמטר החדש
        } = query;

        // אם אין קואורדינטות אבל יש טקסט - מבצעים גיאוקודינג
        if ((!lat || !lng) && searchText) {
            const geocodeRes = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchText)}&format=json&limit=1`);
            const geocodeData = await geocodeRes.json();

            if (geocodeData.length > 0) {
                lat = parseFloat(geocodeData[0].lat);
                lng = parseFloat(geocodeData[0].lon);

                // עדכון ה-query עם הקואורדינטות שנמצאו
                query.lat = lat;
                query.lng = lng;
            } else {
                throw new Error('Location not found');
            }
        }

        // אם עדיין אין קואורדינטות - זרוק שגיאה
        if (!lat || !lng) throw new Error('Missing coordinates');

        const startDateTime = new Date(startTime);
        const endDateTime = new Date(startDateTime.getTime() + hours * 60 * 60 * 1000);
        const today = startDateTime.toISOString().split("T")[0];
        const dayOfWeek = startDateTime.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

        const allParkings = await genericService.getByParamsLimit('Parking', {});

        const parkingsInRange = allParkings.filter(p => {
            const distance = haversineDistance(lat, lng, p.latitude, p.longitude);
            return distance <= radius;
        });

        const parkingIds = parkingsInRange.map(p => p.id);
        if (parkingIds.length === 0) return { center: { lat, lng }, parkings: [] };

        const conditions = {
            parkingId: { [Op.in]: parkingIds },
            isRented: false,
            price: {}
        };

        if (minPrice !== undefined && minPrice !== null) conditions.price[Op.gte] = parseFloat(minPrice);
        if (maxPrice !== undefined && maxPrice !== null) conditions.price[Op.lte] = parseFloat(maxPrice);
        if (!minPrice && !maxPrice) delete conditions.price;

        const allowedTypes = [type];
        if (type === 'temporary' && isToday(startDateTime)) {
            allowedTypes.push('fixed');
        }

        conditions.type = { [Op.in]: allowedTypes };

        const orConditions = [];

        if (allowedTypes.includes('temporary')) {
            orConditions.push({
                type: 'temporary',
                date: today,
                startTime: { [Op.lte]: getTimeString(startDateTime) },
                endTime: { [Op.gte]: getTimeString(endDateTime) }
            });
        }

        if (allowedTypes.includes('fixed')) {
            orConditions.push({
                type: 'fixed',
                dayOfWeek,
                startTime: { [Op.lte]: getTimeString(startDateTime) },
                endTime: { [Op.gte]: getTimeString(endDateTime) }
            });
        }

        conditions[Op.or] = orConditions;

        log(`searchParkings: final conditions=${JSON.stringify(conditions)}`);
        const slots = await genericService.getAdvanced('TimeSlot', conditions, ['Parking']);

        return {
            center: { lat, lng }, // כאן זה כבר תמיד מעודכן
            parkings: slots.map(slot => ({
                id: slot.Parking.id,
                address: slot.Parking.address,
                lat: slot.Parking.latitude,
                lng: slot.Parking.longitude,
                description: slot.Parking.description,
                imageUrl: slot.Parking.imageUrl,
                rating: slot.Parking.averageRating,
                price: slot.price,
                type: slot.type,
                timeSlotId: slot.id,
                startTime: slot.startTime,
                endTime: slot.endTime,
                ownerId: slot.Parking.ownerId,
            }))
        };
    }

};

module.exports = parkingBL;