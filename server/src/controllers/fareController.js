const { calculateFare } = require('../services/fareService');

// @desc    Calculate dynamic fare based on Map Distance
// @route   POST /api/fares/calculate
// @access  Public
const getFare = async (req, res) => {
    const { from, to, trainType, classType, quota } = req.body;

    try {
        if (!from || !to) return res.status(400).json({ message: 'From and To station codes required' });

        const fareDetails = await calculateFare(from, to, trainType || 'Express', classType || 'SL', quota || 'GN');
        res.json(fareDetails);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { getFare };
