const cron = require('node-cron');
const genericService = require('../services/genericService');

cron.schedule('0 3 * * *', async () => {
    console.log('Starting purge job...');
    try {
        await genericService.purgeSoftDeletes();
    } catch (err) {
        console.error('Error during purge:', err);
    }
});