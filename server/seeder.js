const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const connectDB = require('./src/config/db');
const Station = require('./src/models/Station');
const Train = require('./src/models/Train');
const User = require('./src/models/User');

dotenv.config();
connectDB();

const importData = async () => {
    try {
        await Station.deleteMany();
        await Train.deleteMany();
        await User.deleteMany();

        const users = await User.create([
            { name: 'Admin User', email: 'admin@example.com', password: 'password123', role: 'admin' },
            { name: 'John Doe', email: 'passenger@example.com', password: 'password123', role: 'passenger' }
        ]);

        console.log('Seeding Stations...');
        const stationsFile = path.join(__dirname, 'src', 'data', 'stations.json');
        const stationsData = JSON.parse(fs.readFileSync(stationsFile, 'utf-8'));
        const createdStations = await Station.create(stationsData);
        console.log(`Seeded ${createdStations.length} stations`);

        // Helper Map: Code -> ObjectId
        const stationMap = {};
        createdStations.forEach(s => {
            stationMap[s.code] = s._id;
        });

        console.log('Seeding Trains...');
        const trainsFile = path.join(__dirname, 'src', 'data', 'trains.json');
        const trainsRaw = JSON.parse(fs.readFileSync(trainsFile, 'utf-8'));

        // Transform raw JSON (with station codes) to DB format (with ObjectIds)
        const trainsData = trainsRaw.map(t => {
            // Map Source & Dest
            const sourceId = stationMap[t.source];
            const destId = stationMap[t.destination];

            if (!sourceId || !destId) {
                console.warn(`Skipping train ${t.number}: Invalid source(${t.source}) or destination(${t.destination})`);
                return null;
            }

            // Map Route
            const route = t.route.map(r => ({
                ...r,
                station: stationMap[r.station]
            })).filter(r => r.station); // Remove stops with invalid stations

            return {
                ...t,
                source: sourceId,
                destination: destId,
                route: route
            };
        }).filter(t => t); // Remove nulls

        const createdTrains = await Train.create(trainsData);
        console.log(`Seeded ${createdTrains.length} trains`);

        // Create Coaches for ALL Trains dynamically
        const Coach = require('./src/models/Coach');
        await Coach.deleteMany();

        const createSeats = (type, count) => {
            const seats = [];
            for (let i = 1; i <= count; i++) {
                let berth = 'Lower';
                if (['SL', '3A', '2A', '3E'].includes(type)) {
                    const mod = i % 8;
                    if (mod === 0) berth = 'Side Upper';
                    else if (mod === 7) berth = 'Side Lower';
                    else if (mod === 1 || mod === 4) berth = 'Lower';
                    else if (mod === 2 || mod === 5) berth = 'Middle';
                    else berth = 'Upper';
                } else if (['CC', '2S', 'EC', 'EA'].includes(type)) {
                    berth = i % 3 === 0 ? 'Window' : i % 3 === 1 ? 'Aisle' : 'Middle';
                } else if (type === '1A') {
                    berth = i % 2 === 0 ? 'Upper' : 'Lower';
                }

                seats.push({
                    number: i,
                    berth: berth,
                    isBooked: false
                });
            }
            return seats;
        };

        const coachData = [];
        for (const train of createdTrains) {
            for (const cls of train.classes) {
                // Create 2 coaches for each class
                const coachCount = 2;
                const seatCountMap = {
                    '1A': 24,
                    '2A': 48,
                    '3A': 64,
                    'SL': 72,
                    'CC': 60,
                    '2S': 72,
                    'EC': 40
                };
                const seatCount = seatCountMap[cls] || 60;

                const typePrefixMap = {
                    '1A': 'H',
                    '2A': 'A',
                    '3A': 'B',
                    'SL': 'S',
                    'CC': 'C',
                    '2S': 'D',
                    'EC': 'E'
                };
                const prefix = typePrefixMap[cls] || 'X';

                for (let i = 1; i <= coachCount; i++) {
                    coachData.push({
                        trainId: train._id,
                        code: `${prefix}${i}`,
                        type: cls,
                        seats: createSeats(cls, seatCount)
                    });
                }
            }
        }

        await Coach.insertMany(coachData);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await Station.deleteMany();
        await Train.deleteMany();
        await User.deleteMany();

        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
