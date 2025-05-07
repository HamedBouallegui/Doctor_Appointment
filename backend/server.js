const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');
require('dotenv').config();

// Initialize Express
const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(express.json({ extended: false }));
app.use(cors({
  origin: 'http://localhost:4200', // Your Angular app's URL
  credentials: true
}));

// Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/appointments', require('./routes/api/appointments'));

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static(path.join(__dirname, '../Appointment/dist/appointment')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../Appointment/dist/appointment', 'index.html'));
  });
}

const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`Port ${PORT} is busy, trying ${PORT + 1}...`);
    server.close();
    app.listen(PORT + 1, () => {
      console.log(`Server running on port ${PORT + 1}`);
    });
  } else {
    console.error(err);
  }
});