const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const cron = require('node-cron');
const { redisClient, connectRedis } = require('./utils/redisClient');
const { generateToken } = require('./utils/utils');
const purgeSoftDeletes = require('./scripts/purgeSoftDeletes');
require('./scripts/notificationScheduler');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

cron.schedule('0 3 1 * *', () => {
  console.log('Starting monthly purge at', new Date());
  purgeSoftDeletes()
    .then(() => console.log('Purge completed'))
    .catch(console.error);
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/parkings', require('./routes/parkingRoutes'));
app.use('/users', require('./routes/userRoutes'));
app.use('/timeSlots', require('./routes/timeSlotRoutes'));
app.use('/reservations', require('./routes/reservationRoutes'));
app.use('/reports', require('./routes/reportRoutes'));
app.use('/messages', require('./routes/messageRoutes'));
app.use('/data', require('./routes/dataRoutes'));
app.use('/payments', require('./routes/paymentRoutes'));

app.post('/api/refresh-token', (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token missing' });
  }

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    const accessToken = generateToken({ id: decoded.userId, role: decoded.role });
    res.json({ accessToken });
  });
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('🔌 New client connected:', socket.id);

  // קבלת userId מהלקוח אחרי ההתחברות
  socket.on('authenticate', async ({ userId }) => {
    socket.userId = userId;

    try {
      await redisClient.sAdd(`user:${userId}:sockets`, socket.id);
      console.log(`✅ Added socket ${socket.id} for user ${userId}`);
    } catch (err) {
      console.error('Redis error on authenticate:', err);
    }
  });

  socket.on('sendMessage', (messageData) => {
    console.log('📨 New message: ', messageData);
    io.emit('receiveMessage', messageData);
  });

  socket.on('typing', ({ conversationId, senderId }) => {
    socket.broadcast.emit('userTyping', { conversationId, senderId });
  });

  socket.on('messageRead', ({ conversationId, messageIds }) => {
    io.emit('messagesRead', { conversationId, messageIds });
  });

  socket.on('disconnect', async () => {
    const userId = socket.userId;
    if (userId) {
      try {
        await redisClient.sRem(`user:${userId}:sockets`, socket.id);
        console.log(`🧹 Removed socket ${socket.id} for user ${userId}`);
      } catch (err) {
        console.error('Redis error on disconnect:', err);
      }
    }
    console.log('❌ Client disconnected:', socket.id);
  });
});

app.set('io', io);

const PORT = process.env.PORT || 3000;

(async () => {
  await connectRedis(); // רק פעם אחת!
  server.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
})();