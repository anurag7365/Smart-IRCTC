const mongoose = require('mongoose');

const stationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
    },
    location: {
        type: String, // City or Region
    },
    state: {
        type: String,
        required: true,
        default: 'India'
    },
    zone: {
        type: String, // e.g., NR, WR, SR
        required: true,
        default: 'IR'
    },
    latitude: {
        type: Number,
    },
    longitude: {
        type: Number,
    },

}, {
    timestamps: true,
});

const Station = mongoose.model('Station', stationSchema);

module.exports = Station;
