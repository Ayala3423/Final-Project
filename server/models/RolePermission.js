const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const RolePermission = sequelize.define('RolePermission', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  roleId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Role',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  permissionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Resource',
      key: 'id'
    },
    onDelete: 'CASCADE'
  }
}, {
  tableName: 'RolePermission',
  paranoid: true,
  timestamps: true
});

module.exports = RolePermission;