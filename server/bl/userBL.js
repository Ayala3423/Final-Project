const bcrypt = require('bcrypt');
const userService = require('../services/userService');
const { log } = require("../utils/logger.js");

const userBL = {
    async signup(data) {
        log(`signup: Received signup data: ${JSON.stringify(data)}`);

        const { username, email, password, ...rest } = data;

        const existing = await userService.findByUsernameOrEmail(username);
        if (existing) {
            log(`signup: Username or email already exists for username: ${username}`);
            throw new Error('Username or email already exists');
        }

        let user;
        try {
            user = await userService.createUser({ username, email, ...rest });
            log(`signup: Created user with id: ${user.id}`);

            if (!password) {
                log(`signup: Password missing for user id: ${user.id}`);
                throw new Error('Password is required');
            }

            const hash = await bcrypt.hash(password, 10);
            await userService.createPassword(user.id, hash);
            log(`signup: Password hashed and saved for user id: ${user.id}`);

            return user;
        } catch (err) {
            if (user) {
                await userService.deleteUser(user.id);
                log(`signup: Rolled back user creation for user id: ${user.id} due to error: ${err.message}`);
            }
            log(`signup: Error during signup: ${err.message}`);
            throw new Error('Failed to create user with password: ' + err.message);
        }
    },

    async login(identifier, password) {
        log(`login: Attempting login for identifier: ${identifier}`);
        const user = await userService.findByUsernameOrEmail(identifier);
        if (!user) {
            log(`login: No user found for identifier: ${identifier}`);
            return null;
        }

        const passwordEntry = await userService.getPasswordByUserId(user.id);
        if (!passwordEntry) {
            log(`login: No password entry found for user id: ${user.id}`);
            return null;
        }

        const match = await bcrypt.compare(password, passwordEntry.hash);
        if (match) {
            log(`login: Successful login for user id: ${user.id}`);
            return user;
        } else {
            log(`login: Password mismatch for user id: ${user.id}`);
            return null;
        }
    },

    async getUserById(id) {
        log(`getUserById: Fetching user with id: ${id}`);
        return await userService.findUserById(id);
    },

    async updateUser(id, data) {
        log(`updateUser: Updating user id: ${id} with data: ${JSON.stringify(data)}`);
        return await userService.updateUser(id, data);
    },

    async deleteUser(id) {
        log(`deleteUser: Deleting user with id: ${id}`);
        const deleted = await userService.deleteUser(id);
        await userService.deletePassword(id);
        log(`deleteUser: Deleted user and password for id: ${id}`);
        return deleted > 0;
    },

    async getAllUsers() {
        log(`getAllUsers: Fetching all users`);
        return await userService.findAllUsers();
    },

    async getUsersByParams(params) {
        log(`getUsersByParams: Fetching users with params: ${JSON.stringify(params)}`);
        return await userService.findUsersByParams(params);
    },

    async getOrdersPerMonth(ownerId) {
        log(`getOrdersPerMonth: Fetching orders per month for owner id: ${ownerId}`);
        const orders = await userService.getOrdersByParams(ownerId);
        const monthMap = {};

        orders.forEach(order => {
            const month = new Date(order.startDate).getMonth() + 1; // Months are 0-indexed
            if (!monthMap[month]) {
                monthMap[month] = 0;
            }
            monthMap[month]++;
        });
        const chartData = Object.keys(monthMap).map(month => ({
            month,
            orders: monthMap[month]
        })).sort((a, b) => new Date(a.month) - new Date(b.month)); // ממיין לפי תאריך
        log(`getOrdersPerMonth: Orders per month data: ${JSON.stringify(chartData)}`);
        return chartData;
    }

};

module.exports = userBL;