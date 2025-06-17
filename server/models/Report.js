const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Report = sequelize.define('Report', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  reporterId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  reportedUserId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  parkingId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Parkings',
      key: 'id'
    },
    onDelete: 'SET NULL'
  },
  rating: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: 0,
      max: 5
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'Reports',
   paranoid: true, 
    timestamps: true 
});

module.exports = Report;