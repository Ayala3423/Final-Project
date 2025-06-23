const express = require('express');
const router = express.Router();
const  timeSlotController  = require('../controllers/timeSlotController');
const { verifyToken } = require('../middleware/authMiddleware');

router.route('/')
    .get(timeSlotController.getTimeSlotsByParkingId)

router.use(verifyToken);

router.route('/:id')
    .get(timeSlotController.getTimeSlotById)
    .put(timeSlotController.updateTimeSlot)
    .delete(timeSlotController.deleteTimeSlot);

router.route('/')
    .post(timeSlotController.createTimeSlot)
    .all(timeSlotController.getAllTimeSlots);
    
module.exports = router;