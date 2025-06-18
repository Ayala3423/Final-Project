const dataBL = require('../bl/dataBL');

const getDashboardData = async (req, res, next) => {
    try {
        console.log('Fetching dashboard data for user:', req.user.id, 'Role:', req.user.role);
        const userId = req.user.id;
        const role = req.user.role;

        const data = await dataBL.getDashboardData(userId, role);
        res.json(data);
    } catch (err) {
        next(err);
    }
};

module.exports = { getDashboardData };