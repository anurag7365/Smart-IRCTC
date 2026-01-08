const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
    number: {
        type: Number,
        required: true,
    },
    berth: {
        type: String,
        enum: ['Lower', 'Middle', 'Upper', 'Side Lower', 'Side Upper', 'Chair', 'Window', 'Aisle', 'Cabin', 'Coupe'],
        required: true,
    },
    isBooked: {
        type: Boolean,
        default: false,
    },
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
    },
    gender: {
        type: String, // 'Male' or 'Female', useful for smart allocation logic
    },
});

const coachSchema = new mongoose.Schema({
    trainId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Train',
        required: true,
    },
    code: {
        type: String, // e.g., S1, A1
        required: true,
    },
    type: {
        type: String, // e.g., SL, 3A, 2A, 1A
        required: true,
    },
    seats: [seatSchema],
}, {
    timestamps: true,
});

const Coach = mongoose.model('Coach', coachSchema);

module.exports = Coach;
