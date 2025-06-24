const express = require('express');
const router = express.Router();
const paymentsController = require('../controllers/paymentController');

router.post('/confirm', paymentsController.confirmPayment);
router.post('/refund/:id', paymentsController.refundPayment);

module.exports = router;