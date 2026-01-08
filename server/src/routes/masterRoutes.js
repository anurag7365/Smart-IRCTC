const express = require('express');
const router = express.Router();
const { getStations, createStation, getStationById } = require('../controllers/stationController');
const { getTrains, createTrain, searchTrains, getTrainCoaches } = require('../controllers/trainController');
const { protect, admin } = require('../middleware/authMiddleware');

// Station Routes
router.route('/stations').get(getStations).post(protect, admin, createStation);
router.route('/stations/:id').get(getStationById);

// Train Routes
router.route('/trains').get(getTrains).post(protect, admin, createTrain);
router.route('/trains/search').get(searchTrains);
router.route('/trains/:id/coaches').get(getTrainCoaches);

module.exports = router;
