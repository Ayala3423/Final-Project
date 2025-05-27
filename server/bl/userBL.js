const bcrypt = require('bcrypt');
const userService = require('../services/userService');
const userBL = {
  async signup(data) {
    const { username, email, password, ...rest } = data;
   
    const existing = await userService.findByUsernameOrEmail(username);
    if (existing) {
      throw new Error('Username or email already exists');
    }

    const user = await userService.createUser({ username, email, ...rest });

    const hash = await bcrypt.hash(password, 10);
    
    await userService.createPassword(user.id, hash);
    console.log(`Password created for user: ${user.id}`);
    

    return user;
  },

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
  }
};

module.exports = userBL;