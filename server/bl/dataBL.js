const dataService = require('../services/dataService');
const { getOrSetCache } = require('../utils/utils');

const getDashboardData = async (userId, role) => {
    const cacheKey = `dashboard:${role}:${userId}`;

    return await getOrSetCache(cacheKey, 300, async () => { 
        const statistics = await dataService.getStatistics(userId, role);
        const chartData = await dataService.getMonthlyRevenue(userId, role);

        return {
            statistics,
            chartData,
        };
    });
};

module.exports = { getDashboardData };