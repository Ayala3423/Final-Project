const reservationBL = require('../bl/reservationBL');

confirmPayment = async (req, res) => {
  const { orderID, reservationData } = req.body;

  try {
    await reservationBL.confirmPaymentAndPayout(orderID, reservationData);
    res.status(200).json({ message: 'Payment confirmed and payout sent.' });
  } catch (err) {
    console.error('Error confirming payment:', err);
    res.status(500).json({ error: 'Payment confirmation failed.' });
  }
};

refundPayment = async (req, res) => {
  const reservationId = req.params.id;

  try {
    await reservationBL.refundPaymentAndPayout(reservationId);
    res.status(200).json({ message: 'Payment confirmed and payout sent.' });
  } catch (err) {
    console.error('Error confirming payment:', err);
    res.status(500).json({ error: 'Payment confirmation failed.' });
  }
}

module.exports = { confirmPayment, refundPayment };