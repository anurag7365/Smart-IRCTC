const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Station = require('../models/Station');
const Train = require('../models/Train');

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for Seeding');

        // Clear existing data
        await Station.deleteMany({});
        await Train.deleteMany({});
        console.log('Cleared existing data');

        // 1. Create Stations
        const stations = [
            { code: 'NDLS', name: 'New Delhi', location: 'Delhi' },
            { code: 'BCT', name: 'Mumbai Central', location: 'Mumbai' },
            { code: 'HWH', name: 'Howrah Jn', location: 'Kolkata' },
            { code: 'MAS', name: 'MGR Chennai Central', location: 'Chennai' },
            { code: 'SBC', name: 'KSR Bengaluru', location: 'Bangalore' },
            { code: 'JP', name: 'Jaipur Jn', location: 'Jaipur' },
            { code: 'ADI', name: 'Ahmedabad Jn', location: 'Ahmedabad' },
            { code: 'LKO', name: 'Lucknow Charbagh', location: 'Lucknow' },
            { code: 'CNB', name: 'Kanpur Central', location: 'Kanpur' },
            { code: 'AGC', name: 'Agra Cantt', location: 'Agra' },
            { code: 'BSB', name: 'Varanasi Jn', location: 'Varanasi' },
            { code: 'Patna', code: 'PNBE', name: 'Patna Jn', location: 'Patna' },
            { code: 'PUNE', name: 'Pune Jn', location: 'Pune' },
            { code: 'SC', name: 'Secunderabad Jn', location: 'Hyderabad' }
        ];

        const createdStations = await Station.insertMany(stations);
        console.log(`Seeded ${createdStations.length} stations`);

        // Helper to find station ID by code
        const getStationId = (code) => createdStations.find(s => s.code === code)._id;

        // 2. Create Trains
        const trainData = [
            // Direct: Delhi -> Mumbai
            {
                name: 'Mumbai Rajdhani',
                number: '12952',
                source: getStationId('NDLS'),
                destination: getStationId('BCT'),
                daysOfOperation: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                classes: ['1A', '2A', '3A'],
                route: [
                    { station: getStationId('AGC'), arrivalTime: '18:00', departureTime: '18:05', distanceFromSource: 195 },
                    { station: getStationId('ADI'), arrivalTime: '04:00', departureTime: '04:10', distanceFromSource: 934 } // Overnight
                ]
            },
            // Direct: Delhi -> Howrah
            {
                name: 'Howrah Rajdhani',
                number: '12302',
                source: getStationId('NDLS'),
                destination: getStationId('HWH'),
                daysOfOperation: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                classes: ['1A', '2A', '3A'],
                route: [
                    { station: getStationId('CNB'), arrivalTime: '21:30', departureTime: '21:35', distanceFromSource: 440 },
                    { station: getStationId('PNBE'), arrivalTime: '04:30', departureTime: '04:40', distanceFromSource: 990 }
                ]
            },
            // Direct: Jaipur -> Delhi (Feeder for connections)
            {
                name: 'Ajmer Shatabdi',
                number: '12016',
                source: getStationId('JP'),
                destination: getStationId('NDLS'),
                daysOfOperation: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                classes: ['EC', 'CC'],
                route: [
                    { station: getStationId('AGC'), arrivalTime: '19:00', departureTime: '19:10', distanceFromSource: 240 } // Via Agra (Hypothetical for routing logic)
                ]
            },
            // Indirect: Jaipur -> Kolkata (Via Delhi or Agra)
            // Route 1: Jaipur -> Agra (Direct train exists above: 12016)
            // Route 2: Agra -> Howrah (Need a train from Agra to Howrah to complete JP->HWH via AGC)

            {
                name: 'Chambal Express',
                number: '12178',
                source: getStationId('AGC'),
                destination: getStationId('HWH'),
                daysOfOperation: ['Mon', 'Wed', 'Fri'],
                classes: ['2A', '3A', 'SL'],
                route: [
                    { station: getStationId('CNB'), arrivalTime: '10:00', departureTime: '10:10', distanceFromSource: 280 },
                    { station: getStationId('BSB'), arrivalTime: '15:00', departureTime: '15:15', distanceFromSource: 600 }
                ]
            },
            // Another feeder: Chennai -> Bangalore
            {
                name: 'Shatabdi Express',
                number: '12027',
                source: getStationId('MAS'),
                destination: getStationId('SBC'),
                daysOfOperation: ['Mon', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                classes: ['EC', 'CC'],
                route: []
            },
            // Bangalore -> Mumbai
            {
                name: 'Udyan Express',
                number: '11302',
                source: getStationId('SBC'),
                destination: getStationId('BCT'),
                daysOfOperation: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                classes: ['1A', '2A', '3A', 'SL'],
                route: [
                    { station: getStationId('PUNE'), arrivalTime: '15:00', departureTime: '15:05', distanceFromSource: 900 }
                ]
            }
        ];

        await Train.insertMany(trainData);
        console.log(`Seeded ${trainData.length} trains`);

        console.log('Seeding Complete!');
        process.exit();

    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
