const express = require('express');
const dotenv = require('dotenv');
const sequelize = require('./config/sequelize'); 
require('./models/index'); 
const cors = require('cors');
dotenv.config();
const path = require('path');

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

sequelize.sync({ alter: true }) 
  .then(() => {
    console.log('DB connected and synced');
    
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('DB sync failed:', err);
  });