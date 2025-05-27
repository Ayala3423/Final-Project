const parkingService = require('../services/genericService');

const parkingBL = {
    async getParkingById(id) {
        return await parkingService.getById('Parking', id);
    },

    async updateParking(id, data) {
        return await parkingService.update('Parking', id, data);
    },

    async deleteParking(id) {
        return await parkingService.delete('Parking', id);
    },

    async getParkingsByParams(params) {
        return await parkingService.getByParams('Parking', params);
    },

    async createParking(data) {
        return await parkingService.create('Parking', data);
    }//send to calc lon and lat
};

module.exports = parkingBL;