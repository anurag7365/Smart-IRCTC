const express = require('express');
const router = express.Router();
const { addMasterPassenger, getMasterList } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.route('/masterlist').post(protect, addMasterPassenger).get(protect, getMasterList);

module.exports = router;
