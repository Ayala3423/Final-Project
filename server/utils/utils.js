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
        'User-Agent': 'MyApp' 
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

function haversineDistance(lat1, lon1, lat2, lon2) {
  const toRad = deg => (deg * Math.PI) / 180;
  const R = 6371; 

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
    Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; 
}

function generateToken(payload) {
  console.log('Generating token with payload:', payload);
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '10d'
  });
}

function generateRefreshToken(payload) {
  console.log('Generating token with payload:', payload);
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '30d' });
}

module.exports = { getCoordinatesFromAddress, generateToken, generateRefreshToken, haversineDistance };