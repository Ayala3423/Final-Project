const express = require('express');
const router = express.Router();
const { reportController } = require('../controllers/reportController');
const { verifyToken } = require('../middleware/authMiddleware');

router.use(verifyToken);

router.route('/:id')
    .get(reportController.getReportById)
    .put(reportController.updateReport)
    .delete(reportController.deleteReport);

router.route('/')
    .all(reportController.getAllReports)
    .post(reportController.createReport);

module.exports = router;