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

}, {
    timestamps: true,
});

const Station = mongoose.model('Station', stationSchema);

module.exports = Station;
