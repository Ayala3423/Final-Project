const express = require('express');
const router = express.Router();
const parkingController = require('../controllers/parkingController');
const { verifyToken } = require('../middleware/authMiddleware');
const { createUploadMiddleware } = require('../middleware/upload');

// העלאת תמונה לתיקיית uploads/parking
const upload = createUploadMiddleware('parking');

// --- ראוטים פתוחים ללא התחברות ---
router.get('/search', parkingController.searchParkings);
router.get('/', parkingController.getParkingsByParams);

// --- כל מה שמכאן ואילך דורש התחברות ---
router.use(verifyToken);

// יצירת חניה (כולל תמונה)
router.post('/', upload.single('image'), parkingController.createParking);

// קבלת כל החניות (למשתמש מחובר בלבד)

// פעולות לפי מזהה
router.route('/:id')
    .get(parkingController.getParkingById)
    .put(parkingController.updateParking)
    .delete(parkingController.deleteParking);

router.get('/all', parkingController.getAllParking);

module.exports = router;
