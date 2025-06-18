const cron = require('node-cron');
const genericService = require('../services/genericService');
const { Parking, Reservation, User } = require('../models');  // נניח שככה אתה מייבא את המודלים

cron.schedule('56 22 * * *', async () => {
    console.log('Running scheduled notifications at 22:56...');

    try {
        // קודם כל: שליחת ההתראות הרגילות
        await genericService.sendAutoNotifications();
        console.log('Notifications sent successfully.');

        // עכשיו נבצע את בדיקת ההשכרות הישנות
        const THRESHOLD_DAYS = 30;  // לדוגמה: 30 ימים

        const allParkings = await Parking.findAll();

        for (const parking of allParkings) {
            // נבדוק מתי ההזמנה האחרונה
            const lastReservation = await Reservation.findOne({
                where: { parkingId: parking.id },
                order: [['startTime', 'DESC']]
            });

            let daysSinceLastReservation;
            if (!lastReservation) {
                // לא הוזמנה בכלל
                daysSinceLastReservation = Infinity;
            } else {
                const lastDate = new Date(lastReservation.startTime);
                const now = new Date();
                const diffTime = now - lastDate;
                daysSinceLastReservation = diffTime / (1000 * 60 * 60 * 24);
            }

            if (daysSinceLastReservation > THRESHOLD_DAYS) {
                const owner = await User.findByPk(parking.ownerId);
                if (owner) {
                    await genericService.sendNotification({
                        userId: owner.id,
                        message: `החניה בכתובת ${parking.address} לא הושכרה מזה ${Math.floor(daysSinceLastReservation)} ימים. אולי כדאי לעדכן זמינות או מחיר.`
                    });
                    console.log(`Notification sent to owner ${owner.id} for parking ${parking.id}`);
                }
            }
        }

    } catch (err) {
        console.error('Error sending notifications:', err);
    }
});
