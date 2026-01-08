const mongoose = require('mongoose');

const passengerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true }, // Male, Female, Other
    aadhaar: { type: String, required: true },
    seatNumber: { type: Number }, // Assigned after allocation
    coachId: { type: mongoose.Schema.Types.ObjectId, ref: 'Coach' },
    coachCode: { type: String }, // e.g., S1
    berth: { type: String }, // Assigned berth type
    berthPreference: { type: String, enum: ['Lower', 'Middle', 'Upper', 'Side Lower', 'Side Upper', 'Window', 'Aisle', 'Cabin', 'Coupe', 'No Preference'], default: 'No Preference' },
    isHandicapped: { type: Boolean, default: false },
    status: {
        type: String,
        enum: ['CNF', 'RAC', 'WL', 'CAN'], // Confirmed, RAC, Waiting List, Cancelled
        default: 'WL',
    },
});

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    train: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Train',
        required: true,
    },
    pnr: {
        type: String,
        required: true,
        unique: true,
    },
    source: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Station',
        required: true,
    },
    destination: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Station',
        required: true,
    },
    journeyDate: {
        type: Date,
        required: true,
    },
    classType: {
        type: String,
        required: true,
    },
    passengers: [passengerSchema],
    totalAmount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['Booked', 'Cancelled', 'Completed'],
        default: 'Booked',
    },
    contactDetails: {
        mobile: { type: String, required: true },
        email: { type: String },
    },
}, {
    timestamps: true,
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
