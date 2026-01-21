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

// Routes
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/users', require('./src/routes/userRoutes'));
app.use('/api', require('./src/routes/masterRoutes'));
app.use('/api/bookings', require('./src/routes/bookingRoutes'));
app.use('/api/fares', require('./src/routes/fareRoutes'));
app.use('/api/admin', require('./src/routes/adminRoutes'));
app.get('/', (req, res) => {
    res.send('SmartIRCTC Backend is running');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
