// bl/reportBL.js

const genericService = require('../services/genericService');

const reportBL = {

    async getReportById(id) {
        if (!id) return null;
        return await genericService.getById(id);
    },

    async createReport(data) {
        // ניתן להוסיף ולידציה בסיסית כאן
        return await genericService.create(data);
    },

    async getAllReports() {
        return await genericService.getAll();
    }
};

module.exports = reportBL;
