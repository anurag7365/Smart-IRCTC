const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings, cancelBooking, getBookingByPNR } = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, createBooking);
router.route('/mybookings').get(protect, getMyBookings);
router.route('/:id/cancel').put(protect, cancelBooking);
router.route('/pnr/:pnr').get(getBookingByPNR);

module.exports = router;
