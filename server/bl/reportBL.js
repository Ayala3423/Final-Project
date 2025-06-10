const genericService = require('../services/genericService');

const reportBL = {

    async getReportById(id) {
        if (!id) return null;
        return await genericService.getById(id);
    },

    async createReport(data) {
       const result= await checkReportPermission (data.reporterId, data.parkingId);
        if (!data || !data.reporterId || !data.parkingId) return null; 
        if (!result.canReport) {
            return { message: 'You cannot report this parking.' };
        } 
        return await genericService.create(data);
    },

    async getAllReports() {
        return await genericService.getAll();
    }
    ,
    async getReportsByParkingId(parkingId) {
        if (!parkingId) return [];
        return await genericService.getByForeignKey('Report', 'parkingId', parkingId);
    },  

    async updateReport(id, data) {
        if (!id || !data) return null;
        return await genericService.update(id, data);
    },              


    async deleteReport(id) {
        if (!id) return null;
        return await genericService.delete(id);
    }   
            ,
    async checkReportPermission(userId, parkingId) {
        console.log("Checking report permission for userId:", userId, "and parkingId:", parkingId);
        
        if (!userId || !parkingId) return { canReport: false };
        
        // Check if the user is the owner of the parking
        const parking = await genericService.getByForeignKey('parking', 'ownerId', userId);
        if (parking && parking.ownerId === userId) {
            return { canReport: false };
        }
        const existingReservation = await genericService.getByParams('Reservation', { renterId: userId, parkingId: parkingId });
        // Check if the user has already reported this parking
        if (existingReservation.length == 0) {
            return { canReport: false };
        }
        const existingReport = await genericService.getByParams('Report', { reporterId: userId, parkingId: parkingId });
        
        if (existingReport.length > 0) {
            return { canReport: false };
        }


        return { canReport: true };
    }
    
};

module.exports = reportBL;
