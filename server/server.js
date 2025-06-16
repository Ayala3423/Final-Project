const express = require('express');
const dotenv = require('dotenv');
const sequelize = require('./config/sequelize');
require('./models/index');
const cors = require('cors');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

dotenv.config();
const fs = require('fs');
const app = express();
app.use(express.json());
app.use(cors()); 
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use("/parking", require("./routes/parkingRoutes"));
app.use("/user", require("./routes/userRoutes"));
app.use("/timeSlot", require("./routes/timeSlotRoutes"));
app.use("/reservation", require("./routes/reservationRoutes"));
app.use("/report", require("./routes/reportRoutes"));
app.use("/message", require("./routes/messageRoutes"));

// יצירת שרת HTTP
const server = http.createServer(app);

// חיבור socket.io לשרת
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:3000"], // תומך בשניהם
    methods: ["GET", "POST"]
  }
});

// כשהלקוח מתחבר
io.on('connection', (socket) => {
  console.log('🔌 New client connected: ' + socket.id);

  // קבלת הודעה מהלקוח
  socket.on('sendMessage', (messageData) => {
    console.log('📨 New message: ', messageData);

    // שידור ההודעה לכל המשתמשים
    io.emit('receiveMessage', messageData);
  });

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected: ' + socket.id);
  });

  socket.on('typing', ({ conversationId, senderId }) => {
    console.log('✏️ Typing event received:', conversationId, senderId);

    // שידור לכולם חוץ מהשולח
    socket.broadcast.emit('userTyping', { conversationId, senderId });
  });

  socket.on('messageRead', ({ conversationId, messageIds }) => {
    io.emit('messagesRead', { conversationId, messageIds });
  });

});




// שמירת ה-io כדי להשתמש בו גם בראוטים אם תצטרכי
app.set('io', io);

// חיבור למסד
sequelize.sync({ alter: true })
  .then(() => {
    console.log('✅ DB connected and synced');

    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
      console.log(`🚀 Server listening on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ DB sync failed:', err);
  });
