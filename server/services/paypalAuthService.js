const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const CLIENT = process.env.PAYPAL_CLIENT_ID;
const SECRET = process.env.PAYPAL_SECRET;

exports.getPayPalAccessToken = async () => {
  const auth = Buffer.from(`${CLIENT}:${SECRET}`).toString('base64');
  const res = await fetch('https://api-m.paypal.com/v1/oauth2/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials'
  });
  const data = await res.json();
  return data.access_token;
};