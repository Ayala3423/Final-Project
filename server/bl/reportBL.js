const genericService = require('../services/genericService');
const { log } =  require("../utils/logger.js");

const reportBL = {

    async getReportById(id) {
        log(`getReportById: Fetching report with id=${id}`);
        if (!id) return null;
        return await genericService.getById('Report', id);
    },

    async createReport(data) {
        log(`createReport: Creating report with data=${JSON.stringify(data)}`);
        if (!data || !data.reporterId || !data.parkingId) {
            log('createReport: Missing required data');
            return null;
        }

        const result = await this.checkReportPermission(data.reporterId, data.parkingId);
        if (!result.canReport) {
            log(`createReport: User ${data.reporterId} cannot report parking ${data.parkingId}`);
            return { message: 'You cannot report this parking.' };
        }

        return await genericService.create('Report', data);
    },

    async getAllReports() {
        log('getAllReports: Fetching all reports');
        return await genericService.getAll('Report');
    },

    async getReportsByParkingId(parkingId) {
        log(`getReportsByParkingId: Fetching reports for parkingId=${parkingId}`);
        if (!parkingId) return [];
        return await genericService.getByForeignKey('Report', 'parkingId', parkingId);
    },

    async updateReport(id, data) {
        log(`updateReport: Updating report id=${id} with data=${JSON.stringify(data)}`);
        if (!id || !data) return null;
        return await genericService.update('Report', id, data);
    },

    async deleteReport(id) {
        log(`deleteReport: Deleting report with id=${id}`);
        if (!id) return null;
        return await genericService.delete('Report', id);
    },

    async checkReportPermission(userId, parkingId) {
        log(`checkReportPermission: Checking permissions for userId=${userId}, parkingId=${parkingId}`);
        if (!userId || !parkingId) return { canReport: false };

        // Check if the user is the owner of the parking
        const parking = await genericService.getByForeignKey('Parking', 'ownerId', userId);
        if (parking && parking.length > 0) {
            log('checkReportPermission: User is owner, cannot report');
            return { canReport: false };
        }

        // Check if the user has a reservation for this parking
        const existingReservation = await genericService.getByParamsLimit('Reservation', { renterId: userId, parkingId });
        if (existingReservation.length === 0) {
            log('checkReportPermission: No reservation found, cannot report');
            return { canReport: false };
        }

        // Check if user already reported this parking
        const existingReport = await genericService.getByParamsLimit('Report', { reporterId: userId, parkingId });
        if (existingReport.length > 0) {
            log('checkReportPermission: Already reported, cannot report again');
            return { canReport: false };
        }

        log('checkReportPermission: Permission granted');
        return { canReport: true };
    }
};

module.exports = reportBL;