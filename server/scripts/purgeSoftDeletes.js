const { Op } = require('sequelize');
const db = require('../models');

async function purgeSoftDeletes() {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 30);

    await db.User.destroy({ where: { deletedAt: { [Op.lte]: cutoffDate } }, force: true });
    await db.Parking.destroy({ where: { deletedAt: { [Op.lte]: cutoffDate } }, force: true });
    await db.Message.destroy({ where: { deletedAt: { [Op.lte]: cutoffDate } }, force: true });
    await db.Report.destroy({ where: { deletedAt: { [Op.lte]: cutoffDate } }, force: true });
    await db.Reservation.destroy({ where: { deletedAt: { [Op.lte]: cutoffDate } }, force: true });
    await db.TimeSlot.destroy({ where: { deletedAt: { [Op.lte]: cutoffDate } }, force: true });

    // הוסיפי עוד מודלים לפי הצורך

    console.log('Purge done');
}

module.exports = purgeSoftDeletes;
