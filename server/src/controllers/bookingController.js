const Booking = require('../models/Booking');
const Coach = require('../models/Coach');
const { allocateSeats } = require('../utils/seatAllocation');

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
    const {
        trainId,
        source,
        destination,
        journeyDate,
        classType,
        passengers, // Array of { name, age, gender }
        contactDetails,
        totalAmount
    } = req.body;

    try {
        // 1. Run Smart Seat Allocation
        // This function returns the passengers with assigned seats and the modified coach objects
        const { allocatedPassengers, coaches } = await allocateSeats(passengers, trainId, classType);

        // 2. Save Updated Coach Data (Mark seats as booked)
        // In a real app, use a Transaction (Session) for atomicity
        for (const coach of coaches) {
            await coach.save();
        }

        // 3. Generate PNR (Simple Random String for MVP)
        const pnr = Math.floor(1000000000 + Math.random() * 9000000000).toString();

        // 4. Create Booking Record
        const booking = await Booking.create({
            user: req.user._id,
            train: trainId,
            pnr,
            source,
            destination,
            journeyDate,
            classType,
            passengers: allocatedPassengers,
            totalAmount,
            contactDetails,
            status: 'Booked'
        });

        // Populate for frontend
        const populatedBooking = await Booking.findById(booking._id)
            .populate('train', 'name number route')
            .populate('source', 'name code')
            .populate('destination', 'name code');

        res.status(201).json(populatedBooking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get logged in user bookings
// @route   GET /api/bookings/mybookings
// @access  Private
const getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id })
            .populate('train', 'name number')
            .populate('source', 'name code')
            .populate('destination', 'name code');

        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Cancel a booking
// @route   POST /api/bookings/:id/cancel
// @access  Private
const cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Check if user owns transaction
        if (booking.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        if (booking.status === 'Cancelled') {
            return res.status(400).json({ message: 'Booking is already cancelled' });
        }

        booking.status = 'Cancelled';

        // Return seats to pool (Simplified: just mark passenger status)
        // In a real app, update Coach model 'isBooked' status back to false
        booking.passengers.forEach(p => p.status = 'Cancelled');

        await booking.save();

        res.json({ message: 'Booking Cancelled Successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get booking by PNR
// @route   GET /api/bookings/pnr/:pnr
// @access  Public
const getBookingByPNR = async (req, res) => {
    try {
        const booking = await Booking.findOne({ pnr: req.params.pnr })
            .populate('train', 'name number')
            .populate('source', 'name code')
            .populate('destination', 'name code');

        if (!booking) {
            return res.status(404).json({ message: 'PNR not found' });
        }

        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createBooking, getMyBookings, cancelBooking, getBookingByPNR };
