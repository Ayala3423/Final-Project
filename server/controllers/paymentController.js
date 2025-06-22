// controllers/paymentsController.js
const  confirmPaymentAndPayout  = require('../bl/reservationBL');

confirmPayment = async (req, res) => {
  const { orderID, reservationData } = req.body;

  try {
    await confirmPaymentAndPayout(orderID, reservationData);
    res.status(200).json({ message: 'Payment confirmed and payout sent.' });
  } catch (err) {
    console.error('Error confirming payment:', err);
    res.status(500).json({ error: 'Payment confirmation failed.' });
  }
};
module.exports = {confirmPayment};