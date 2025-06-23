const User = require('../models/User');
const Role = require('../models/Role');
const Passwords = require('../models/Passwords');
const Reservation = require('../models/Reservation');
const { Op } = require('sequelize');

const userService = {

  async findByUsernameOrEmail(identifier) {
    return await User.findOne({
      where: {
        [Op.or]: [
          { username: identifier },
          { email: identifier }
        ]
      }
    });
  },

  async createUser(userData) {
    const { role, ...userFields } = userData;

    const user = await User.create(userFields);

    await Role.create({
      role: role,
      userId: user.id
    });

    return { user, role: roleRecord };
  },

  async findUserById(id) {
    return await User.findByPk(id);
  },

  async createRole(userId, role) {
    return await Role.create({ userId, role });
  },

  async getRolesByUserId(userId) {
    return await Role.findAll({ where: { userId } });
  },

  async updateRole(userId, newRole) {
    const roleRecord = await Role.findOne({ where: { userId } });
    if (roleRecord) {
      return await roleRecord.update({ role: newRole });
    } else {
      return await Role.create({ userId, role: newRole });
    }
  },

  async deleteRole(userId) {
    return await Role.destroy({ where: { userId } });
  },

  async updateUser(id, data) {
    const user = await User.findByPk(id);
    if (!user) return null;
    if (data.role) {
      const roleRecord = await Role.findOne({ where: { userId: user.id } });
      if (roleRecord) {
        await roleRecord.update({ role: data.role });
      } else {
        await Role.create({ role: data.role, userId: user.id });
      }
    }
    delete data.role;

    return await user.update(data);

  },

  async deleteUser(id) {
    return await User.destroy({ where: { id } });

  },

  async findAllUsers() {
    return await User.findAll({
      include: [{
        model: Role,
        where: {
          role: ['renter', 'owner']
        }
      }]
    });

  },

  async findUsersByParams(params) {

    const include = [];

    if (params.role) {
      include.push({
        model: Role,
        where: { role: params.role }
      });
    }

    const where = {};

    if (params.username) {
      where.username = { [Op.like]: `%${params.username}%` };
    }
    if (params.email) {
      where.email = { [Op.like]: `%${params.email}%` };
    }

    return await User.findAll({ where, include });

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
  }

};

module.exports = userService;