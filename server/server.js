const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
connectDB();

const authRoutes = require('./src/routes/authRoutes');
const masterRoutes = require('./src/routes/masterRoutes');
const bookingRoutes = require('./src/routes/bookingRoutes');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', require('./src/routes/userRoutes'));
app.use('/api', masterRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/fares', require('./src/routes/fareRoutes'));
app.get('/', (req, res) => {
    res.send('SmartIRCTC Backend is running');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
