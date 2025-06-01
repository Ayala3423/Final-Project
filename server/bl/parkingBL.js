const genericService = require('../services/genericService');

const { getCoordinatesFromAddress } = require('../utils/utils');

// const haversine = require('haversine-distance');

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

    async getParkingsByParams(params) {
        return await genericService.getByParams('Parking', params);
    },

    async createParking(data) {
        const { latitude, longitude } = await getCoordinatesFromAddress(data.address);
        data.latitude = latitude;
        data.longitude = longitude;

        return await genericService.create('Parking', data);
    },
//TODO: add TimeSlot model and relations
//TODO: add createTimeSlot method

//TODO: ask mrs. if we need 2 api.
  async searchParkings(params) {
    const {
      lat, lng,
      radius = 1,
      type = 'temporary',
      minPrice,
      maxPrice,
      startTime = new Date(),
      hours = 2
    } = params;

    if (!lat || !lng) throw new Error('Missing coordinates');

    const startDateTime = new Date(startTime);
    const endDateTime = new Date(startDateTime.getTime() + hours * 60 * 60 * 1000);
    const today = startDateTime.toISOString().split("T")[0];
    const dayOfWeek = startDateTime.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

    // שליפה גנרית של חניות
    const allParkings = await genericService.getByParams('Parking', {}); // כל החניות
    const parkingsInRange = allParkings.filter(p => {
      const distance = haversine({ lat, lng }, { lat: p.latitude, lng: p.longitude }) / 1000;
      return distance <= radius;
    });

    const parkingIds = parkingsInRange.map(p => p.id);
    if (parkingIds.length === 0) return [];

    const conditions = {
      parkingId: { $in: parkingIds },
      isRented: false,
      price: {}
    };

    if (minPrice) conditions.price.$gte = parseFloat(minPrice);
    if (maxPrice) conditions.price.$lte = parseFloat(maxPrice);
    if (!minPrice && !maxPrice) delete conditions.price;

    const allowedTypes = [type];
    if (type === 'temporary' && isToday(startDateTime)) {
      allowedTypes.push('fixed');
    }
    conditions.type = { $in: allowedTypes };

    const orConditions = [];

    if (allowedTypes.includes('temporary')) {
      orConditions.push({
        type: 'temporary',
        date: today,
        startTime: { $lte: getTimeString(startDateTime) },
        endTime: { $gte: getTimeString(endDateTime) }
      });
    }

    if (allowedTypes.includes('fixed')) {
      orConditions.push({
        type: 'fixed',
        dayOfWeek,
        startTime: { $lte: getTimeString(startDateTime) },
        endTime: { $gte: getTimeString(endDateTime) }
      });
    }

    conditions.$or = orConditions;

    const slots = await genericService.getAdvanced('TimeSlot', conditions, ['Parking']);

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
      endTime: slot.endTime
    }));
  }
};




module.exports = parkingBL;