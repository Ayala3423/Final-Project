const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Resource = sequelize.define('Resource', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true
  },
  method: {
  type: DataTypes.STRING,
  allowNull: false
}
}, {
  tableName: 'Resource',
  paranoid: true,
  timestamps: true
});

module.exports = Resource;
