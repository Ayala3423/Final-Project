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
,                   
    async getReportsByParkingId(req, res) {
        try {
            const reports = await reportBL.getReportsByParkingId(req.query.parkingId);
            res.status(200).json(reports);
        } catch (error) {
            console.error('Error fetching reports by parking ID:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    async updateReport(req, res) {
        try {
            const updatedReport = await reportBL.updateReport(req.params.id, req.body);
            if (!updatedReport) {
                return res.status(404).json({ message: 'Report not found' });
            }
            res.status(200).json(updatedReport);
        } catch (error) {
            console.error('Error updating report:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    async deleteReport(req, res) {
        try {
            const deleted = await reportBL.deleteReport(req.params.id);
            if (!deleted) {
                return res.status(404).json({ message: 'Report not found' });
            }
            res.status(204).send();
        } catch (error) {
            console.error('Error deleting report:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
,
    async checkReportPermission(req, res) {
        try {
            const { userId, parkingId } = req.query;
            if (!userId || !parkingId) {
                return res.status(400).json({ message: 'Missing userId or parkingId' });
            }
            const canReport = await reportBL.checkReportPermission(userId, parkingId);
            res.status(200).json({ canReport });
        } catch (error) {
            console.error('Error checking report permission:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};          

module.exports = reportController;  