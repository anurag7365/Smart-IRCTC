const User = require('../models/User');

// @desc    Add passenger to master list
// @route   POST /api/users/masterlist
// @access  Private
const addMasterPassenger = async (req, res) => {
    const { name, age, gender, berthPreference, aadhaar } = req.body;
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            user.masterList.push({ name, age, gender, berthPreference, aadhaar });
            await user.save();
            res.status(201).json(user.masterList);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get master list
// @route   GET /api/users/masterlist
// @access  Private
const getMasterList = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            res.json(user.masterList);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { addMasterPassenger, getMasterList };
