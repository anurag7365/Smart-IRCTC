const mongoose = require('mongoose');

const stopSchema = new mongoose.Schema({
    station: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Station',
        required: true,
    },
    arrivalTime: {
        type: String, // HH:mm format
        required: true,
    },
    departureTime: {
        type: String, // HH:mm format
        required: true,
    },
    distanceFromSource: {
        type: Number, // in km
        required: true,
    },
});

const trainSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    number: {
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
    daysOfOperation: {
        type: [String], // e.g., ['Mon', 'Wed', 'Fri']
        required: true,
    },
    route: [stopSchema], // Intermediate stops
    classes: {
        type: [String], // e.g., ['SL', '3A', '2A']
        required: true,
    },
}, {
    timestamps: true,
});

const Train = mongoose.model('Train', trainSchema);

module.exports = Train;
