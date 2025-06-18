const User = require('../models/User');
const Passwords = require('../models/Passwords');
const Reservation = require('../models/Reservation');
const { Op } = require('sequelize');

const userService = {

  async findByUsernameOrEmail(identifier) {
    return await User.findOne({
      where: {
        username: identifier
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
    return await User.update(
      { isDeleted: true },
      { where: { id } }
    );
  },

  async findAllUsers() {
    return await User.findAll({
      where: {
        role: ['renter', 'owner']
      }
    });
  },

  async findUsersByParams(params) {
    const where = {};
    if (params.username) {
      where.username = { [Op.like]: `%${params.username}%` };
    }
    if (params.email) {
      where.email = { [Op.like]: `%${params.email}%` };
    }
    if (params.role) {
      where.role = params.role;
    }
    return await User.findAll({ where });
  },

  async createPassword(userId, hash) {
    return await Passwords.create({ userId, hash });
  },

  async getPasswordByUserId(userId) {
    return await Passwords.findOne({ where: { userId } });
  },

  async deletePassword(userId) {
    return await Passwords.destroy({ where: { userId } });
  },

  async getOrdersByParams(ownerId) {
    return orders = await Order.findAll({
      include: {
        model: Parking,
        where: { ownerId }
      },
      attributes: ['startDate']
    });
  },

};

module.exports = userService;