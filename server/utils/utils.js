const axios = require('axios');
const jwt = require('jsonwebtoken');

async function getCoordinatesFromAddress(address) {
  try {
    console.log('Fetching coordinates for address:', address);
    
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: address,
        format: 'json',
        addressdetails: 1,
        limit: 1
      },
      headers: {
        'User-Agent': 'MyApp' // חובה לפי תנאי Nominatim
      }
    });

    if (response.data.length === 0) {
      throw new Error('Address not found');
    }

    const { lat, lon } = response.data[0];
    return {
      latitude: parseFloat(lat),
      longitude: parseFloat(lon)
    };
  } catch (error) {
    console.error('Geocoding error:', error.message);
    throw error;
  }
}

function generateToken(payload) {
    console.log('Generating token with payload:', payload);
  if (!process.env.JWT_SECRET) {    
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
    
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '1h'
  });
}

module.exports = { getCoordinatesFromAddress, generateToken };