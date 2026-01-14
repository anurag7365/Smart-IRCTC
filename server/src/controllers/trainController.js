const Train = require('../models/Train');
const Coach = require('../models/Coach');

// @desc    Get all trains
// @route   GET /api/trains
// @access  Public
const getTrains = async (req, res) => {
    try {
        const trains = await Train.find({})
            .populate('source', 'name code')
            .populate('destination', 'name code')
            .populate('route.station', 'name code');
        res.json(trains);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a train
// @route   POST /api/trains
// @access  Private/Admin
const createTrain = async (req, res) => {
    const {
        name,
        number,
        source,
        destination,
        daysOfOperation,
        route,
        classes,
    } = req.body;

    try {
        const trainExists = await Train.findOne({ number });

        if (trainExists) {
            return res.status(400).json({ message: 'Train already exists' });
        }

        const train = await Train.create({
            name,
            number,
            source,
            destination,
            daysOfOperation,
            route,
            classes,
        });

        res.status(201).json(train);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Search trains
// @route   GET /api/trains/search
// @access  Public
const searchTrains = async (req, res) => {
    const { from, to, date } = req.query;

    try {
        // --- 1. DIRECT TRAINS ---
        const trains = await Train.find({
            $and: [
                {
                    $or: [
                        { source: from },
                        { 'route.station': from }
                    ]
                },
                {
                    $or: [
                        { destination: to },
                        { 'route.station': to }
                    ]
                }
            ]
        })
            .populate('source', 'name code')
            .populate('destination', 'name code')
            .populate('route.station', 'name code');

        // Filter valid sequences
        const validTrains = trains.filter(train => {
            let fromIndex = -1;
            let toIndex = -1;

            if (train.source._id.toString() === from) fromIndex = 0;
            else {
                const idx = train.route.findIndex(r => r.station._id.toString() === from);
                if (idx !== -1) fromIndex = idx + 1;
            }

            if (train.destination._id.toString() === to) toIndex = train.route.length + 1;
            else {
                const idx = train.route.findIndex(r => r.station._id.toString() === to);
                if (idx !== -1) toIndex = idx + 1;
            }

            return fromIndex !== -1 && toIndex !== -1 && fromIndex < toIndex;
        });

        if (validTrains.length > 0) {
            return res.json(validTrains.map(t => ({ ...t.toObject(), type: 'DIRECT' })));
        }

        // --- 2. INDIRECT (CONNECTING) TRAINS ---
        // Find trains starting from 'from'
        const startTrains = await Train.find({
            $or: [{ source: from }, { 'route.station': from }]
        })
            .populate('source', 'name code')
            .populate('destination', 'name code')
            .populate('route.station', 'name code');

        // Find trains ending at 'to'
        const endTrains = await Train.find({
            $or: [{ destination: to }, { 'route.station': to }]
        })
            .populate('source', 'name code')
            .populate('destination', 'name code')
            .populate('route.station', 'name code');

        const indirectRoutes = [];

        // Check for common transfer stations
        for (const t1 of startTrains) {
            // Get all possible stops for t1 AFTER the 'from' station
            let startIdx = 0;
            if (t1.source._id.toString() !== from) {
                startIdx = t1.route.findIndex(r => r.station._id.toString() === from) + 1;
            }
            // stops after 'from' including destination
            const t1Stops = t1.route.slice(startIdx).map(r => r.station._id.toString());
            t1Stops.push(t1.destination._id.toString());

            for (const t2 of endTrains) {
                if (t1._id.toString() === t2._id.toString()) continue; // Skip same train

                // Find intersection
                // Potential layover stations: t2 must start (or pass through) these stations BEFORE 'to'

                // Get stops of t2 BEFORE 'to'
                let endLimit = t2.route.length; // destination
                if (t2.destination._id.toString() !== to) {
                    endLimit = t2.route.findIndex(r => r.station._id.toString() === to);
                }

                // Possible transfer points on T2
                const t2StartStops = [];
                if (t2.source._id.toString() !== to) t2StartStops.push(t2.source._id.toString());
                t2.route.slice(0, endLimit).forEach(r => t2StartStops.push(r.station._id.toString()));

                // Find common station
                const commonStationId = t1Stops.find(s => t2StartStops.includes(s));

                if (commonStationId) {
                    // Valid connection found!
                    // Construct a virtual "Journey" object
                    // In a real app we'd check times here
                    const transferStationName = (t1.route.find(r => r.station._id.toString() === commonStationId)?.station.name)
                        || (t1.destination._id.toString() === commonStationId ? t1.destination.name : 'Unknown');

                    indirectRoutes.push({
                        _id: `via_${t1._id}_${t2._id}`,
                        name: `Via ${transferStationName}`,
                        type: 'INDIRECT',
                        train1: t1,
                        train2: t2,
                        transferStation: transferStationName,
                        // Mock fields to match regular train structure for UI
                        number: `${t1.number} + ${t2.number}`,
                        daysOfOperation: t1.daysOfOperation, // Simplified
                        source: t1.source,
                        destination: t2.destination,
                        classes: t1.classes, // Simplified
                        isAlternative: true
                    });
                }
            }
        }

        if (indirectRoutes.length > 0) {
            // Limit to 5 unique options
            return res.json(indirectRoutes.slice(0, 5));
        }

        // --- 3. NEARBY STATIONS ---
        // Find city of source and dest
        const Station = require('../models/Station');
        const sourceStation = await Station.findById(from);
        const destStation = await Station.findById(to);

        if (sourceStation && destStation && sourceStation.location && destStation.location) {
            const nearbyTrains = await Train.find({
                $and: [
                    {
                        $or: [
                            { source: { $in: await Station.find({ location: sourceStation.location }).select('_id') } }
                        ]
                    },
                    {
                        $or: [
                            { destination: { $in: await Station.find({ location: destStation.location }).select('_id') } }
                        ]
                    }
                ]
            })
                .populate('source', 'name code')
                .populate('destination', 'name code');

            // Remove direct logic duplicates if any, but likely none if we reached here
            if (nearbyTrains.length > 0) {
                return res.json(nearbyTrains.map(t => ({ ...t.toObject(), type: 'NEARBY', isAlternative: true })));
            }
        }

        // Return empty if nothing found
        res.json([]);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get coaches for a train
// @route   GET /api/trains/:id/coaches
// @access  Public
const getTrainCoaches = async (req, res) => {
    try {
        const coaches = await Coach.find({ trainId: req.params.id });
        const coachChart = coaches.map(c => ({
            code: c.code,
            type: c.type,
            seatCount: c.seats.length,
            vacantCount: c.seats.filter(s => !s.isBooked).length
        }));
        res.json(coachChart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get availability for a train
// @route   GET /api/trains/:id/availability
// @access  Public
const getTrainAvailability = async (req, res) => {
    const { id } = req.params;
    const { date, classType } = req.query;

    if (!date || !classType) {
        return res.status(400).json({ message: 'Missing date or classType query params' });
    }

    try {
        const Booking = require('../models/Booking');

        // 1. Get Total Capacity for this train/class
        // Assuming capacity is constant across dates, derived from configuration of coaches
        const coaches = await Coach.find({ trainId: id, type: classType });
        if (!coaches || coaches.length === 0) {
            return res.json({ available: 0, status: 'NOT_AVAILABLE' });
        }

        const totalCapacity = coaches.reduce((acc, coach) => acc + coach.seats.length, 0);
        const racCapacity = Math.ceil(totalCapacity * 0.1); // 10% for RAC

        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const bookings = await Booking.find({
            train: id,
            journeyDate: { $gte: startOfDay, $lte: endOfDay },
            classType: classType,
            status: { $ne: 'Cancelled' }
        });

        // Create a deterministic "pseudo-booked" count based on date string and train ID
        // This makes the UI look active and varied even if no real bookings exist.
        const dateInput = String(date);
        const hash = dateInput.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) + id.slice(-5).split('').reduce((acc, char) => acc + parseInt(char, 16) || 0, 0);

        // Mock booked count between 5% and 25% of total capacity
        const mockBooked = Math.floor(((hash % 20) + 5) / 100 * totalCapacity);

        let bookedCount = mockBooked;
        bookings.forEach(b => {
            bookedCount += b.passengers.length;
        });

        let available = 0;
        let racCount = 0;
        let wlCount = 0;
        let status = '';

        if (bookedCount < totalCapacity) {
            available = totalCapacity - bookedCount;
            status = `AVL ${available}`;
        } else if (bookedCount < totalCapacity + racCapacity) {
            racCount = (totalCapacity + racCapacity) - bookedCount;
            status = `RAC ${racCount}`;
        } else {
            wlCount = bookedCount - (totalCapacity + racCapacity) + 1;
            status = `WL ${wlCount}`;
        }

        res.json({
            date: date,
            classType,
            totalCapacity,
            racCapacity,
            bookedCount,
            available,
            racCount,
            wlCount,
            status
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getTrains, createTrain, searchTrains, getTrainCoaches, getTrainAvailability };
