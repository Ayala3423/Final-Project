// services/payoutService.js
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const { findUserById } = require('../services/userService'); // תכף נעשה את זה

exports.sendToOwner = async (ownerId, amount, accessToken) => {
  const owner = await findUserById(ownerId);
  if (!owner || !owner.paypalEmail) {
    throw new Error('Owner PayPal email not found');
  }

  const body = {
    sender_batch_header: {
      sender_batch_id: 'batch-' + Date.now(),
      email_subject: 'You have received a payout!'
    },
    items: [{
      recipient_type: 'EMAIL',
      amount: {
        value: amount.toFixed(2),
        currency: 'ILS'
      },
      receiver: owner.paypalEmail,
      note: 'Thanks for your parking service!'
    }]
  };

  const res = await fetch('https://api-m.paypal.com/v1/payments/payouts', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  const data = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(data));
};
