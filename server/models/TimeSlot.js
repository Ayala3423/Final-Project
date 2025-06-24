const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const TimeSlot = sequelize.define('TimeSlot', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  parkingId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Parkings',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  type: {
    type: DataTypes.ENUM('temporary', 'fixed'),
    allowNull: false
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: true  
  },
  dayOfWeek: {
    type: DataTypes.ENUM('sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'),
    allowNull: true 
  },
  recurrence: {
    type: DataTypes.ENUM('none', 'daily', 'weekly', 'monthly'),
    allowNull: true 
  },
  startTime: {
    type: DataTypes.TIME,
    allowNull: false
  },
  endTime: {
    type: DataTypes.TIME,
    allowNull: false
  },
  isRented: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  }, 
  isAllowSubReservations: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },

}, {
  tableName: 'TimeSlots',
  paranoid: true,
  timestamps: true
});

module.exports = TimeSlot;