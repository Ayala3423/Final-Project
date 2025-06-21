const { Sequelize } = require('sequelize');
const { Reservation, Parking, Report } = require('../models');

const getStatistics = async (ownerId, role) => {
    const whereClause = role === 'admin' ? {} : { ownerId };

    const parkingCount = await Parking.count({ where: whereClause });
    const reservationCount = await Reservation.count({ where: whereClause });
    const totalRevenue = await Reservation.sum('totalPrice', { where: whereClause });
    const openReportCount = await Report.count({
        where: role === 'admin' ? {} : { reportedUserId: ownerId }
    });

    return { parkingCount, reservationCount, totalRevenue, openReportCount };
};

const getMonthlyRevenue = async (ownerId, role) => {
    const whereClause = role === 'admin' ? {} : { ownerId };

    const monthlyRevenueRaw = await Reservation.findAll({
        attributes: [
            [Sequelize.fn('DATE_FORMAT', Sequelize.col('startTime'), '%Y-%m'), 'month'],
            [Sequelize.fn('SUM', Sequelize.col('totalPrice')), 'total']
        ],
        where: whereClause,
        group: ['month'],
        raw: true
    });

    const monthlyRevenue = {};
    monthlyRevenueRaw.forEach(row => {
        monthlyRevenue[row.month] = parseFloat(row.total);
    });

    return monthlyRevenue;
};

module.exports = {
    getStatistics,
    getMonthlyRevenue,
};