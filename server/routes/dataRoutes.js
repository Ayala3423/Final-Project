const express = require('express');
const router = express.Router();
const dataController = require('../controllers/dataController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/dashboard', verifyToken, dataController.getDashboardData);

module.exports = router;
