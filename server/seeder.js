const mongoose = require('mongoose');
const dotenv = require('dotenv');
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

        // Create Stations
        const createdStations = await Station.create([

            { name: 'New Delhi', code: 'NDLS', location: 'Delhi' },
            { name: 'Mumbai Central', code: 'MMCT', location: 'Mumbai' },
            { name: 'Kanpur Central', code: 'CNB', location: 'Kanpur' },
            { name: 'Lucknow NR', code: 'LKO', location: 'Lucknow' },
            { name: 'Varanasi Jn', code: 'BSB', location: 'Varanasi' },
            { name: 'Bangalore City', code: 'SBC', location: 'Bangalore' },
            { name: 'Chennai Central', code: 'MAS', location: 'Chennai' },
            { name: 'Howrah Jn', code: 'HWH', location: 'Kolkata' },
            { name: 'Secunderabad', code: 'SC', location: 'Hyderabad' },
            { name: 'Pune Jn', code: 'PUNE', location: 'Pune' },
            { name: 'Indore Jn', code: 'INDB', location: 'Indore' },
            { name: 'Ahmedabad Jn', code: 'ADI', location: 'Ahmedabad' },
            { name: 'Daund Jn', code: 'DD', location: 'Daund' },
            { name: 'Jaipur Jn', code: 'JP', location: 'Jaipur' },
            { name: 'Chandigarh', code: 'CDG', location: 'Chandigarh' },
            { name: 'Bhopal Jn', code: 'BPL', location: 'Bhopal' },
            { name: 'Patna Jn', code: 'PNBE', location: 'Patna' },
            { name: 'Guwahati', code: 'GHY', location: 'Guwahati' },
            { name: 'Bhubaneswar', code: 'BBS', location: 'Bhubaneswar' },
            { name: 'Thiruvananthapuram', code: 'TVC', location: 'Trivandrum' },
            { name: 'Madgaon', code: 'MAO', location: 'Goa' },
            { name: 'Nagpur', code: 'NGP', location: 'Nagpur' },
            { name: 'Amritsar Jn', code: 'ASR', location: 'Amritsar' },
            { name: 'Agra Cantt', code: 'AGC', location: 'Agra' },
            { name: 'Gwalior Jn', code: 'GWL', location: 'Gwalior' },
            { name: 'Jhansi Jn', code: 'VGLJ', location: 'Jhansi' },
            { name: 'Kota Jn', code: 'KOTA', location: 'Kota' },
            { name: 'Jodhpur Jn', code: 'JU', location: 'Jodhpur' },
            { name: 'Udaipur City', code: 'UDZ', location: 'Udaipur' },
            { name: 'Ajmer Jn', code: 'AII', location: 'Ajmer' },
            { name: 'Gorakhpur Jn', code: 'GKP', location: 'Gorakhpur' },
            { name: 'Prayagraj Jn', code: 'PRYJ', location: 'Allahabad' },
            { name: 'Gaya Jn', code: 'GAYA', location: 'Gaya' },
            { name: 'Ranchi Jn', code: 'RNC', location: 'Ranchi' },
            { name: 'Raipur Jn', code: 'R', location: 'Raipur' },
            { name: 'Vishakhapatnam', code: 'VSKP', location: 'Vizag' },
            { name: 'Vijayawada Jn', code: 'BZA', location: 'Vijayawada' },
            { name: 'Mangalore Central', code: 'MAQ', location: 'Mangalore' },
            { name: 'Mysore Jn', code: 'MYS', location: 'Mysore' },
            { name: 'Coimbatore Jn', code: 'CBE', location: 'Coimbatore' },
            { name: 'Madurai Jn', code: 'MDU', location: 'Madurai' },
            { name: 'Surat', code: 'ST', location: 'Surat' },
            { name: 'Vadodara Jn', code: 'BRC', location: 'Vadodara' },
            { name: 'Rajkot Jn', code: 'RJT', location: 'Rajkot' },
            { name: 'Jammu Tawi', code: 'JAT', location: 'Jammu' },
            { name: 'Haridwar', code: 'HW', location: 'Haridwar' },
            { name: 'Dehradun', code: 'DDN', location: 'Dehradun' }
        ]);

        const ndls = createdStations.find(s => s.code === 'NDLS')._id;
        const mmct = createdStations.find(s => s.code === 'MMCT')._id;
        const cnb = createdStations.find(s => s.code === 'CNB')._id;
        const lko = createdStations.find(s => s.code === 'LKO')._id;
        const bsb = createdStations.find(s => s.code === 'BSB')._id;
        const sbc = createdStations.find(s => s.code === 'SBC')._id;
        const mas = createdStations.find(s => s.code === 'MAS')._id;
        const hwh = createdStations.find(s => s.code === 'HWH')._id;
        const sc = createdStations.find(s => s.code === 'SC')._id;
        const pune = createdStations.find(s => s.code === 'PUNE')._id;
        const indb = createdStations.find(s => s.code === 'INDB')._id;
        const adi = createdStations.find(s => s.code === 'ADI')._id;
        const dd = createdStations.find(s => s.code === 'DD')._id;
        const jp = createdStations.find(s => s.code === 'JP')._id;
        const cdg = createdStations.find(s => s.code === 'CDG')._id;
        const bpl = createdStations.find(s => s.code === 'BPL')._id;
        const pnbe = createdStations.find(s => s.code === 'PNBE')._id;
        const ghy = createdStations.find(s => s.code === 'GHY')._id;
        const bbs = createdStations.find(s => s.code === 'BBS')._id;
        const tvc = createdStations.find(s => s.code === 'TVC')._id;
        const mao = createdStations.find(s => s.code === 'MAO')._id;
        const ngp = createdStations.find(s => s.code === 'NGP')._id;
        const asr = createdStations.find(s => s.code === 'ASR')._id;

        // Create Trains
        await Train.create([
            {
                name: 'Mumbai Rajdhani',
                number: '12952',
                source: ndls,
                destination: mmct,
                daysOfOperation: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                classes: ['1A', '2A', '3A'],
                route: [
                    { station: cnb, arrivalTime: '21:00', departureTime: '21:05', distanceFromSource: 400 },
                ],
            },
            {
                name: 'Gomti Express',
                number: '12420',
                source: ndls,
                destination: lko,
                daysOfOperation: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                classes: ['2S', 'CC'],
                route: [
                    { station: cnb, arrivalTime: '19:30', departureTime: '19:35', distanceFromSource: 400 },
                ],
            },
            {
                name: 'Vande Bharat',
                number: '22436',
                source: ndls,
                destination: bsb,
                daysOfOperation: ['Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                classes: ['CC', 'EC'],
                route: [
                    { station: cnb, arrivalTime: '10:00', departureTime: '10:05', distanceFromSource: 400 },
                ],
            },
            {
                name: 'Daund Indore Ex',
                number: '22943',
                source: dd,
                destination: indb,
                daysOfOperation: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                classes: ['SL', '3A', '2A'],
                route: [
                    { station: pune, arrivalTime: '15:00', departureTime: '15:15', distanceFromSource: 75 },
                    { station: mmct, arrivalTime: '19:00', departureTime: '19:30', distanceFromSource: 260 }
                ],
            },
            {
                name: 'Chennai Express',
                number: '12604',
                source: mas,
                destination: hwh,
                daysOfOperation: ['Mon', 'Wed', 'Fri'],
                classes: ['SL', '3A', '2A'],
                route: [],
            },
            {
                name: 'Karnataka Exp',
                number: '12628',
                source: ndls,
                destination: sbc,
                daysOfOperation: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                classes: ['SL', '3A', '2A', '1A'],
                route: [
                    { station: cnb, arrivalTime: '18:00', departureTime: '18:10', distanceFromSource: 400 },
                    { station: sc, arrivalTime: '12:00', departureTime: '12:20', distanceFromSource: 1500 }
                ]
            },
            {
                name: 'Shatabdi Express',
                number: '12002',
                source: ndls,
                destination: bpl,
                daysOfOperation: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                classes: ['CC', 'EC'],
                route: [
                    { station: Math.random() > 0.5 ? cnb : new mongoose.Types.ObjectId(), arrivalTime: '10:00', departureTime: '10:05', distanceFromSource: 400 }, // Mock
                ],
            },
            {
                name: 'Goa Express',
                number: '12780',
                source: ndls,
                destination: mao,
                daysOfOperation: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                classes: ['SL', '3A', '2A', '1A'],
                route: [
                    { station: bpl, arrivalTime: '14:00', departureTime: '14:10', distanceFromSource: 700 },
                    { station: pune, arrivalTime: '04:00', departureTime: '04:15', distanceFromSource: 1600 }
                ]
            },
            {
                name: 'Amritsar Mail',
                number: '13005',
                source: hwh,
                destination: asr,
                daysOfOperation: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                classes: ['SL', '3A', '2A', '1A'],
                route: [
                    { station: pnbe, arrivalTime: '22:00', departureTime: '22:15', distanceFromSource: 530 },
                    { station: lko, arrivalTime: '08:00', departureTime: '08:15', distanceFromSource: 980 }
                ]
            },
            {
                name: 'Coromandel Exp',
                number: '12841',
                source: hwh,
                destination: mas,
                daysOfOperation: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                classes: ['SL', '3A', '2A', '1A'],
                route: [
                    { station: bbs, arrivalTime: '17:00', departureTime: '17:10', distanceFromSource: 440 }
                ]
            },
            {
                name: 'Kerala Express',
                number: '12626',
                source: ndls,
                destination: tvc,
                daysOfOperation: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                classes: ['SL', '3A', '2A'],
                route: [
                    { station: bpl, arrivalTime: '20:00', departureTime: '20:05', distanceFromSource: 700 },
                    { station: ngp, arrivalTime: '02:00', departureTime: '02:05', distanceFromSource: 1100 }
                ]
            },
            {
                name: 'Jaipur Superfast',
                number: '12986',
                source: ndls,
                destination: jp,
                daysOfOperation: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                classes: ['CC', '2S'],
                route: []
            },
            {
                name: 'Guwahati Rajdhani',
                number: '12424',
                source: ndls,
                destination: ghy,
                daysOfOperation: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                classes: ['1A', '2A', '3A'],
                route: [
                    { station: cnb, arrivalTime: '21:00', departureTime: '21:05', distanceFromSource: 400 },
                    { station: pnbe, arrivalTime: '04:00', departureTime: '04:10', distanceFromSource: 990 }
                ]
            }
        ]);

        // Create Coaches for ALL Trains dynamically
        const createdTrains = await Train.find({});
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
