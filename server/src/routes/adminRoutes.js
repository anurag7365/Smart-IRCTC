const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const User = require('../models/User');
const Booking = require('../models/Booking');
const Train = require('../models/Train');

// @desc    Get system stats
// @route   GET /api/admin/stats
// @access  Private/Admin
router.get('/stats', protect, admin, async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const trainCount = await Train.countDocuments();
        const bookingCount = await Booking.countDocuments();

        // Calculate total revenue
        const bookings = await Booking.find({ status: { $ne: 'Cancelled' } });
        const revenue = bookings.reduce((acc, booking) => acc + (booking.totalAmount || 0), 0);

        res.json({
            users: userCount,
            trains: trainCount,
            bookings: bookingCount,
            revenue: revenue
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
router.get('/users', protect, admin, async (req, res) => {
    try {
        const users = await User.find({}).select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get all bookings (including transaction details)
// @route   GET /api/admin/bookings
// @access  Private/Admin
router.get('/bookings', protect, admin, async (req, res) => {
    try {
        const bookings = await Booking.find({})
            .populate('user', 'name email')
            .populate('train', 'name number')
            .populate('source', 'name code')
            .populate('destination', 'name code')
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
