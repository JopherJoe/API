const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const app = express();

// get config vars
dotenv.config();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Import route files
const userRoutes = require('./api/user.routes');
const packageRoutes = require('./api/package.routes');
const bookingRoutes = require('./api/booking.routes');
// Use route middleware
app.use('/users', userRoutes);
app.use('/packages', packageRoutes);
app.use('/bookings', bookingRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});

const PORT = process.env.PORT // Use environment variable or 5000 as the default port
app.listen(PORT, `0.0.0.0`,() => {
  console.log(`Server is running on port ${PORT}`);
});