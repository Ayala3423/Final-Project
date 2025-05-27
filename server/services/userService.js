const  User  = require('../models/User');
const  Passwords  = require('../models/Passwords');
const { Op } = require('sequelize');

const userService = {
  async findByUsernameOrEmail(identifier) {
    return await User.findOne({
      where: {
        [Op.or]: [{ username: identifier }]
      }
    });
  },

  async createUser(userData) {
    return await User.create(userData);
  },

  async findUserById(id) {
    return await User.findByPk(id);
  },

  async updateUser(id, data) {
    const user = await User.findByPk(id);
    if (!user) return null;
    return await user.update(data);
  },

  async deleteUser(id) {
    return await User.destroy({ where: { id } });
  },

  async findAllUsers() {
    return await User.findAll();
  },

  async createPassword(userId, hash) {
    console.log(`Creating password for userId: ${userId}, hash: ${hash}`);
    
    return await Passwords.create({ userId, hash });
  },

  async getPasswordByUserId(userId) {
    return await Passwords.findOne({ where: { userId } });
  },

  async deletePassword(userId) {
    return await Passwords.destroy({ where: { userId } });
  }
};

module.exports = userService;