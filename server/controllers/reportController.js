const reportBL = require('../bl/reportBL');



const reportController = {      
    async getReportById(req, res) {
        try {
            const report = await reportBL.getReportById(req.params.id);
            if (!report) {
                return res.status(404).json({ message: 'Report not found' });
            }
            res.status(200).json(report);
        } catch (error) {
            console.error('Error fetching report:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    async createReport(req, res) {
        try {
            const newReport = await reportBL.createReport(req.body);
            res.status(201).json(newReport);
        } catch (error) {
            console.error('Error creating report:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    async getAllReports(req, res) {
        try {
            const reports = await reportBL.getAllReports();
            res.status(200).json(reports);
        } catch (error) {
            console.error('Error fetching reports:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};          

module.exports = reportController;  