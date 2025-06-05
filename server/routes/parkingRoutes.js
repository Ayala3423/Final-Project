const express = require('express');
const router = express.Router();
const parkingController = require('../controllers/parkingController');
const { verifyToken } = require('../middleware/authMiddleware');

router.use(verifyToken);
router.get('/search', parkingController.searchParkings);
console.log('Parking search route loaded');
router.route('/:id')
    .get(parkingController.getParkingById)
    .put(parkingController.updateParking)
    .delete(parkingController.deleteParking)
console.log('Parking routes loaded');

router.route('/')
  
    .post(parkingController.createParking)
      .all(parkingController.getAllParking);

module.exports = router;