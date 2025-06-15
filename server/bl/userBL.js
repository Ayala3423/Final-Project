const bcrypt = require('bcrypt');
const userService = require('../services/userService');

const userBL = {
   // userBL.js
async signup(data) {
    const { username, email, password, ...rest } = data;
    console.log("📥 קיבלתי את הנתונים להרשמה:", data);

    const existing = await userService.findByUsernameOrEmail(username);
    if (existing) {
        throw new Error('Username or email already exists');
    }

    let user;
    try {
        user = await userService.createUser({ username, email, ...rest });

        if (!password) {
            throw new Error('Password is required');
        }

        const hash = await bcrypt.hash(password, 10);
        await userService.createPassword(user.id, hash);
        console.log(`🔐 סיסמה נוצרה עבור משתמש: ${user.id}`);

        return user;
    } catch (err) {
        if (user) {
            await userService.deleteUser(user.id);
            console.warn(`⚠️ משתמש בוטל עקב שגיאה: ${err.message}`);
        }
        console.error("שגיאה ביצירת משתמש:", err);
        throw new Error('Failed to create user with password: ' + err.message);
    }
}
,


    async login(identifier, password) {
        const user = await userService.findByUsernameOrEmail(identifier);
        if (!user) return null;

        const passwordEntry = await userService.getPasswordByUserId(user.id);
        if (!passwordEntry) return null;

        const match = await bcrypt.compare(password, passwordEntry.hash);
        return match ? user : null;
    },

    async getUserById(id) {
        return await userService.findUserById(id);
    },

    async updateUser(id, data) {
        return await userService.updateUser(id, data);
    },

    async deleteUser(id) {
        const deleted = await userService.deleteUser(id);
        await userService.deletePassword(id);
        return deleted > 0;
    },

    async getAllUsers() {
        return await userService.findAllUsers();
    },

    async getUsersByParams(params) {
        return await userService.findUsersByParams(params);
    }

};

module.exports = userBL;