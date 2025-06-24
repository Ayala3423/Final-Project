const redis = require('redis');

const redisClient = redis.createClient({
  url: 'redis://localhost:6379'
});

let isConnected = false;

redisClient.on('error', (err) => console.error('❌ Redis Error:', err));

async function connectRedis() {
  if (!isConnected) {
    await redisClient.connect();
    isConnected = true;
    console.log('✅ Connected to Redis');
  }
}

module.exports = {
  redisClient,
  connectRedis
};