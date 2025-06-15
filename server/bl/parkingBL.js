const genericService = require('../services/genericService');
const { Op } = require('sequelize')
const { getCoordinatesFromAddress, haversineDistance } = require('../utils/utils');

function isToday(date) {
    const now = new Date();
    return new Date(date).toDateString() === now.toDateString();
}

function getTimeString(date) {
    return date.toTimeString().slice(0, 5);
}

const parkingBL = {

    async getParkingById(id) {

        return await genericService.getById('Parking', id);
    },

    async updateParking(id, data) {
        return await genericService.update('Parking', id, data);
    },

    async deleteParking(id) {
        return await genericService.delete('Parking', id);
    },

    async getParkingsByParams(filters, pagination) {
        return await genericService.getByParamsLimit('Parking', filters, pagination);
    },

    async createParking(data) {
        const { latitude, longitude } = await getCoordinatesFromAddress(data.address);
        data.latitude = latitude;
        data.longitude = longitude;

        return await genericService.create('Parking', data);
    },

    async getAllParkings(user) {
        console.log('אימות');
        if (user.role == "admin")
            return await genericService.getAll('Parking');
        else if (user.role == "owner") {
            return await genericService.getByForeignKey('Parking', 'ownerId', user.id);
        }
        else {
            throw new Error('unathorized role parking')
        }
    },
    //TODO: add TimeSlot model and relations
    //TODO: add createTimeSlot method

    //TODO: ask mrs. if we need 2 api.
    async searchParkings(query) {
        const {
            lat,
            lng,
            radius = 1000,
            type = 'temporary',
            minPrice = 0,
            maxPrice = 100000000000,
            startTime = new Date(),
            hours = 2
        } = query;
        console.log("searchParkings called with query:", query);
        if (!lat || !lng) throw new Error('Missing coordinates');

        const startDateTime = new Date(startTime);
        const endDateTime = new Date(startDateTime.getTime() + hours * 60 * 60 * 1000);
        const today = startDateTime.toISOString().split("T")[0];
        const dayOfWeek = startDateTime.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

        // שליפה גנרית של חניות
        const allParkings = await genericService.getByParamsLimit('Parking', {}); // כל החניות
        const parkingsInRange = allParkings.filter(p => {
            console.log(p);

            const distance = haversineDistance(lat, lng, p.latitude, p.longitude);
            console.log(distance + " distance1");

            return distance <= radius;
        });

        const parkingIds = parkingsInRange.map(p => p.id);
        console.log(parkingIds.length + " length");

        if (parkingIds.length == 0) return [];
        console.log("1");

        const conditions = {
            parkingId: { [Op.in]: parkingIds },
            isRented: false,
            price: {}
        };

        if (minPrice) conditions.price[Op.gte] = parseFloat(minPrice);
        if (maxPrice) conditions.price[Op.lte] = parseFloat(maxPrice);
        if (!minPrice && !maxPrice) delete conditions.price;
        console.log("2");

        const allowedTypes = [type];
        if (type === 'temporary' && isToday(startDateTime)) {
            allowedTypes.push('fixed');
        }
        console.log("3");

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
        console.log("4");

        if (allowedTypes.includes('fixed')) {
            orConditions.push({
                type: 'fixed',
                dayOfWeek,
                startTime: { [Op.lte]: getTimeString(startDateTime) },
                endTime: { [Op.gte]: getTimeString(endDateTime) }
            });
        }

        conditions[Op.or] = orConditions;
        console.log("5" + JSON.stringify(conditions));

        const slots = await genericService.getAdvanced('TimeSlot', conditions, ['Parking']);
        console.log("6");

        return slots.map(slot => ({
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
        }));
    }

};

module.exports = parkingBL;