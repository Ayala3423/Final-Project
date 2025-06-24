const genericService = require('../services/genericService');
const { log } = require("../utils/logger.js");
const { redisClient, getOrSetCache } = require('../utils/utils');

const reportBL = {

    async getReportById(id) {
        log(`getReportById: Fetching report with id=${id}`);
        if (!id) return null;

        const cacheKey = `report:${id}`;
        return await getOrSetCache(cacheKey, 300, async () => {
            return await genericService.getById('Report', id);
        });
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

        const newReport = await genericService.create('Report', data);

        // ניקוי Cache רלוונטי
        await redisClient.del('reports:all');
        await redisClient.del(`reports:parking:${data.parkingId}`);

        return newReport;
    },

    async getAllReports() {
        const cacheKey = 'reports:all';
        return await getOrSetCache(cacheKey, 300, async () => {
            log('getAllReports: Fetching all reports');
            return await genericService.getAll('Report');
        });
    },

    async getReportsByParkingId(parkingId) {
        log(`getReportsByParkingId: Fetching reports for parkingId=${parkingId}`);
        if (!parkingId) return [];

        const cacheKey = `reports:parking:${parkingId}`;
        return await getOrSetCache(cacheKey, 300, async () => {
            return await genericService.getByForeignKey('Report', 'parkingId', parkingId);
        });
    },

    async updateReport(id, data) {
        log(`updateReport: Updating report id=${id} with data=${JSON.stringify(data)}`);
        if (!id || !data) return null;

        const updatedReport = await genericService.update('Report', id, data);

        // ניקוי Cache
        await redisClient.del(`report:${id}`);
        await redisClient.del('reports:all');
        if (data.parkingId) {
            await redisClient.del(`reports:parking:${data.parkingId}`);
        }

        return updatedReport;
    },

    async deleteReport(id) {
        log(`deleteReport: Deleting report with id=${id}`);
        if (!id) return null;

        const report = await genericService.getById('Report', id);
        const result = await genericService.delete('Report', id);

        // ניקוי Cache
        await redisClient.del(`report:${id}`);
        await redisClient.del('reports:all');
        if (report && report.parkingId) {
            await redisClient.del(`reports:parking:${report.parkingId}`);
        }

        return result;
    },

    async checkReportPermission(userId, parkingId) {
        log(`checkReportPermission: Checking permissions for userId=${userId}, parkingId=${parkingId}`);
        if (!userId || !parkingId) return { canReport: false };

        const parking = await genericService.getByForeignKey('Parking', 'ownerId', userId);
        if (parking && parking.length > 0) {
            log('checkReportPermission: User is owner, cannot report');
            return { canReport: false };
        }

        const existingReservation = await genericService.getByParamsLimit('Reservation', { renterId: userId, parkingId });
        if (existingReservation.length === 0) {
            log('checkReportPermission: No reservation found, cannot report');
            return { canReport: false };
        }

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