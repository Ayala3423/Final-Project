const cron = require('node-cron');
const genericService = require('../services/genericService');
const userService = require('../services/userService');
const emailService = require('../services/emailService');
const { Op } = require('sequelize');

const THRESHOLD_DAYS = 30;

const runScheduledNotifications = async () => {
  console.log('Running scheduled notifications at 22:56...');

  try {
    await genericService.sendAutoNotifications();
    console.log('Auto notifications sent.');

    await sendInactiveParkingAlerts();
    await sendUnreadNotificationEmails();

    console.log('All notifications completed.');
  } catch (err) {
    console.error('Error during scheduled notifications:', err);
  }
};

const sendInactiveParkingAlerts = async () => {
  const allParkings = await genericService.getAll('Parking');

  for (const parking of allParkings) {
    const reservations = await genericService.getByParams('Reservation', {
      parkingId: parking.id
    });

    const lastReservation = reservations.sort((a, b) => new Date(b.startTime) - new Date(a.startTime))[0];
    const now = new Date();
    const lastDate = lastReservation ? new Date(lastReservation.startTime) : null;
    const daysSince = lastDate ? (now - lastDate) / (1000 * 60 * 60 * 24) : Infinity;

    if (daysSince > THRESHOLD_DAYS) {
      const owner = await userService.findUserById(parking.ownerId);
      if (owner) {
        const message = `החניה בכתובת ${parking.address} לא הושכרה מזה ${Math.floor(daysSince)} ימים. אולי כדאי לעדכן זמינות או מחיר.`;
        await genericService.sendNotification(owner.id, message);
        console.log(`Notification sent to owner ${owner.id} for parking ${parking.id}`);
      }
    }
  }
};

const sendUnreadNotificationEmails = async () => {
  const thresholdDate = new Date();
  thresholdDate.setDate(thresholdDate.getDate() - THRESHOLD_DAYS);

  const oldUnread = await genericService.getAdvanced('Notification', {
    read: false,
    createdAt: { [Op.lt]: thresholdDate }
  }, 'User');

  for (const notification of oldUnread) {
    const user = notification.User;
    if (user?.email) {
      await emailService.sendEmail({
        to: user.email,
        subject: 'תזכורת: יש לך התראות שלא נקראו',
        text: 'יש לך התראות שלא נקראו כבר יותר מחודש באתר RentBro. מומלץ להיכנס ולבדוק!'
      });
      console.log(`Reminder email sent to user ${user.id}`);
    }
  }
};

cron.schedule('56 22 * * *', runScheduledNotifications);

module.exports = { runScheduledNotifications };