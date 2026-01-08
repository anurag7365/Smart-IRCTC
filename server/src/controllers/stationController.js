const Station = require('../models/Station');

// @desc    Get all stations
// @route   GET /api/stations
// @access  Public
const getStations = async (req, res) => {
    try {
        const stations = await Station.find({});
        res.json(stations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a station
// @route   POST /api/stations
// @access  Private/Admin
const createStation = async (req, res) => {
    const { name, code, location } = req.body;

    try {
        const stationExists = await Station.findOne({ code });

        if (stationExists) {
            return res.status(400).json({ message: 'Station already exists' });
        }

        const station = await Station.create({
            name,
            code,
            location,
        });

        res.status(201).json(station);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get station by ID
// @route   GET /api/stations/:id
// @access  Public
const getStationById = async (req, res) => {
    try {
        const station = await Station.findById(req.params.id);
        if (station) {
            res.json(station);
        } else {
            res.status(404).json({ message: 'Station not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getStations, createStation, getStationById };
