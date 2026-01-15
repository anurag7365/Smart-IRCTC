const mongoose = require('mongoose');
const dotenv = require('dotenv');
const https = require('https');
const Train = require('./src/models/Train');
const Station = require('./src/models/Station');

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI).then(() => console.log('MongoDB Connected'))
    .catch(err => {
        console.error(`Error: ${err.message}`);
        process.exit(1);
    });

// Helper to fetch JSON from URL
const fetchJson = (url) => {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', err => reject(err));
    });
};

const importData = async () => {
    try {
        console.log('Fetching Station Data...');
        const stationData = await fetchJson('https://raw.githubusercontent.com/datameet/railways/master/stations.json');

        console.log(`Found ${stationData.features.length} stations. Parsing...`);

        const stations = stationData.features.map(f => {
            const coords = f.geometry && f.geometry.coordinates ? f.geometry.coordinates : [0, 0];
            return {
                name: f.properties.name,
                code: f.properties.code,
                location: f.properties.address || 'India', // Fallback
                state: f.properties.state || 'India',
                zone: f.properties.zone || 'IR',
                longitude: coords[0],
                latitude: coords[1]
            };
        }).filter(s => s.code && s.name); // Basic validation

        // Upsert Stations (Update if exists, Insert if new)
        console.log('Importing Stations...');
        let stationCount = 0;
        for (let s of stations) {
            await Station.findOneAndUpdate({ code: s.code }, s, { upsert: true, new: true });
            stationCount++;
            if (stationCount % 500 === 0) process.stdout.write('.');
        }
        console.log('\nStations Imported!');

        // Fetch Trains and Schedules
        console.log('Fetching Train Schedules...');
        const trainList = await fetchJson('https://raw.githubusercontent.com/datameet/railways/master/trains.json');
        const schedules = await fetchJson('https://raw.githubusercontent.com/datameet/railways/master/schedules.json');

        console.log(`Found ${trainList.features.length} trains and ${schedules.length} schedule entries.`);

        // Cache Stations for Route Building
        const allStations = await Station.find({});
        const stationMap = {};
        allStations.forEach(s => stationMap[s.code] = s._id);

        // Group Schedules by Train Number
        const timetable = {};
        schedules.forEach(entry => {
            if (!timetable[entry.train_number]) timetable[entry.train_number] = [];
            timetable[entry.train_number].push(entry);
        });

        // Process Trains
        console.log('Processing Trains (This may take a while)...');
        let trainCount = 0;

        for (let t of trainList.features) {
            const number = t.properties.number;
            const name = t.properties.name;
            const type = 'Express'; // Default as data doesn't explicitly have our types

            const entries = timetable[number];
            if (!entries) continue; // No schedule found

            // Build Route
            const route = [];
            let sourceId = null;
            let destId = null;

            for (let i = 0; i < entries.length; i++) {
                const entry = entries[i];
                // Check if station_code exists in map
                let stnId = stationMap[entry.station_code];

                // If not found, skip stop (we can't add stop for unknown station)
                if (!stnId) continue;

                if (i === 0) sourceId = stnId;
                if (i === entries.length - 1) destId = stnId;

                route.push({
                    station: stnId,
                    arrivalTime: entry.arrival || '00:00',
                    departureTime: entry.departure || '00:00',
                    distanceFromSource: i * 50, // Mock distance
                    dayCount: 1
                });
            }

            if (route.length < 2) continue; // Invalid route

            const trainDoc = {
                name,
                number,
                type,
                source: sourceId, // Mongoose ID
                destination: destId, // Mongoose ID
                daysOfOperation: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], // Default Daily
                classes: ['SL', '3A', '2A', '1A'], // Default classes
                route: route
            };

            await Train.findOneAndUpdate({ number: number }, trainDoc, { upsert: true });
            trainCount++;
            if (trainCount % 100 === 0) console.log(`Imported ${trainCount} trains...`);
        }

        console.log(`\nImported ${trainCount} Trains!`);
        process.exit();

    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

importData();
