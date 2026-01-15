const Station = require('../models/Station');

// Configuration
const BASE_RATE = 1.5; // per km
const MIN_DISTANCE = 50; // km

const RATES = {
    '1A': 4.0, '2A': 3.0, '3A': 2.5, 'SL': 1.0, 'CC': 2.5, '2S': 0.8
};

const TRAIN_TYPE_SURCHARGE = {
    'Rajdhani': 500, 'Shatabdi': 300, 'Duronto': 400, 'Superfast': 50, 'Express': 0
};

// Haversine Formula for Distance (km)
const getDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return MIN_DISTANCE; // Default if missing coords

    const R = 6371; // Radius of Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

const calculateFare = async (fromCode, toCode, trainType, classType, quota = 'GN') => {
    // 1. Fetch Station Coordinates
    const stations = await Station.find({ code: { $in: [fromCode, toCode] } });
    const s1 = stations.find(s => s.code === fromCode);
    const s2 = stations.find(s => s.code === toCode);

    if (!s1 || !s2) throw new Error("Invalid Station Codes");

    // 2. Calculate Distance
    let distance = getDistance(s1.latitude, s1.longitude, s2.latitude, s2.longitude);
    distance = Math.max(distance, MIN_DISTANCE); // Apply Min Distance

    // 3. Rate Calculation
    const classRate = RATES[classType] || 1.0;

    // Telescopic Logic (Simulated)
    let adjustedRate = BASE_RATE;
    if (distance > 500) adjustedRate *= 0.9;
    if (distance > 1000) adjustedRate *= 0.8;

    let baseFare = distance * adjustedRate * classRate;

    // 4. Surcharges
    const surcharge = TRAIN_TYPE_SURCHARGE[trainType] || 0;
    let totalFare = baseFare + surcharge;

    // 5. Quota & GST
    if (quota === 'TQ') totalFare += Math.max(totalFare * 0.3, 150); // Tatkal
    if (['1A', '2A', '3A', 'CC'].includes(classType)) totalFare *= 1.05; // 5% GST

    // 6. Rounding
    totalFare = Math.ceil(totalFare / 5) * 5;

    return {
        distance: Math.round(distance),
        baseFare: Math.round(baseFare),
        surcharge,
        totalFare
    };
};

module.exports = { calculateFare, getDistance };
