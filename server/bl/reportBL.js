const genericService = require('../services/genericService');

const reportBL = {

    async getReportById(id) {
        if (!id) return null;
        return await genericService.getById(id);
    },

    async createReport(data) {
        return await genericService.create(data);
    },

    async getAllReports() {
        return await genericService.getAll();
    }
    
};

module.exports = reportBL;
