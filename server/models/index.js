const User = require('./User');
const Parking = require('./Parking');
const TimeSlot = require('./TimeSlot');
const Reservation = require('./Reservation');
const Report = require('./Report');
const Message = require('./Message');
const Passwords = require('./Passwords');

// Users - Parkings (משכיר הוא בעל חניה)
User.hasMany(Parking, { foreignKey: 'ownerId', as: 'Parkings' });
Parking.belongsTo(User, { foreignKey: 'ownerId', as: 'Owner' });

// Users - TimeSlots (הזמנים שקשורים לחניה של המשכיר)
TimeSlot.belongsTo(Parking, { foreignKey: 'parkingId' });
Parking.hasMany(TimeSlot, { foreignKey: 'parkingId' });

// Users - Reservations
User.hasMany(Reservation, { foreignKey: 'renterId', as: 'RenterReservations' });
User.hasMany(Reservation, { foreignKey: 'ownerId', as: 'OwnerReservations' });
Reservation.belongsTo(User, { foreignKey: 'renterId', as: 'Renter' });
Reservation.belongsTo(User, { foreignKey: 'ownerId', as: 'Owner' });

// Reservations - TimeSlots
TimeSlot.hasMany(Reservation, { foreignKey: 'timeSlotId' });
Reservation.belongsTo(TimeSlot, { foreignKey: 'timeSlotId' });

// Users - Reports (דיווחים בין משתמשים)
User.hasMany(Report, { foreignKey: 'reporterId', as: 'SentReports' });
User.hasMany(Report, { foreignKey: 'reportedUserId', as: 'ReceivedReports' });
Report.belongsTo(User, { foreignKey: 'reporterId', as: 'Reporter' });
Report.belongsTo(User, { foreignKey: 'reportedUserId', as: 'ReportedUser' });

// Reports - Parkings (דיווח על חניה)
Parking.hasMany(Report, { foreignKey: 'parkingId' });
Report.belongsTo(Parking, { foreignKey: 'parkingId' });

// Messages - Users (הודעות בין משתמשים)
User.hasMany(Message, { foreignKey: 'senderId', as: 'SentMessages' });
User.hasMany(Message, { foreignKey: 'receiverId', as: 'ReceivedMessages' });
Message.belongsTo(User, { foreignKey: 'senderId', as: 'Sender' });
Message.belongsTo(User, { foreignKey: 'receiverId', as: 'Receiver' });
// Passwords - Users (ניהול סיסמאות)
User.hasOne(Passwords, { foreignKey: 'userId', as: 'Password' });
Passwords.belongsTo(User, { foreignKey: 'userId', as: 'User' });

module.exports = {
  User,
  Parking,
  TimeSlot,
  Reservation,
  Report,
  Message,
  Passwords
};