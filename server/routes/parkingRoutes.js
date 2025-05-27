const express = require('express');
const router = express.Router();
const { parkingController } = require('../controllers/parkingController');
const { verifyToken } = require('../middleware/authMiddleware');

router.use(verifyToken);

router.route('/:id')
    .get(parkingController.getByParkingId)
    .put(parkingController.updateParking)
    .delete(parkingController.deleteParking);

router.route('/')
    .all(parkingController.getAllParkings)
    .post(parkingController.createParking);

module.exports = router;