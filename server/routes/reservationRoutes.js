const express = require('express');
const router = express.Router();
const { reservationController } = require('../controllers/reservationController');
const { verifyToken } = require('../middleware/authMiddleware');

router.use(verifyToken);

router.route('/:id')
    .get(reservationController.getReservationById)
    .put(reservationController.updateReservation)
    .delete(reservationController.deleteReservation);

router.route('/')
    .all(reservationController.getAllReservations)
    .post(reservationController.createReservation);

module.exports = router;