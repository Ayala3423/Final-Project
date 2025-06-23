const express = require('express');
const router = express.Router();
const paymentsController = require('../controllers/paymentController');

router.post('/confirm', paymentsController.confirmPayment);

module.exports = router;