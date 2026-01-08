const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Train = require('./src/models/Train');
const Coach = require('./src/models/Coach');

dotenv.config();

const checkCoaches = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const trains = await Train.find({});
        for (const train of trains) {
            console.log(`\nTrain: ${train.name} (${train.number})`);
            const coaches = await Coach.find({ trainId: train._id });
            if (coaches.length === 0) {
                console.log('  !!! NO COACHES FOUND !!!');
            } else {
                const classes = [...new Set(coaches.map(c => c.type))];
                console.log(`  Coaches: ${coaches.length} across classes: ${classes.join(', ')}`);
                coaches.forEach(c => console.log(`    - ${c.code} (${c.type})`));
            }
        }

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkCoaches();
