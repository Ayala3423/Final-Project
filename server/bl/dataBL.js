const dataService = require('../services/dataService');

const getDashboardData = async (userId, role) => {
    const statistics = await dataService.getStatistics(userId, role);
    const chartData = await dataService.getMonthlyRevenue(userId, role);

    return {
        statistics,
        chartData,
    };
};

module.exports = { getDashboardData };