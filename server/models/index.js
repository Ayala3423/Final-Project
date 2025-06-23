const User = require('./User');
const Parking = require('./Parking');
const TimeSlot = require('./TimeSlot');
const Reservation = require('./Reservation');
const Report = require('./Report');
const Message = require('./Message');
const Passwords = require('./Passwords');
const Role = require('./Role');
const Resource = require('./Resource');
const RolePermission = require('./RolePermission');
const sequelize = require('../config/sequelize');

User.hasMany(Parking, { foreignKey: 'ownerId', as: 'Parkings' });
Parking.belongsTo(User, { foreignKey: 'ownerId', as: 'Owner' });

TimeSlot.belongsTo(Parking, { foreignKey: 'parkingId' });
Parking.hasMany(TimeSlot, { foreignKey: 'parkingId' });

User.hasMany(Reservation, { foreignKey: 'renterId', as: 'RenterReservations' });
User.hasMany(Reservation, { foreignKey: 'ownerId', as: 'OwnerReservations' });
Reservation.belongsTo(User, { foreignKey: 'renterId', as: 'Renter' });
Reservation.belongsTo(User, { foreignKey: 'ownerId', as: 'Owner' });

TimeSlot.hasMany(Reservation, { foreignKey: 'timeSlotId' });
Reservation.belongsTo(TimeSlot, { foreignKey: 'timeSlotId' });

User.hasMany(Report, { foreignKey: 'reporterId', as: 'SentReports' });
User.hasMany(Report, { foreignKey: 'reportedUserId', as: 'ReceivedReports' });
Report.belongsTo(User, { foreignKey: 'reporterId', as: 'Reporter' });
Report.belongsTo(User, { foreignKey: 'reportedUserId', as: 'ReportedUser' });

Parking.hasMany(Report, { foreignKey: 'parkingId' });
Report.belongsTo(Parking, { foreignKey: 'parkingId' });

User.hasMany(Message, { foreignKey: 'senderId', as: 'SentMessages' });
User.hasMany(Message, { foreignKey: 'receiverId', as: 'ReceivedMessages' });
Message.belongsTo(User, { foreignKey: 'senderId', as: 'Sender' });
Message.belongsTo(User, { foreignKey: 'receiverId', as: 'Receiver' });

User.hasOne(Passwords, { foreignKey: 'userId', as: 'Password' });
Passwords.belongsTo(User, { foreignKey: 'userId', as: 'User' });

Parking.hasMany(Reservation, { foreignKey: 'parkingId' });
Reservation.belongsTo(Parking, { foreignKey: 'parkingId' });

User.hasOne(Role, { foreignKey: 'userId' });
Role.belongsTo(User, { foreignKey: 'userId' });

Role.belongsToMany(Resource, { through: RolePermission, foreignKey: 'roleId' });
Resource.belongsToMany(Role, { through: RolePermission, foreignKey: 'permissionId' });

sequelize.sync({ alter: true })
  .then(() => {
    console.log('✅ DB connected and synced (from index.js)');
  })
  .catch(err => {
    console.error('❌ DB sync failed (from index.js):', err);
  });

module.exports = { sequelize, Role, User, Parking, TimeSlot, Reservation, Report, Message, Passwords, Resource, RolePermission };