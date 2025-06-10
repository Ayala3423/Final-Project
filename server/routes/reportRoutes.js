const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { verifyToken } = require('../middleware/authMiddleware');
router.route('/')
    .get(reportController.getReportsByParkingId)
router.use(verifyToken);
router.route('/check').get(reportController.checkReportPermission);
router.route('/:id')
    .get(reportController.getReportById)
    .put(reportController.updateReport)
    .delete(reportController.deleteReport);

router.route('/')
    .post(reportController.createReport)
    .all(reportController.getAllReports)
    ;

module.exports = router;