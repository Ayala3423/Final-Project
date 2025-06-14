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
  parkingId: { // הוספתי את העמודה
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
    allowNull: false,
    references: {
      model: 'TimeSlots',
      key: 'id'
    },
    onDelete: 'CASCADE'
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
  timestamps: false
});

module.exports = Reservation;
