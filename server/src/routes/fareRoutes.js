const express = require('express');
const router = express.Router();
const { getFare } = require('../controllers/fareController');

router.post('/calculate', getFare);

module.exports = router;
