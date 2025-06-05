const { Sequelize } = require('sequelize');
const sequelize = require('./config/sequelize');
const TimeSlot = require('./models/TimeSlot');

async function createFixedTimeSlots() {
  const parkingIds = Array.from({ length: 218 }, (_, i) => i + 1); // IDs 1-218

  const dayOfWeek = 'sunday';
  const startTime = '08:00:00';
  const endTime = '18:00:00';
  const price = 20;

  const timeSlots = parkingIds.map(id => ({
    parkingId: id,
    type: 'fixed',
    dayOfWeek,
    startTime,
    endTime,
    price,
    isRented: false,
    date: null,
    recurrence: 'weekly'
  }));

  try {
    await sequelize.sync(); // ודא שהטבלאות קיימות
    await TimeSlot.bulkCreate(timeSlots);
    console.log('TimeSlots created successfully!');
  } catch (error) {
    console.error('Error creating TimeSlots:', error);
  } finally {
    await sequelize.close();
  }
}

createFixedTimeSlots();
