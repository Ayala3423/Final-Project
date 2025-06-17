const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

require('./models/index');

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use("/parkings", require("./routes/parkingRoutes"));
app.use("/users", require("./routes/userRoutes"));
app.use("/timeSlots", require("./routes/timeSlotRoutes"));
app.use("/reservations", require("./routes/reservationRoutes"));
app.use("/reports", require("./routes/reportRoutes"));
app.use("/messages", require("./routes/messageRoutes"));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:3000"],
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('🔌 New client connected: ' + socket.id);
  socket.on('sendMessage', (messageData) => {
    console.log('📨 New message: ', messageData);
    io.emit('receiveMessage', messageData);
  });

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected: ' + socket.id);
  });

  socket.on('typing', ({ conversationId, senderId }) => {
    socket.broadcast.emit('userTyping', { conversationId, senderId });
  });

  socket.on('messageRead', ({ conversationId, messageIds }) => {
    io.emit('messagesRead', { conversationId, messageIds });
  });
});

app.set('io', io);

// מפעיל את השרת (רק כאן)
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});