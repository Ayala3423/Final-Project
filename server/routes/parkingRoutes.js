const express = require('express');
const router = express.Router();
const parkingController = require('../controllers/parkingController');
const { verifyToken } = require('../middleware/authMiddleware');
const { createUploadMiddleware } = require('../middleware/upload');

const upload = createUploadMiddleware('parking');

router.get('/search', parkingController.searchParkings);
router.get('/', parkingController.getParkingsByParams);
router.get('/top-popular', parkingController.getTopPopularParkings);

router.use(verifyToken);

router.post('/', upload.single('image'), parkingController.createParking);

router.route('/:id')
    .get(parkingController.getParkingById)
    .put(parkingController.updateParking)
    .delete(parkingController.deleteParking);

router.get('/all', parkingController.getAllParking);

module.exports = router;
