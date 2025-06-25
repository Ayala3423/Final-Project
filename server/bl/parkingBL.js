const genericService = require('../services/genericService');
const { Op } = require('sequelize');
const { getCoordinatesFromAddress, haversineDistance, redisClient, getOrSetCache } = require('../utils/utils');
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
        return await getOrSetCache(`parking:${id}`, 3600, async () => {
            log(`getParkingById: Fetching from DB id=${id}`);
            return await genericService.getById('Parking', id);
        });
    },

    async updateParking(id, data) {
        log(`updateParking: Updating parking id=${id} with data=${JSON.stringify(data)}`);
        const updatedParking = await genericService.update('Parking', id, data);

        await redisClient.del(`parking:${id}`);
        await redisClient.del('parkings:all');

        return updatedParking;
    },

    async deleteParking(id) {
        log(`deleteParking: Deleting parking with id=${id}`);

        const parking = await Parking.findByPk(id);
        if (!parking) throw new Error(`Parking with id=${id} not found`);

        if (parking.imageUrl && parking.imageUrl !== 'default-parking.jpg') {
            const imagePath = path.join(__dirname, '..', 'uploads', 'parkings', parking.imageUrl);
            fs.unlink(imagePath, (err) => {
                if (err) console.error(`Failed to delete image: ${imagePath}`, err);
                else log(`Image deleted: ${imagePath}`);
            });
        }

        const result = await genericService.delete('Parking', id);

        await redisClient.del(`parking:${id}`);
        await redisClient.del('parkings:all');

        return result;
    },

    async getParkingsByParams(filters, pagination) {
        const cacheKey = `parkings:params:${JSON.stringify(filters)}:page:${pagination?.page || 1}`;
        return await getOrSetCache(cacheKey, 600, async () => {
            log(`getParkingsByParams: Fetching from DB filters=${JSON.stringify(filters)}, pagination=${JSON.stringify(pagination)}`);
            return await genericService.getByParamsLimit('Parking', filters, pagination);
        });
    },

    async createParking(data) {
        log(`createParking: Creating with address=${data.address}`);
        const { latitude, longitude } = await getCoordinatesFromAddress(data.address);
        data.latitude = latitude;
        data.longitude = longitude;

        const newParking = await genericService.create('Parking', data);

        await redisClient.del('parkings:all');

        return newParking;
    },

    async getAllParkings(user) {
        const cacheKey = `parkings:all:${user.role}:${user.id}`;

        return await getOrSetCache(cacheKey, 600, async () => {
            log(`getAllParkings: Fetching from DB for role=${user.role}`);

            if (user.role === "admin") {
                return await genericService.getAll('Parking');
            } else if (user.role === "owner") {
                return await genericService.getByForeignKey('Parking', 'ownerId', user.id);
            } else {
                throw new Error('Unauthorized role parking');
            }
        });
    },

    async searchParkings(query) {
        const cacheKey = `search:${JSON.stringify(query)}`;

        return await getOrSetCache(cacheKey, 300, async () => {
            log(`searchParkings: query=${JSON.stringify(query)}`);

            let {
                lat, lng, radius = 100000, type = 'temporary',
                minPrice = 0, maxPrice = 100000000000,
                startTime = new Date(), hours = 2,
                searchText
            } = query;

            if ((!lat || !lng) && searchText) {
                const geocodeRes = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchText)}&format=json&limit=1`);
                const geocodeData = await geocodeRes.json();

                if (geocodeData.length > 0) {
                    lat = parseFloat(geocodeData[0].lat);
                    lng = parseFloat(geocodeData[0].lon);

                    query.lat = lat;
                    query.lng = lng;
                } else {
                    throw new Error('Location not found');
                }
            }

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
                center: { lat, lng },
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
        });
    },

    async getTopPopularParkings() {
        const reservations = await getOrSetCache('top:popular:parkings', 600, async () => {
            log('getTopPopularParkings: Fetching from DB');
            return await genericService.getTopPopularParkings();
        });

        const sorted = reservations
            .map(res => ({
                parkingId: res.parkingId,
                count: typeof res.get === 'function' ? res.get('reservationCount') : res.reservationCount,
                parking: res.Parking
            }))
            .sort((a, b) => {
                const scoreA = a.count * 0.7 + (a.parking.averageRating || 0) * 0.3;
                const scoreB = b.count * 0.7 + (b.parking.averageRating || 0) * 0.3;
                return scoreB - scoreA;
            })
            .slice(0, 3);

        return sorted;
    }

};

module.exports = parkingBL;