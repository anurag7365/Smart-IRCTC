const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Train = require('./src/models/Train');
const Station = require('./src/models/Station');

dotenv.config();

const verify = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        // 1. Check Stations
        const stations = await Station.countDocuments();
        console.log(`Total Stations: ${stations}`);

        const randomStation = await Station.findOne({ code: 'NDLS' });
        console.log(`Sample Station: ${randomStation.name} (${randomStation.code}) - ${randomStation.state}`);

        // 2. Check Trains
        const trains = await Train.countDocuments();
        console.log(`Total Trains: ${trains}`);

        const randomTrain = await Train.findOne({ number: '12424' }).populate('source destination');
        if (randomTrain) {
            console.log(`Sample Train: ${randomTrain.name} (${randomTrain.number})`);
            console.log(`Route: ${randomTrain.source.code} -> ${randomTrain.destination.code}`);
            console.log(`Stops: ${randomTrain.route.length}`);
        } else {
            console.log('Sample Train 12424 (Rajdhani) not found, checking random...');
            const t = await Train.findOne().populate('source destination');
            console.log(`Random Train: ${t.name} (${t.number})`);
        }

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

verify();
