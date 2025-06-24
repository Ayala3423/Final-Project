const bcrypt = require('bcrypt');
const userService = require('../services/userService');
const { redisClient, getOrSetCache } = require('../utils/utils');
const { log } = require("../utils/logger.js");

const userBL = {
    async signup(data) {
        log(`signup: Received signup data: ${JSON.stringify(data)}`);

        const { username, email, password, role, ...rest } = data;

        const existing = await userService.findByUsernameOrEmail(username);
        if (existing) {
            log(`signup: Username or email already exists for username: ${username}`);
            throw new Error('Username or email already exists');
        }

        let user;
        try {
            user = await userService.createUser({ username, email, ...rest });
            log(`signup: Created user with id: ${user.id}`);

            await userService.createRole(user.id, role);
            log(`signup: Assigned role ${role} to user id: ${user.id}`);

            if (!password) {
                log(`signup: Password missing for user id: ${user.id}`);
                throw new Error('Password is required');
            }

            const hash = await bcrypt.hash(password, 10);
            await userService.createPassword(user.id, hash);
            log(`signup: Password hashed and saved for user id: ${user.id}`);

            // מחיקת cache כללי אחרי הרשמה
            await redisClient.del('users:all');

            return user;
        } catch (err) {
            if (user?.id) {
                await userService.deleteUser(user.id);
                await userService.deletePassword(user.id);
                await userService.deleteRole(user.id);
                log(`signup: Rolled back user creation for user id: ${user.id} due to error: ${err.message}`);
            }
            log(`signup: Error during signup: ${err.message}`);
            throw new Error('Failed to create user: ' + err.message);
        }
    },

    async login(identifier, password, role) {
        const user = await userService.findByUsernameOrEmail(identifier);
        if (!user) return null;

        const passwordEntry = await userService.getPasswordByUserId(user.id);
        if (!passwordEntry) return null;

        const match = await bcrypt.compare(password, passwordEntry.hash);
        if (!match) return null;

        const roles = await userService.getRolesByUserId(user.id);
        const userRoles = roles.map(r => r.role);

        if (role && userRoles.includes(role)) {
            user.role = role;
            return user;
        }

        return null;
    },

    async getUserById(id) {
        log(`getUserById: Fetching user with id: ${id}`);

        const cacheKey = `user:${id}`;
        return await getOrSetCache(cacheKey, 600, async () => {
            const user = await userService.findUserById(id);
            if (user) {
                const roleRecord = await userService.getRoleByUserId(id);
                user.role = roleRecord?.role || null;
            }
            return user;
        });
    },

    async updateUser(id, data) {
        log(`updateUser: Updating user id: ${id} with data: ${JSON.stringify(data)}`);

        if (data.role) {
            await userService.updateRole(id, data.role);
            delete data.role;
        }

        const updatedUser = await userService.updateUser(id, data);

        await redisClient.del(`user:${id}`);
        await redisClient.del('users:all');

        return updatedUser;
    },

    async deleteUser(id) {
        log(`deleteUser: Deleting user with id: ${id}`);

        const deleted = await userService.deleteUser(id);
        await userService.deletePassword(id);
        await userService.deleteRole(id);

        await redisClient.del(`user:${id}`);
        await redisClient.del('users:all');

        return deleted > 0;
    },

    async getAllUsers() {
        log(`getAllUsers: Fetching all users`);

        const cacheKey = 'users:all';
        return await getOrSetCache(cacheKey, 300, async () => {
            return await userService.findAllUsers();
        });
    },

    async getUsersByParams(params) {
        log(`getUsersByParams: Fetching users with params: ${JSON.stringify(params)}`);

        const cacheKey = `users:params:${JSON.stringify(params)}`;
        return await getOrSetCache(cacheKey, 300, async () => {
            return await userService.findUsersByParams(params);
        });
    },

    async getOrdersPerMonth(ownerId) {
        log(`getOrdersPerMonth: Fetching orders per month for owner id: ${ownerId}`);

        const cacheKey = `orders:per:month:${ownerId}`;
        return await getOrSetCache(cacheKey, 300, async () => {
            const orders = await userService.getOrdersByParams(ownerId);
            const monthMap = {};

            orders.forEach(order => {
                const month = new Date(order.startDate).getMonth() + 1;
                if (!monthMap[month]) {
                    monthMap[month] = 0;
                }
                monthMap[month]++;
            });

            const chartData = Object.keys(monthMap).map(month => ({
                month,
                orders: monthMap[month]
            })).sort((a, b) => a.month - b.month);

            log(`getOrdersPerMonth: Orders per month data: ${JSON.stringify(chartData)}`);
            return chartData;
        });
    }
};

module.exports = userBL;