const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Reservation = sequelize.define('Reservation', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  renterId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  ownerId: {
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
    allowNull: false,
    references: {
      model: 'Parkings',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  timeSlotId: {
    type: DataTypes.INTEGER,
    allowNull: true, // <- שונה ל-nullable
    references: {
      model: 'TimeSlots',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  startTime: {
    type: DataTypes.DATE,
    allowNull: false
  },
  endTime: {
    type: DataTypes.DATE,
    allowNull: false
  },
  totalPrice: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  reservationDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'Reservations',
  paranoid: true, 
    timestamps: true 
});

module.exports = Reservation;